// @flow
import { uniqueId } from 'lodash';
import { useMemo, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import {
  useFetchValidationCountryOptionsQuery,
  useFetchValidPositionOptionsQuery,
  useSearchSquadListQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import type {
  GridConfig,
  Row,
  Column,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/types';

import buildCellContent from '../utils/cells/cellBuilder';

import athleteHeaders from '../utils/massUploadHeaders/athleteHeaders';

import type { CSVAthlete, AthleteValidationState, RuleSet } from '../types';

import { isDateValid, isEmailValid, getCommonRulesetFields } from '../utils';

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'AthleteUploadGrid';

const acceptedDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];

export type ReturnType = {
  grid: GridConfig,
  isLoading: boolean,
  isError: boolean,
  ruleset: { [key: string]: RuleSet },
  buttonText: string,
  title: string,
};

const buttonText = i18n.t('Upload Athletes');
const title = i18n.t('Upload Athletes');

const useAthleteUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<CSVAthlete>,
}): ReturnType => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const {
    data: positionValidationOptions = { abbreviations: [], names: [] },
    error: positionValidationError,
    isLoading: isPositionValidationLoading,
  } = useFetchValidPositionOptionsQuery();

  const {
    data: countryValidationOptions = { abbreviations: [], names: [] },
    error: countryValidationError,
    isLoading: isCountryValidationLoading,
  } = useFetchValidationCountryOptionsQuery();

  const {
    data: squadOptions = { data: [], meta: {} },
    error: squadValidationError,
    isLoading: isSquadsValidationLoading,
  } = useSearchSquadListQuery();

  const columns: Array<Column> = useMemo(() => athleteHeaders, []);

  const validation: { [key: string]: Function } = {
    FirstName: (value) => (value ? null : i18n.t('FirstName is required')),
    LastName: (value) => (value ? null : i18n.t('LastName is required')),
    Email: (value) =>
      isEmailValid({ email: value })
        ? null
        : i18n.t('A valid Email is required'),
    DOB: (value) =>
      isDateValid({ date: value, acceptedFormats: acceptedDateFormats })
        ? null
        : i18n.t(
            'The date entered is in not a valid format. Check the Instructions tab for more information.'
          ),
    SquadName: (value) => {
      const squadNames = [
        ...new Set(squadOptions?.data?.map((squad) => squad.name)),
      ];

      const hasValidSquads = value?.split('|').every((squad) => {
        const trimmedSquad = squad.trim();
        return squadNames.includes(trimmedSquad);
      });

      return hasValidSquads
        ? null
        : i18n.t(
            'One or more of the squads entered are not active squads. Check the Instructions tab for valid squads.'
          );
    },
    Country: (value) =>
      countryValidationOptions.abbreviations.includes(value) ||
      countryValidationOptions.names.includes(value)
        ? null
        : i18n.t(
            'The Country entered is not an acceptable format. Check the Instructions tab for more information.'
          ),
    Position: (value) =>
      positionValidationOptions.abbreviations.includes(value) ||
      positionValidationOptions.names.includes(value)
        ? null
        : i18n.t(
            'The Position entered is not a recognised position. Check the Instructions tab for valid positions.'
          ),
  };

  const ruleset: { [key: string]: RuleSet } = {
    ...getCommonRulesetFields('player'),
    SquadName: {
      description: i18n.t('The name(s) of the team(s) the player is part of.'),
      exampleText: 'U16, U16 | U18',
      exampleList: [...new Set(squadOptions?.data?.map((squad) => squad.name))],
    },
    Country: {
      description: i18n.t('Must be US for United States or CA for Canada.'),
      exampleText: 'US',
      exampleList: ['US', 'CA'],
    },
    Position: {
      description: i18n.t('Must be a valid position'),
      exampleText: 'GK or Goalkeeper',
      exampleList: positionValidationOptions.abbreviations?.map((pos) => pos),
    },
  };

  const preValidationCheck = (athlete: CSVAthlete): AthleteValidationState => {
    return Object.fromEntries(
      Object.keys(athlete).map((key) => {
        if (!validation[key]) {
          const errorKey: string = key;
          return {
            ...validation,
            [errorKey]: key,
          };
        }
        return [key, validation[key](athlete[key])];
      })
    );
  };

  const buildCellData = (athlete: CSVAthlete) => {
    const validationCheck = preValidationCheck(athlete);
    const hasErrors = Object.values(validationCheck).some((v) => v);

    if (hasErrors) {
      setIsMalformedData(true);
    }

    return {
      id: uniqueId(),
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(
          column,
          athlete,
          validationCheck[column.row_key],
          ['SquadName', 'Country', 'Position'].includes(column.row_key)
        ),
      })),
      classnames: {
        is__error: Object.values(validationCheck).some((v) => v),
      },
    };
  };

  const buildRowData = (athletes): Array<Row> => {
    setIsMalformedData(false);
    return athletes.map(buildCellData);
  };

  const rows = useMemo(() => buildRowData(parsedCsv), [parsedCsv]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: gridId,
  };

  return {
    grid,
    isLoading:
      isCountryValidationLoading ||
      isPositionValidationLoading ||
      isSquadsValidationLoading,
    isError:
      countryValidationError ||
      positionValidationError ||
      squadValidationError ||
      isMalformedData,
    ruleset,
    buttonText,
    title,
  };
};

export default useAthleteUploadGrid;

// @flow
import { uniqueId } from 'lodash';
import { useMemo, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { languageDropdownOptions } from '@kitman/modules/src/Officials/shared/languageDropdownOptions';

import type {
  GridConfig,
  Row,
  Column,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/types';

import buildCellContent from '../utils/cells/cellBuilder';

import scoutHeaders from '../utils/massUploadHeaders/scoutHeaders';

import type { CSVScouts, ScoutValidationState, RuleSet } from '../types';

import { isDateValid, isEmailValid, getCommonRulesetFields } from '../utils';

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'ScoutUploadGrid';

const acceptedDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];

export type ReturnType = {
  grid: GridConfig,
  isLoading: boolean,
  isError: boolean,
  ruleset: { [key: string]: RuleSet },
  buttonText: string,
  title: string,
};

const buttonText = i18n.t('Upload Scouts');
const title = i18n.t('Upload Scouts');

const useScoutUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<CSVScouts>,
}): ReturnType => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const columns: Array<Column> = useMemo(() => scoutHeaders, []);

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
    Language: (value) =>
      languageDropdownOptions.map((item) => item.value).includes(value)
        ? null
        : i18n.t(
            'The Language entered is not in a supported format. Check the Instructions tab for supported language formats.'
          ),
    Type: (value) => (value ? null : i18n.t('Type is required')),
  };

  const ruleset: { [key: string]: RuleSet } = {
    ...getCommonRulesetFields('scout'),
    Language: {
      description: i18n.t('Must be a valid language.'),
      exampleText: 'en',
      exampleList: languageDropdownOptions.map(({ value }) => value),
    },
    Type: {
      description: i18n.t('The scout type.'),
      exampleText: 'Scout',
      exampleList: [],
    },
    // validation is not required for organisation
    Organisation: {
      description: i18n.t("The scout's Organisation."),
      exampleText: 'Club FC',
      exampleList: [],
    },
  };

  const preValidationCheck = (scout: CSVScouts): ScoutValidationState => {
    return Object.fromEntries(
      Object.keys(scout).map((key) => {
        if (!validation[key]) {
          const errorKey: string = key;
          return {
            ...validation,
            [errorKey]: key,
          };
        }

        return [key, validation[key](scout[key])];
      })
    );
  };

  const buildCellData = (scout: CSVScouts) => {
    const validationCheck = preValidationCheck(scout);
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
          scout,
          validationCheck[column.row_key]
        ),
      })),
      classnames: {
        is__error: Object.values(validationCheck).some((v) => v),
      },
    };
  };

  const buildRowData = (scouts): Array<Row> => {
    setIsMalformedData(false);
    return scouts.map(buildCellData);
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
    isLoading: false,
    isError: isMalformedData,
    ruleset,
    buttonText,
    title,
  };
};

export default useScoutUploadGrid;

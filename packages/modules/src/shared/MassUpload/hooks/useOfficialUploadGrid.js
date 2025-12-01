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

import officialHeaders from '../utils/massUploadHeaders/officialHeaders';

import type { CSVOfficial, OfficialValidationState, RuleSet } from '../types';

import { isDateValid, isEmailValid, getCommonRulesetFields } from '../utils';

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'OfficialUploadGrid';

const acceptedDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];

export type ReturnType = {
  grid: GridConfig,
  isLoading: boolean,
  isError: boolean,
  ruleset: { [key: string]: RuleSet },
  buttonText: string,
  title: string,
};

const buttonText = i18n.t('Upload Officials');
const title = i18n.t('Upload Officials');

const useOfficialUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<CSVOfficial>,
}): ReturnType => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const columns: Array<Column> = useMemo(() => officialHeaders, []);

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
  };

  const ruleset: { [key: string]: RuleSet } = {
    ...getCommonRulesetFields('official'),
    Language: {
      description: i18n.t('Must be a valid language.'),
      exampleText: 'en',
      exampleList: languageDropdownOptions.map(({ value }) => value),
    },
  };

  const preValidationCheck = (
    official: CSVOfficial
  ): OfficialValidationState => {
    return Object.fromEntries(
      Object.keys(official).map((key) => {
        if (!validation[key]) {
          const errorKey: string = key;
          return {
            ...validation,
            [errorKey]: key,
          };
        }

        return [key, validation[key](official[key])];
      })
    );
  };

  const buildCellData = (official: CSVOfficial) => {
    const validationCheck = preValidationCheck(official);
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
          official,
          validationCheck[column.row_key]
        ),
      })),
      classnames: {
        is__error: Object.values(validationCheck).some((v) => v),
      },
    };
  };

  const buildRowData = (officials): Array<Row> => {
    setIsMalformedData(false);
    return officials.map(buildCellData);
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

export default useOfficialUploadGrid;

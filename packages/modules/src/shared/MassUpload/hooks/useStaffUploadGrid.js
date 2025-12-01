// @flow
import { uniqueId } from 'lodash';
import { useMemo, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import { useSearchSquadListQuery } from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import type {
  GridConfig,
  Row,
  Column,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/types';

import buildCellContent from '../utils/cells/cellBuilder';

import staffHeaders from '../utils/massUploadHeaders/staffHeaders';

import type { CSVStaff, StaffValidationState, RuleSet } from '../types';

import { isDateValid, isEmailValid, getCommonRulesetFields } from '../utils';

export const emptyTableText = i18n.t('No valid data was found in csv.');

const gridId = 'StaffUploadGrid';

const acceptedDateFormats = ['YYYY-MM-DD', 'YYYY/MM/DD'];

export type ReturnType = {
  grid: GridConfig,
  isLoading: boolean,
  isError: boolean,
  ruleset: { [key: string]: RuleSet },
  buttonText: string,
  title: string,
};

const buttonText = i18n.t('Upload Users');
const title = i18n.t('Upload Users');

const useStaffUploadGrid = ({
  parsedCsv,
}: {
  parsedCsv: Array<CSVStaff>,
}): ReturnType => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const {
    data: squadOptions = { data: [], meta: {} },
    error: squadValidationError,
    isLoading: isSquadsValidationLoading,
  } = useSearchSquadListQuery();

  const columns: Array<Column> = useMemo(() => staffHeaders, []);

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
    SquadName: (value) =>
      [...new Set(squadOptions?.data?.map((squad) => squad.name))].includes(
        value
      )
        ? null
        : i18n.t(
            'The Squad entered is not an active squad. Check the Instructions tab for valid squads.'
          ),
  };

  const ruleset: { [key: string]: RuleSet } = {
    ...getCommonRulesetFields('staff member'),
    SquadName: {
      description: i18n.t('The name of the team the staff member is part of.'),
      exampleText: 'U16',
      exampleList: [...new Set(squadOptions?.data?.map((squad) => squad.name))],
    },
  };

  const preValidationCheck = (staff: CSVStaff): StaffValidationState => {
    return Object.fromEntries(
      Object.keys(staff).map((key) => {
        if (!validation[key]) {
          const errorKey: string = key;
          return {
            ...validation,
            [errorKey]: key,
          };
        }

        return [key, validation[key](staff[key])];
      })
    );
  };

  const buildCellData = (staffMember: CSVStaff) => {
    const validationCheck = preValidationCheck(staffMember);
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
          staffMember,
          validationCheck[column.row_key],
          ['SquadName'].includes(column.row_key)
        ),
      })),
      classnames: {
        is__error: Object.values(validationCheck).some((v) => v),
      },
    };
  };

  const buildRowData = (staff): Array<Row> => {
    setIsMalformedData(false);
    return staff.map(buildCellData);
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
    isLoading: isSquadsValidationLoading,
    isError: squadValidationError || isMalformedData,
    ruleset,
    buttonText,
    title,
  };
};

export default useStaffUploadGrid;

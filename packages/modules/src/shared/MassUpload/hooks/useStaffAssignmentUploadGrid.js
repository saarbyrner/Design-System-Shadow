// @flow
import { uniqueId } from 'lodash';
import { useMemo, useState } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import type {
  GridConfig,
  Row,
  Column,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/types';

import buildCellContent from '../utils/cells/cellBuilder';

import {
  officialAssignmentHeaders,
  matchMonitorAssignmentHeaders,
} from '../utils/massUploadHeaders/staffAssignmentHeaders';

import type {
  CSVStaffAssignment,
  CSVStaffAssignmentValidationState,
  RuleSet,
  UserTypes,
} from '../types';

import {
  isEmailValid,
  MATCH_MONITOR_ASSIGNMENT,
  OFFICIAL_ASSIGNMENT,
} from '../utils';

export const emptyTableText = i18n.t('No valid data was found in csv.');

export type ReturnType = {
  grid: GridConfig,
  isLoading: boolean,
  isError: boolean,
  ruleset: { [key: string]: RuleSet },
  buttonText: string,
  title: string,
};

const useStaffAssignmentUploadGrid = ({
  parsedCsv,
  userType,
}: {
  parsedCsv: Array<CSVStaffAssignment>,
  userType?: UserTypes,
}): ReturnType => {
  const [isMalformedData, setIsMalformedData] = useState(false);

  const columns: Array<Column> = useMemo(() => {
    if (userType === MATCH_MONITOR_ASSIGNMENT) {
      return matchMonitorAssignmentHeaders;
    }

    return officialAssignmentHeaders;
  }, []);

  const getButtonText = () => {
    if (userType === MATCH_MONITOR_ASSIGNMENT) return i18n.t('Assign Monitors');
    return i18n.t('Assign Officials');
  };

  const getGridId = () => {
    if (userType === MATCH_MONITOR_ASSIGNMENT)
      return 'MatchMonitorAssignmentUploadGrid';
    return 'OfficialAssignmentUploadGrid';
  };

  const validation: { [key: string]: Function } = {
    'Game ID': (value) => (value ? null : i18n.t('Game ID is required')),
    Email: (value) =>
      isEmailValid({ email: value })
        ? null
        : i18n.t('A valid Email is required'),
    ...(userType === OFFICIAL_ASSIGNMENT
      ? { Role: (value) => (value ? null : i18n.t('Role is required')) }
      : {}),
  };

  const ruleset: { [key: string]: RuleSet } = {
    'Game ID': {
      description: i18n.t('Game ID'),
      exampleText: '123456',
      exampleList: [],
    },
    Email: {
      description: i18n.t(
        'The email address associated with the official being assigned.'
      ),
      exampleText: 'john.doe@email.com',
      exampleList: [],
    },
    ...(userType === OFFICIAL_ASSIGNMENT
      ? {
          Role: {
            description: i18n.t('The role of the official being assigned.'),
            exampleText: 'Referee',
            exampleList: [],
          },
        }
      : {}),
  };

  const preValidationCheck = (
    officialAssignments: CSVStaffAssignment
  ): CSVStaffAssignmentValidationState => {
    return Object.fromEntries(
      Object.keys(officialAssignments).map((key) => {
        if (!validation[key]) {
          const errorKey: string = key;
          return {
            ...validation,
            [errorKey]: key,
          };
        }

        return [key, validation[key](officialAssignments[key])];
      })
    );
  };

  const buildCellData = (officialAssignments: CSVStaffAssignment) => {
    const validationCheck = preValidationCheck(officialAssignments);
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
          officialAssignments,
          validationCheck[column.row_key]
        ),
      })),
      classnames: {
        is__error: Object.values(validationCheck).some((v) => v),
      },
    };
  };

  const buildRowData = (officialAssignments): Array<Row> => {
    setIsMalformedData(false);
    return officialAssignments.map(buildCellData);
  };

  const rows = useMemo(() => buildRowData(parsedCsv), [parsedCsv]);

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: getGridId(),
  };

  return {
    grid,
    isLoading: false,
    isError: isMalformedData,
    ruleset,
    buttonText: getButtonText(),
    title: getButtonText(),
  };
};

export default useStaffAssignmentUploadGrid;

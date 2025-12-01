// @flow
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'uuid';
import { useEffect, useMemo, useCallback } from 'react';
import i18n from '@kitman/common/src/utils/i18n';

import { useFetchAssigneesQuery } from '../services/conditionalFields';

import type {
  Column,
  GridConfig,
  Row,
  Assignees,
  ShortAssignment,
} from '../types';

import {
  SquadHeader,
  ActivePlayersHeader,
  AssignedHeader,
  AssignedDateHeader,
} from '../components/CommonGridStyle/headers';

import {
  selectEditMode,
  updateEditMode,
  updateFetchedAssignments,
  updateAssignments,
  updateAssignment,
  selectAssignments,
} from '../redux/slices/assigneesSlice';

import buildCellContent from '../components/AssigneesGrid/cellBuilder';

type InitialAssigneesData = Assignees | Object;

export type ReturnType = {
  assignments: Array<ShortAssignment>,
  grid: GridConfig,
  isAssigneesError: boolean,
  areAssigneesFetching: boolean,
};

export const getEmptyTableText = () => i18n.t('No assignments');

const gridId = 'AssigneesGrid';

const initialAssigneesData: InitialAssigneesData = { assignments: [] };

const useAssigneesGrid = ({
  rulesetCurrentVersionId,
}: {
  rulesetCurrentVersionId?: number | null,
}): ReturnType => {
  const dispatch = useDispatch();

  const {
    data: { assignments: assignmentsList } = initialAssigneesData,
    isFetching: areAssigneesFetching,
    isError: isAssigneesError,
  } = useFetchAssigneesQuery(rulesetCurrentVersionId, {
    skip: !rulesetCurrentVersionId,
  });

  useEffect(() => {
    if (!assignmentsList.length) {
      return;
    }
    const assignments = assignmentsList.map((assignment) => ({
      squad_id: assignment.assignee.id,
      active: 'active' in assignment ? assignment.active : false,
    }));
    dispatch(updateFetchedAssignments(assignments));
    dispatch(updateAssignments(assignments));
    dispatch(updateEditMode(false));
  }, [dispatch, assignmentsList]);

  const editMode = useSelector(selectEditMode);
  const assignments = useSelector(selectAssignments);
  const activeAssignments = assignments.filter(
    (assignment) => assignment.active
  );
  const checked =
    assignments.length !== 0 && assignments.length === activeAssignments.length;
  const indeterminate =
    activeAssignments.length !== 0 &&
    assignments.length !== activeAssignments.length;

  const onCheckboxHeaderChange = useCallback(
    (event) => {
      dispatch(
        updateAssignments(
          assignments.map((assignment) => ({
            squad_id: assignment.squad_id,
            active: event.target.checked,
          }))
        )
      );
    },
    [dispatch, assignments]
  );

  const onCheckboxChange = (event, assigneeId) => {
    dispatch(
      updateAssignment({ squad_id: assigneeId, active: event.target.checked })
    );
  };

  const columns: Array<Column> = useMemo(
    () => [
      SquadHeader,
      ActivePlayersHeader,
      AssignedHeader(editMode, checked, indeterminate, onCheckboxHeaderChange),
      AssignedDateHeader,
    ],
    [editMode, checked, indeterminate, onCheckboxHeaderChange]
  );

  const buildRowData = (asgmts): Array<Row> => {
    return asgmts.map((assignment) => ({
      id: assignment.id || uuid.v4(),
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(column, {
          editMode,
          assignment,
          assignments,
          onChange: onCheckboxChange,
        }),
      })),
    }));
  };

  const rows = useMemo(
    () => buildRowData(assignmentsList),
    [assignmentsList, editMode, assignments]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText: getEmptyTableText(),
    id: gridId,
  };

  return {
    areAssigneesFetching,
    isAssigneesError,
    grid,
    assignments: assignmentsList,
  };
};

export default useAssigneesGrid;

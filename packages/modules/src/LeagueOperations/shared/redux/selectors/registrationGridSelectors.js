// @flow
import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { createSelector } from 'reselect';
import { REDUCER_KEY } from '../slices/registrationGridSlice';

export const getGrids = (state: Store): Object => state[REDUCER_KEY].grids;
export const getModal = (state: Store): boolean => state[REDUCER_KEY].modal;
export const getSelectedRow = (state: Store) => state[REDUCER_KEY].selectedRow;
export const getPanel = (state: Store): boolean => state[REDUCER_KEY].panel;
export const getApprovalState = (state: Store) =>
  state[REDUCER_KEY].approvalState;
export const getBulkActionsState = (state: Store) => state[REDUCER_KEY].bulkActions;
export const getSelectedLabelIds = createSelector(
    [getBulkActionsState],
    (bulkActions) => bulkActions.selectedLabelIds
);

export const getOriginalSelectedLabelIds = createSelector(
    [getBulkActionsState],
    (bulkActions) => bulkActions.originalSelectedLabelIds
);

export const getSelectedAthleteIds = createSelector(
    [getBulkActionsState],
    (bulkActions) => bulkActions.selectedAthleteIds
);

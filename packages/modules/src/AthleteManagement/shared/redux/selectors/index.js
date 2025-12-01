// @flow

import type { Store } from '../../types';
import {
  REDUCER_KEY,
  type BulkActionsData,
  type AthleteManagementState,
} from '../slices/athleteManagementSlice';

export const getPanelState = (
  state: Store
): $PropertyType<AthleteManagementState, 'panels'> => state[REDUCER_KEY].panels;

export const getBulkActionsState = (state: Store): BulkActionsData =>
  state[REDUCER_KEY].bulkActions;

export const getSelectedSquadIds = (state: Store): Array<number> =>
  state[REDUCER_KEY].bulkActions.selectedSquadIds || [];

export const getShouldRemovePrimarySquad = (state: Store): boolean =>
  state[REDUCER_KEY].bulkActions.shouldRemovePrimarySquad;

export const getSearchQuery = (state: Store): boolean =>
  state[REDUCER_KEY].searchQuery;

export const getSelectedLabelIds = (state: Store): Array<number> =>
  state[REDUCER_KEY].bulkActions.selectedLabelIds || [];

export const getOriginalSelectedLabelIds = (state: Store): Array<number> =>
  state[REDUCER_KEY].bulkActions.originalSelectedLabelIds || [];

export const getCurrentStatus = (state: Store): boolean =>
  state[REDUCER_KEY].statuses;

export const getSelectedAvailabilityStatus = (state: Store): string =>
  state[REDUCER_KEY].bulkActions.selectedStatus;

export const getOriginalStatus = (state: Store): string =>
  state[REDUCER_KEY].bulkActions.originalStatus || null;

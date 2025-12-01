// @flow
import type { Store } from '@kitman/modules/src/UserMovement/shared/types/index';
import { createSelector } from '@reduxjs/toolkit';

import type { ElementOpenState } from '../slices/movementHistorySlice';
import type { HistoricalMovementRecord } from '../services/api/postMovementRecordHistory';

import { REDUCER_KEY } from '../slices/movementHistorySlice';

import { userMovementApi } from '../services';

export const getMovementHistoryResult = (params: { userId: number }) => {
  return userMovementApi.endpoints.postMovementRecordHistory.select(params);
};

export const getMovementHistory = (params: {
  userId: number,
}): HistoricalMovementRecord =>
  createSelector(
    [getMovementHistoryResult(params)],
    (history) => history.data?.data || []
  );

export type Selector<T> = (state: Store) => T;

export const getDrawerState = (state: Store): ElementOpenState =>
  state[REDUCER_KEY].drawer;

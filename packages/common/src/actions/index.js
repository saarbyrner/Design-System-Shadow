// @flow
import type {
  GroupBy,
  SetGroupByAction,
  SetNameFilterAction,
  ClearNameFilterAction,
  SetAthletesAction,
} from '@kitman/common/src/types';

export const setGroupBy = (groupBy: GroupBy): SetGroupByAction => ({
  type: 'SET_GROUP_BY',
  payload: {
    groupBy,
  },
});

export const setNameFilter = (value: string): SetNameFilterAction => ({
  type: 'SET_NAME_FILTER',
  payload: {
    value,
  },
});

export const clearNameFilter = (): ClearNameFilterAction => ({
  type: 'CLEAR_NAME_FILTER',
});

export const setAthletes = (athletes: Object): SetAthletesAction => ({
  type: 'SET_ATHLETES',
  payload: {
    athletes,
  },
});

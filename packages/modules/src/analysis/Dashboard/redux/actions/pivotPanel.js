// @flow
import type { Action } from '../types/actions';

export const toggleSlidingPanel = (): Action => ({
  type: 'TOGGLE_SLIDING_PANEL',
});

export const updateAggregationPeriod = (
  graphId: string,
  aggregationPeriod: string
): Action => ({
  type: 'UPDATE_AGGREGATION_PERIOD',
  payload: {
    graphId,
    aggregationPeriod,
  },
});

// @flow
import type {
  GraphGroup,
  AggregationPeriod,
  Decorators,
} from '@kitman/modules/src/analysis/shared/types';
import type { Action } from '../../types/actions/GraphView';

export const updateDecorators = (
  graphGroup: GraphGroup,
  decorators: Decorators
): Action => ({
  type: 'UPDATE_DECORATORS',
  payload: {
    graphGroup,
    decorators,
  },
});

export const updateAggregationPeriod = (
  aggregationPeriod: AggregationPeriod
): Action => ({
  type: 'UPDATE_AGGREGATION_PERIOD',
  payload: {
    aggregationPeriod,
  },
});

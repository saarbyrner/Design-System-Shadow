// @flow
import type {
  GraphGroup,
  AggregationPeriod,
  Decorators,
} from '@kitman/modules/src/analysis/shared/types';

// actions
type updateDecorators = {
  type: 'UPDATE_DECORATORS',
  payload: {
    graphGroup: GraphGroup,
    decorators: Decorators,
  },
};

type updateAggregationPeriod = {
  type: 'UPDATE_AGGREGATION_PERIOD',
  payload: {
    aggregationPeriod: AggregationPeriod,
  },
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type createNewGraph = {
  type: 'CREATE_NEW_GRAPH',
};

export type Action =
  | updateDecorators
  | updateAggregationPeriod
  | serverRequest
  | serverRequestError
  | hideAppStatus
  | createNewGraph;

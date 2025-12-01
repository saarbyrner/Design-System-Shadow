// @flow
import type { SummaryDonutGraphState } from '../../../../types';

type createGraphSuccess = {
  type: 'formSummaryDonut/COMPOSE_GRAPH_SUCCESS',
  payload: SummaryDonutGraphState,
};

export type Action = createGraphSuccess;

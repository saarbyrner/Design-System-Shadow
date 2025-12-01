// @flow
import type { SummaryBarGraphState } from '../../../../types';

type createGraphSuccess = {
  type: 'formSummaryBar/COMPOSE_GRAPH_SUCCESS',
  payload: SummaryBarGraphState,
};

export type Action = createGraphSuccess;

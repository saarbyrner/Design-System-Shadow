// @flow
import type { SummaryStackBarGraphState } from '../../../../types';

type createGraphSuccess = {
  type: 'formSummaryStackBar/COMPOSE_GRAPH_SUCCESS',
  payload: SummaryStackBarGraphState,
};

export type Action = createGraphSuccess;

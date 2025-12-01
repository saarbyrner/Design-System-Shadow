// @flow
import type { LongitudinalGraphState } from '../../../../types';

type createGraphSuccess = {
  type: 'formLongitudinal/COMPOSE_GRAPH_SUCCESS',
  payload: LongitudinalGraphState,
};

export type Action = createGraphSuccess;

// @flow
import type { ValueVisualisationGraphState } from '../../../../types';

type createGraphSuccess = {
  type: 'formValueVisualisation/COMPOSE_GRAPH_SUCCESS',
  payload: ValueVisualisationGraphState,
};

export type Action = createGraphSuccess;

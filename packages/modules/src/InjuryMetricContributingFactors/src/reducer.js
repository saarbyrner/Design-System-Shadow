// @flow
import type { Action, contributingFactorsState } from './types';

const contributingFactors = (
  state: contributingFactorsState = {},
  action: Action
): contributingFactorsState => {
  switch (action.type) {
    case 'FETCH_GRAPH_DATA_SUCCESS': {
      return {
        ...state,
        graphData: action.payload.graphData,
      };
    }
    default:
      return state;
  }
};

export default contributingFactors;

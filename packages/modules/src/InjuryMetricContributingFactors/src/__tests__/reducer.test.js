import contributingFactorsReducer from '../reducer';
import graphDummyData from '../../resources/graphDummyData';

describe('Contributing Factors reducer', () => {
  const defaultState = {
    graphData: {},
  };

  it('returns correct state on FETCH_GRAPH_DATA_SUCCESS', () => {
    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'FETCH_GRAPH_DATA_SUCCESS',
      payload: {
        graphData: graphDummyData,
      },
    };

    const nextState = contributingFactorsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      graphData: graphDummyData,
    });
  });
});

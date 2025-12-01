import appStateReducer from '../appState';

describe('appState reducer', () => {
  const initialState = {
    requestStatus: null,
  };

  it('returns correct state on REQUEST_PENDING', () => {
    const action = {
      type: 'REQUEST_PENDING',
    };

    const nextState = appStateReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'LOADING',
    });
  });

  it('returns correct state on REQUEST_FAILURE', () => {
    const action = {
      type: 'REQUEST_FAILURE',
    };

    const nextState = appStateReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'FAILURE',
    });
  });

  it('returns correct state on REQUEST_SUCCESS', () => {
    const action = {
      type: 'REQUEST_SUCCESS',
    };

    const nextState = appStateReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'SUCCESS',
    });
  });

  it('returns correct state on SET_REQUEST_STATUS', () => {
    const action = {
      type: 'SET_REQUEST_STATUS',
      payload: {
        requestStatus: 'FAILURE',
      },
    };

    const nextState = appStateReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'FAILURE',
    });
  });
});

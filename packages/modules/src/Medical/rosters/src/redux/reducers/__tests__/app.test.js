import appReducer from '../app';

describe('app reducer', () => {
  const initialState = {
    requestStatus: 'PENDING',
  };

  test('returns correct state on REQUEST_PENDING', () => {
    const state = {
      ...initialState,
      requestStatus: 'FAILURE',
    };

    const action = {
      type: 'REQUEST_PENDING',
    };

    const nextState = appReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'PENDING',
    });
  });

  test('returns correct state on REQUEST_FAILURE', () => {
    const state = {
      ...initialState,
      requestStatus: 'PENDING',
    };

    const action = {
      type: 'REQUEST_FAILURE',
    };

    const nextState = appReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'FAILURE',
    });
  });

  test('returns correct state on REQUEST_SUCCESS', () => {
    const state = {
      ...initialState,
      requestStatus: 'PENDING',
    };

    const action = {
      type: 'REQUEST_SUCCESS',
    };

    const nextState = appReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'SUCCESS',
    });
  });

  test('returns correct state on SET_REQUEST_STATUS', () => {
    const state = {
      ...initialState,
      requestStatus: 'PENDING',
    };

    const action = {
      type: 'SET_REQUEST_STATUS',
      payload: {
        requestStatus: 'SUCCESS',
      },
    };

    const nextState = appReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'SUCCESS',
    });
  });
});

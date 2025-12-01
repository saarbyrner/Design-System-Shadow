import appStatusReducer from '../appStatus';

describe('appStatus reducer', () => {
  const initialState = {
    status: null,
  };

  it('returns correct state on SAVE_PARTICIPATION_FORM_LOADING', () => {
    const action = {
      type: 'SAVE_PARTICIPATION_FORM_LOADING',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      status: 'loading',
    });
  });

  it('returns correct state on SAVE_PARTICIPATION_FORM_FAILURE', () => {
    const action = {
      type: 'SAVE_PARTICIPATION_FORM_FAILURE',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      status: 'error',
    });
  });

  it('returns correct state on SAVE_PARTICIPATION_FORM_SUCCESS', () => {
    const action = {
      type: 'SAVE_PARTICIPATION_FORM_SUCCESS',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      status: 'success',
    });
  });

  it('returns correct state on SHOW_CANCEL_CONFIRM', () => {
    const action = {
      type: 'SHOW_CANCEL_CONFIRM',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      status: 'confirm',
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = appStatusReducer(initialState, action);
    expect(nextState).toEqual({
      status: null,
    });
  });
});

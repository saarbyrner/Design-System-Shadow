import noteDetailModalReducer from '../noteDetailModal';

describe('analyticalDashboard - noteDetailModal reducer', () => {
  const defaultState = {
    isOpen: false,
    annotation: null,
    requestStatus: null,
  };

  it('returns correct state on OPEN_NOTE_DETAIL_MODAL', () => {
    const action = {
      type: 'OPEN_NOTE_DETAIL_MODAL',
    };

    const nextState = noteDetailModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: true,
      requestStatus: 'loading',
    });
  });

  it('returns correct state on CLOSE_NOTE_DETAIL_MODAL', () => {
    const action = {
      type: 'CLOSE_NOTE_DETAIL_MODAL',
    };

    const nextState = noteDetailModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      isOpen: false,
    });
  });

  it('returns correct state on FETCH_NOTE_DETAIL_SUCCESS', () => {
    const action = {
      type: 'FETCH_NOTE_DETAIL_SUCCESS',
      payload: {
        annotation: { id: 1, title: 'note title' },
      },
    };

    const nextState = noteDetailModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      annotation: { id: 1, title: 'note title' },
      requestStatus: 'success',
    });
  });

  it('returns correct state on FETCH_NOTE_DETAIL_ERROR', () => {
    const action = {
      type: 'FETCH_NOTE_DETAIL_ERROR',
    };

    const nextState = noteDetailModalReducer(defaultState, action);
    expect(nextState).toStrictEqual({
      ...defaultState,
      requestStatus: 'error',
    });
  });
});

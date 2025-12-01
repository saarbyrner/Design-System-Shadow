import toastsReducer from '../toasts';

describe('toasts reducer', () => {
  const initialState = [];

  it('returns correct state on ADD_TOAST', () => {
    const action = {
      type: 'ADD_TOAST',
      payload: {
        toast: {
          id: 1,
          title: 'filname.jpg',
          description: '12kb',
          status: 'LOADING',
        },
      },
    };

    const nextState = toastsReducer(initialState, action);
    expect(nextState).toEqual([
      {
        id: 1,
        title: 'filname.jpg',
        description: '12kb',
        status: 'LOADING',
      },
    ]);
  });

  it('returns correct state on UPDATE_TOAST', () => {
    const state = [
      {
        id: 1,
        title: 'filname.jpg',
        description: '12kb',
        status: 'LOADING',
      },
    ];

    const action = {
      type: 'UPDATE_TOAST',
      payload: { toastId: 1, attributes: { status: 'SUCCESS' } },
    };

    const nextState = toastsReducer(state, action);
    expect(nextState).toEqual([
      {
        id: 1,
        title: 'filname.jpg',
        description: '12kb',
        status: 'SUCCESS',
      },
    ]);
  });

  it('returns correct state on REMOVE_TOAST', () => {
    const state = [
      {
        id: 1,
        title: 'filname.jpg',
        description: '12kb',
        status: 'LOADING',
      },
    ];

    const action = {
      type: 'REMOVE_TOAST',
      payload: { toastId: 1 },
    };

    const nextState = toastsReducer(state, action);
    expect(nextState).toEqual([]);
  });
});

import appReducer from '../app';

describe('app reducer', () => {
  const initialState = {
    assessmentTemplates: [],
    requestStatus: 'LOADING',
  };

  it('returns correct state on REQUEST_PENDING', () => {
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
      requestStatus: 'LOADING',
    });
  });

  it('returns correct state on REQUEST_FAILURE', () => {
    const state = {
      ...initialState,
      requestStatus: 'LOADING',
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

  it('returns correct state on REQUEST_SUCCESS', () => {
    const state = {
      ...initialState,
      requestStatus: 'LOADING',
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

  it('returns correct state on SET_ASSESSMENT_TEMPLATES', () => {
    const action = {
      type: 'SET_ASSESSMENT_TEMPLATES',
      payload: {
        assessmentTemplates: [
          {
            id: 182,
            name: 'Create Template',
          },
          {
            id: 15,
            name: 'Defender Assessment',
          },
          {
            id: 29,
            name: 'U23 - Review',
          },
        ],
      },
    };

    const nextState = appReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      assessmentTemplates: [
        {
          id: 182,
          name: 'Create Template',
        },
        {
          id: 15,
          name: 'Defender Assessment',
        },
        {
          id: 29,
          name: 'U23 - Review',
        },
      ],
    });
  });
});

import sessionAssessmentsReducer from '../sessionAssessments';

describe('sessionAssessments reducer', () => {
  const initialState = {
    data: [],
    editedSessionAssessments: {},
    requestStatus: 'SUCCESS',
  };

  it('returns correct state on CLEAR_EDITED_SESSION_ASSESSMENTS', () => {
    const state = {
      ...initialState,
      editedSessionAssessments: { 1: [123, 3] },
    };
    const action = {
      type: 'CLEAR_EDITED_SESSION_ASSESSMENTS',
    };

    const nextState = sessionAssessmentsReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      editedSessionAssessments: {},
    });
  });

  it('returns correct state on SELECT_ASSESSMENT_TYPE when the sessionType does not already exist in editedSessionAssessments', () => {
    const action = {
      type: 'SELECT_ASSESSMENT_TYPE',
      payload: {
        sessionTypeId: 1,
        selectedAssessmentTypeArray: [2, 4, 6, 8],
      },
    };

    const nextState = sessionAssessmentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      editedSessionAssessments: { 1: [2, 4, 6, 8] },
    });
  });

  it('returns correct state on SELECT_ASSESSMENT_TYPE when the sessionType already exists in editedSessionAssessments', () => {
    const state = {
      ...initialState,
      editedSessionAssessments: { 1: [123, 3] },
    };

    const action = {
      type: 'SELECT_ASSESSMENT_TYPE',
      payload: {
        sessionTypeId: 1,
        selectedAssessmentTypeArray: [2, 3, 6, 8],
      },
    };

    const nextState = sessionAssessmentsReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      editedSessionAssessments: { 1: [2, 3, 6, 8] },
    });
  });

  it('returns correct state on SESSION_ASSESSMENT_REQUEST_PENDING', () => {
    const state = {
      ...initialState,
      requestStatus: 'FAILURE',
    };

    const action = {
      type: 'SESSION_ASSESSMENT_REQUEST_PENDING',
    };

    const nextState = sessionAssessmentsReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'LOADING',
    });
  });

  it('returns correct state on SESSION_ASSESSMENT_REQUEST_FAILURE', () => {
    const state = {
      ...initialState,
      requestStatus: 'LOADING',
    };

    const action = {
      type: 'SESSION_ASSESSMENT_REQUEST_FAILURE',
    };

    const nextState = sessionAssessmentsReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'FAILURE',
    });
  });

  it('returns correct state on SESSION_ASSESSMENT_REQUEST_SUCCESS', () => {
    const state = {
      ...initialState,
      requestStatus: 'LOADING',
    };

    const action = {
      type: 'SESSION_ASSESSMENT_REQUEST_SUCCESS',
    };

    const nextState = sessionAssessmentsReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'SUCCESS',
    });
  });

  it('returns correct state on SET_SESSION_TEMPLATES', () => {
    const action = {
      type: 'SET_SESSION_TEMPLATES',
      payload: {
        data: [
          {
            id: 48,
            name: 'Line Outs',
            templates: [{ id: 182, name: 'Create Template' }],
          },
        ],
      },
    };

    const nextState = sessionAssessmentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      data: [
        {
          id: 48,
          name: 'Line Outs',
          templates: [{ id: 182, name: 'Create Template' }],
        },
      ],
    });
  });
});

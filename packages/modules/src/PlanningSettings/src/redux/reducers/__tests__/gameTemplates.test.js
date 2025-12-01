import gameTemplatesReducer from '../gameTemplates';

describe('gameTemplates reducer', () => {
  const initialState = {
    data: [],
    editedGameTemplates: null,
    requestStatus: 'SUCCESS',
  };

  it('returns correct state on CLEAR_EDITED_GAME_TEMPLATES', () => {
    const state = {
      ...initialState,
      editedGameTemplates: [123, 3],
    };
    const action = {
      type: 'CLEAR_EDITED_GAME_TEMPLATES',
    };

    const nextState = gameTemplatesReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      editedGameTemplates: null,
    });
  });

  it('returns correct state on SELECT_GAME_ASSESSMENT_TYPE when the sessionType does not already exist in editedGameTemplates', () => {
    const action = {
      type: 'SELECT_GAME_ASSESSMENT_TYPE',
      payload: {
        selectedAssessmentTypeArray: [2, 4, 6, 8],
      },
    };

    const nextState = gameTemplatesReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      editedGameTemplates: [2, 4, 6, 8],
    });
  });

  it('returns correct state on SELECT_GAME_ASSESSMENT_TYPE when the sessionType already exists in editedGameTemplates', () => {
    const state = {
      ...initialState,
      editedGameTemplates: [123, 3],
    };

    const action = {
      type: 'SELECT_GAME_ASSESSMENT_TYPE',
      payload: {
        selectedAssessmentTypeArray: [2, 3, 6, 8],
      },
    };

    const nextState = gameTemplatesReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      editedGameTemplates: [2, 3, 6, 8],
    });
  });

  it('returns correct state on GAME_REQUEST_PENDING', () => {
    const state = {
      ...initialState,
      requestStatus: 'FAILURE',
    };

    const action = {
      type: 'GAME_REQUEST_PENDING',
    };

    const nextState = gameTemplatesReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'LOADING',
    });
  });

  it('returns correct state on GAME_REQUEST_FAILURE', () => {
    const state = {
      ...initialState,
      requestStatus: 'LOADING',
    };

    const action = {
      type: 'GAME_REQUEST_FAILURE',
    };

    const nextState = gameTemplatesReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'FAILURE',
    });
  });

  it('returns correct state on GAME_REQUEST_SUCCESS', () => {
    const state = {
      ...initialState,
      requestStatus: 'LOADING',
    };

    const action = {
      type: 'GAME_REQUEST_SUCCESS',
    };

    const nextState = gameTemplatesReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      requestStatus: 'SUCCESS',
    });
  });

  it('returns correct state on SET_GAME_TEMPLATES', () => {
    const action = {
      type: 'SET_GAME_TEMPLATES',
      payload: {
        assessmentTemplates: [182, 675],
      },
    };

    const nextState = gameTemplatesReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      assessmentTemplates: [182, 675],
    });
  });
});

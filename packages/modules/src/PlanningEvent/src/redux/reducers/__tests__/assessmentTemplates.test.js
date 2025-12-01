import assessmentTemplatesReducer from '../assessmentTemplates';

describe('assessmentTemplates reducer', () => {
  const initialState = [];

  it('returns correct state on SET_ASSESSMENT_TEMPLATES', () => {
    const assessmentTemplates = [
      {
        id: 1,
        name: 'assessment',
        include_users: [],
        assessment_group_id: 1,
      },
    ];
    const action = {
      type: 'SET_ASSESSMENT_TEMPLATES',
      payload: {
        assessmentTemplates,
      },
    };

    const nextState = assessmentTemplatesReducer(initialState, action);
    expect(nextState).toEqual(assessmentTemplates);
  });

  it('returns initial state when action type is unknown', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {},
    };

    const nextState = assessmentTemplatesReducer(initialState, action);
    expect(nextState).toEqual(initialState);
  });

  it('returns empty array when SET_ASSESSMENT_TEMPLATES payload is undefined', () => {
    const action = {
      type: 'SET_ASSESSMENT_TEMPLATES',
      payload: {},
    };

    const nextState = assessmentTemplatesReducer(initialState, action);
    expect(nextState).toEqual([]);
  });

  it('handles state immutability', () => {
    const previousState = [
      {
        id: 2,
        name: 'previous assessment',
        include_users: [],
        assessment_group_id: 2,
      },
    ];
    const assessmentTemplates = [
      {
        id: 1,
        name: 'new assessment',
        include_users: [],
        assessment_group_id: 1,
      },
    ];
    const action = {
      type: 'SET_ASSESSMENT_TEMPLATES',
      payload: {
        assessmentTemplates,
      },
    };

    const nextState = assessmentTemplatesReducer(previousState, action);
    expect(nextState).toEqual(assessmentTemplates);
    expect(previousState).not.toEqual(nextState);
  });
});

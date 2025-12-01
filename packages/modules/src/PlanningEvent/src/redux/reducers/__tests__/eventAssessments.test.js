import eventAssessmentsReducer from '../eventAssessments';

describe('eventAssessments reducer', () => {
  const initialState = {
    assessments: [],
  };

  it('returns correct state on FETCH_ASSESSMENTS_SUCCESS', () => {
    const action = {
      type: 'FETCH_ASSESSMENTS_SUCCESS',
      payload: {
        assessments: [
          { name: 'beep boop', id: 123 },
          { name: 'Why do computers not understand my accent?', id: 22 },
        ],
      },
    };

    const nextState = eventAssessmentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      assessments: [
        { name: 'beep boop', id: 123 },
        { name: 'Why do computers not understand my accent?', id: 22 },
      ],
    });
  });

  it('returns default state when no action is provided', () => {
    const nextState = eventAssessmentsReducer(undefined, {});
    expect(nextState).toEqual(initialState);
  });

  it('returns current state when action type is unknown', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
      payload: {
        assessments: [{ name: 'test', id: 1 }],
      },
    };

    const nextState = eventAssessmentsReducer(initialState, action);
    expect(nextState).toEqual(initialState);
  });

  it('handles empty payload on FETCH_ASSESSMENTS_SUCCESS', () => {
    const action = {
      type: 'FETCH_ASSESSMENTS_SUCCESS',
      payload: {
        assessments: [],
      },
    };

    const nextState = eventAssessmentsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      assessments: [],
    });
  });
});

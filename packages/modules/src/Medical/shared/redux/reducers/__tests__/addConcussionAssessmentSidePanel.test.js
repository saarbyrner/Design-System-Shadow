import addConcussionAssessmentSidePanel from '../addConcussionAssessmentSidePanel';

describe('addConcussionAssessmentSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true },
  };

  it('returns correct state on OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
      payload: { isAthleteSelectable: false },
    };

    const nextState = addConcussionAssessmentSidePanel(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      initialInfo: {
        isAthleteSelectable: false,
      },
    });
  });

  it('returns correct state on CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
    };

    const nextState = addConcussionAssessmentSidePanel(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

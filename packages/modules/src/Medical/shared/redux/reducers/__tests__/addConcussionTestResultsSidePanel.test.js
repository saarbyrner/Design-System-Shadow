import addConcussionTestResultsReducer from '../addConcussionTestResultsSidePanel';

describe('addConcussionTestResultsSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true, testProtocol: 'NPC' },
  };

  it('returns correct state on OPEN_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
      payload: { isAthleteSelectable: false, testProtocol: 'KING-DEVICK' },
    };

    const nextState = addConcussionTestResultsReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      initialInfo: {
        isAthleteSelectable: false,
        testProtocol: 'KING-DEVICK',
      },
    });
  });

  it('returns correct state on CLOSE_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
    };

    const nextState = addConcussionTestResultsReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

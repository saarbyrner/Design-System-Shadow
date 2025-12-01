import selectAthletesSidePanelReducer from '../selectAthletesSidePanel';

describe('selectAthletesSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
  };

  it('returns correct state on OPEN_SELECT_ATHLETES_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_SELECT_ATHLETES_SIDE_PANEL',
    };

    const nextState = selectAthletesSidePanelReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
    });
  });

  it('returns correct state on CLOSE_SELECT_ATHLETES_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_SELECT_ATHLETES_SIDE_PANEL',
    };

    const nextState = selectAthletesSidePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

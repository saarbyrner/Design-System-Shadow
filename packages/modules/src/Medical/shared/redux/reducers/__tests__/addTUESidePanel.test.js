import addTUESidePanelReducer from '../addTUESidePanel';

describe('addTUESidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true },
  };

  it('returns correct state on OPEN_ADD_TUE_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_TUE_SIDE_PANEL',
      payload: { isAthleteSelectable: false },
    };

    const nextState = addTUESidePanelReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      initialInfo: {
        isAthleteSelectable: false,
      },
    });
  });

  it('returns correct state on CLOSE_ADD_TUE_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
      initialInfo: { isAthleteSelectable: true },
    };

    const action = {
      type: 'CLOSE_ADD_TUE_SIDE_PANEL',
    };

    const nextState = addTUESidePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

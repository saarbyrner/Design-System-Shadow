import addVaccinationSidePanelReducer from '../addVaccinationSidePanel';

describe('addVaccinationSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true },
  };

  it('returns correct state on OPEN_ADD_VACCINATION_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_VACCINATION_SIDE_PANEL',
      payload: { isAthleteSelectable: false },
    };

    const nextState = addVaccinationSidePanelReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      initialInfo: {
        isAthleteSelectable: false,
      },
    });
  });

  it('returns correct state on CLOSE_ADD_VACCINATION_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
      initialInfo: { isAthleteSelectable: true },
    };

    const action = {
      type: 'CLOSE_ADD_VACCINATION_SIDE_PANEL',
    };

    const nextState = addVaccinationSidePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

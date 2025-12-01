import addTreatmentsSidePanelReducer from '../addTreatmentsSidePanel';

describe('addMedicalNotePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true },
  };

  it('returns correct state on OPEN_ADD_TREATMENTS_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_TREATMENTS_SIDE_PANEL',
      payload: {
        isDuplicatingTreatment: false,
        isAthleteSelectable: false,
        duplicateTreatment: null,
      },
    };

    const nextState = addTreatmentsSidePanelReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      initialInfo: {
        isDuplicatingTreatment: false,
        isAthleteSelectable: false,
        duplicateTreatment: null,
      },
    });
  });

  it('returns correct state on CLOSE_ADD_TREATMENTS_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
      initialInfo: { isAthleteSelectable: true },
    };

    const action = {
      type: 'CLOSE_ADD_TREATMENTS_SIDE_PANEL',
    };

    const nextState = addTreatmentsSidePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

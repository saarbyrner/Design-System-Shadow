import addDiagnosticSidePanelReducer from '../addDiagnosticSidePanel';

describe('addMedicalNotePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true },
  };

  it('returns correct state on OPEN_ADD_DIAGNOSTIC_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_DIAGNOSTIC_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
        diagnosticId: 123,
        athleteId: 456,
      },
    };

    const nextState = addDiagnosticSidePanelReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      athleteId: 456,
      initialInfo: {
        isAthleteSelectable: false,
        diagnosticId: 123,
      },
    });
  });

  it('returns correct state on CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
      initialInfo: { isAthleteSelectable: true },
    };

    const action = {
      type: 'CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL',
    };

    const nextState = addDiagnosticSidePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
      athleteId: null,
    });
  });
});

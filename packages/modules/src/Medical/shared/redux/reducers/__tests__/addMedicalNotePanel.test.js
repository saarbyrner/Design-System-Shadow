import addMedicalNotePanelReducer from '../addMedicalNotePanel';

describe('addMedicalNotePanel reducer', () => {
  const initialState = {
    isOpen: false,
    initialInfo: { isAthleteSelectable: true },
  };

  it('returns correct state on OPEN_ADD_MEDICAL_NOTE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_MEDICAL_NOTE_PANEL',
      payload: { isAthleteSelectable: false, isDuplicatingNote: false },
    };

    const nextState = addMedicalNotePanelReducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      initialInfo: {
        isAthleteSelectable: false,
        isDuplicatingNote: false,
        duplicateNote: null,
      },
    });
  });

  it('returns correct state on CLOSE_ADD_MEDICAL_NOTE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
      initialInfo: { isAthleteSelectable: true },
    };

    const action = {
      type: 'CLOSE_ADD_MEDICAL_NOTE_PANEL',
    };

    const nextState = addMedicalNotePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });
});

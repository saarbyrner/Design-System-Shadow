import addDiagnosticAttachmentSidePanelReducer from '../addDiagnosticAttachmentSidePanel';

describe('addDiagnosticAttachmentSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    diagnosticId: null,
    athleteId: null,
  };

  it('returns correct state on OPEN_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
      payload: { diagnosticId: 92782, athleteId: 123666 },
    };
    const nextState = addDiagnosticAttachmentSidePanelReducer(
      initialState,
      action
    );

    expect(nextState).toEqual({
      ...initialState,
      isOpen: true,
      diagnosticId: 92782,
      athleteId: 123666,
    });
  });

  it('returns correct state on CLOSE_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
      diagnosticId: 92782,
      athleteId: 123666,
    };

    const action = {
      type: 'CLOSE_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
    };

    const nextState = addDiagnosticAttachmentSidePanelReducer(state, action);
    expect(nextState).toEqual({
      ...initialState,
      isOpen: false,
      diagnosticId: null,
      athleteId: null,
    });
  });
});

import addWorkersCompSidePanel from '../addWorkersCompSidePanel';

describe('addWorkersCompSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    page: 1,
    submitModal: {
      isOpen: false,
      formState: {},
    },
    showPrintPreview: {
      sidePanel: false,
      card: false,
    },
    claimInformation: {
      personName: null,
      contactNumber: null,
      policyNumber: null,
      lossDate: null,
      lossTime: null,
      lossCity: null,
      lossState: null,
      lossJurisdiction: null,
      lossDescription: null,
      side: null,
      sideName: null,
      bodyArea: null,
      bodyAreaName: null,
    },
    additionalInformation: {
      firstName: null,
      lastName: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zipCode: null,
      phoneNumber: null,
    },
  };

  it('returns correct state on OPEN_WORKERS_COMP_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_WORKERS_COMP_SIDE_PANEL',
    };

    const expectedState = addWorkersCompSidePanel(initialState, action);

    expect(expectedState).toEqual({
      ...initialState,
      isOpen: true,
    });
  });

  it('returns correct state on CLOSE_WORKERS_COMP_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_WORKERS_COMP_SIDE_PANEL',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });

  it('returns correct state on GO_TO_NEXT_PANEL_PAGE', () => {
    const state = {
      ...initialState,
      page: 1,
    };

    const action = {
      type: 'GO_TO_NEXT_PANEL_PAGE',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      page: 2,
    });
  });

  it('returns correct state on GO_TO_PREVIOUS_PANEL_PAGE', () => {
    const state = {
      ...initialState,
      page: 2,
    };

    const action = {
      type: 'GO_TO_PREVIOUS_PANEL_PAGE',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      page: 1,
    });
  });

  it('returns correct state on UPDATE_CLAIM_INFORMATION_FIELD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_CLAIM_INFORMATION_FIELD',
      fieldName: 'contactNumber',
      value: '1234',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      claimInformation: {
        ...initialState.claimInformation,
        contactNumber: '1234',
      },
    });
  });

  it('returns correct state on UPDATE_ADDITIONAL_INFORMATION_FIELD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_ADDITIONAL_INFORMATION_FIELD',
      fieldName: 'zipCode',
      value: 'Zippy',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      additionalInformation: {
        ...initialState.additionalInformation,
        zipCode: 'Zippy',
      },
    });
  });

  it('returns correct state on SHOW_WORKERS_COMP_SUBMIT_MODAL', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'SHOW_WORKERS_COMP_SUBMIT_MODAL',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      submitModal: {
        isOpen: true,
      },
    });
  });

  it('returns correct state on CLOSE_WORKERS_COMP_SUBMIT_MODAL', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'CLOSE_WORKERS_COMP_SUBMIT_MODAL',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      submitModal: {
        isOpen: false,
      },
    });
  });

  it('returns correct state on INITALISE_WORKERS_COMP_FORM_STATE', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'INITALISE_WORKERS_COMP_FORM_STATE',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
    });
  });

  it('returns correct state on UPDATE_WORKERS_COMP_CLAIM_INFORMATION', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
      claimInformationValues: {
        test: 'object',
      },
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      claimInformation: {
        test: 'object',
      },
    });
  });

  it('returns correct state on UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION',
      additionalInformationValues: {
        test: 'object',
      },
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      additionalInformation: {
        test: 'object',
      },
    });
  });

  it('returns correct state on OPEN_WORKERS_COMP_PRINT_FLOW', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'OPEN_WORKERS_COMP_PRINT_FLOW',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      isOpen: true,
      page: 3,
    });
  });

  it('returns correct state on PRINT_WORKERS_COMP_FROM_SIDE_PANEL', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL',
      showPrintPreview: true,
      side: 'Left',
      bodyArea: 'Arm',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      claimInformation: {
        ...initialState.claimInformation,
        sideName: 'Left',
        bodyAreaName: 'Arm',
      },
      showPrintPreview: {
        ...initialState.showPrintPreview,
        sidePanel: true,
      },
    });
  });

  it('returns correct state on PRINT_WORKERS_COMP_FROM_CARD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'PRINT_WORKERS_COMP_FROM_CARD',
      showPrintPreview: true,
      side: 'Left',
      bodyArea: 'Arm',
    };

    const expectedState = addWorkersCompSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      claimInformation: {
        ...initialState.claimInformation,
        sideName: 'Left',
        bodyAreaName: 'Arm',
      },
      showPrintPreview: {
        ...initialState.showPrintPreview,
        card: true,
      },
    });
  });
});

import addOshaFormSidePanel from '../addOshaFormSidePanel';

describe('addOshaFormSidePanel reducer', () => {
  const initialState = {
    isOpen: false,
    page: 1,
    showPrintPreview: {
      sidePanel: false,
      card: false,
    },
    initialInformation: {
      issueDate: null,
      reporter: {
        value: null,
        label: null,
      },
      reporterPhoneNumber: null,
      title: null,
    },
    employeeDrInformation: {
      city: null,
      dateHired: null,
      dateOfBirth: null,
      emergencyRoom: false,
      facilityCity: null,
      facilityName: null,
      facilityState: null,
      facilityStreet: null,
      facilityZip: null,
      fullName: null,
      hospitalized: false,
      physicianFullName: null,
      sex: 'M',
      state: null,
      street: null,
      zip: null,
    },
    caseInformation: {
      athleteActivity: null,
      caseNumber: null,
      dateInjured: null,
      dateOfDeath: null,
      issueDescription: null,
      noTimeEvent: false,
      objectSubstance: null,
      timeBeganWork: null,
      timeEvent: null,
      whatHappened: null,
    },
  };

  it('returns correct state on INITALISE_OSHA_FORM_STATE', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'INITALISE_OSHA_FORM_STATE',
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
    });
  });

  it('returns correct state on OPEN_OSHA_FORM_SIDE_PANEL', () => {
    const action = {
      type: 'OPEN_OSHA_FORM_SIDE_PANEL',
    };

    const expectedState = addOshaFormSidePanel(initialState, action);

    expect(expectedState).toEqual({
      ...initialState,
      isOpen: true,
    });
  });

  it('returns correct state on CLOSE_OSHA_FORM_SIDE_PANEL', () => {
    const state = {
      ...initialState,
      isOpen: true,
    };

    const action = {
      type: 'CLOSE_OSHA_FORM_SIDE_PANEL',
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      isOpen: false,
    });
  });

  it('returns correct state on UPDATE_INITIAL_INFORMATION_FIELD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_INITIAL_INFORMATION_FIELD',
      fieldName: 'reporter',
      value: { value: 1, label: 'Sgt. Pepper' },
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      initialInformation: {
        ...initialState.initialInformation,
        reporter: { value: 1, label: 'Sgt. Pepper' },
      },
    });
  });

  it('returns correct state on UPDATE_OSHA_INITIAL_INFORMATION', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_OSHA_INITIAL_INFORMATION',
      initialInformationValues: {
        test: 'object',
      },
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      initialInformation: {
        ...initialState.initialInformation,
        test: 'object',
      },
    });
  });

  it('returns correct state on UPDATE_EMPLOYEE_DR_INFORMATION_FIELD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD',
      fieldName: 'fullName',
      value: 'Sgt. Pepper',
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      employeeDrInformation: {
        ...initialState.employeeDrInformation,
        fullName: 'Sgt. Pepper',
      },
    });
  });

  it('returns correct state on UPDATE_OSHA_EMPLOYEE_DR_INFORMATION', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
      employeeDrInformationValues: {
        test: 'object',
      },
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      employeeDrInformation: {
        ...initialState.employeeDrInformation,
        test: 'object',
      },
    });
  });

  it('returns correct state on UPDATE_CASE_INFORMATION_FIELD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_CASE_INFORMATION_FIELD',
      fieldName: 'caseNumber',
      value: '1',
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      caseInformation: {
        ...initialState.caseInformation,
        caseNumber: '1',
      },
    });
  });

  it('returns correct state on UPDATE_OSHA_CASE_INFORMATION', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'UPDATE_OSHA_CASE_INFORMATION',
      caseInformationValues: {
        test: 'object',
      },
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      caseInformation: {
        ...initialState.caseInformation,
        test: 'object',
      },
    });
  });

  it('returns correct state on GO_TO_NEXT_OSHA_PANEL_PAGE', () => {
    const state = {
      ...initialState,
      page: 1,
    };

    const action = {
      type: 'GO_TO_NEXT_OSHA_PANEL_PAGE',
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      page: 2,
    });
  });

  it('returns correct state on GO_TO_PREVIOUS_OSHA_PANEL_PAGE', () => {
    const state = {
      ...initialState,
      page: 2,
    };

    const action = {
      type: 'GO_TO_PREVIOUS_OSHA_PANEL_PAGE',
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      page: 1,
    });
  });

  it('returns correct state on PRINT_OSHA_FORM_FROM_SIDE_PANEL', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'PRINT_OSHA_FORM_FROM_SIDE_PANEL',
      showPrintPreview: true,
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      showPrintPreview: {
        ...initialState.showPrintPreview,
        sidePanel: true,
      },
    });
  });

  it('returns correct state on PRINT_OSHA_FORM_FROM_CARD', () => {
    const state = {
      ...initialState,
    };

    const action = {
      type: 'PRINT_OSHA_FORM_FROM_CARD',
      showPrintPreview: true,
    };

    const expectedState = addOshaFormSidePanel(state, action);

    expect(expectedState).toEqual({
      ...initialState,
      showPrintPreview: {
        ...initialState.showPrintPreview,
        card: true,
      },
    });
  });
});

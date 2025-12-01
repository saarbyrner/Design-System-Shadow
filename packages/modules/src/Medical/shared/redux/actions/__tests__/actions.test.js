import {
  openAddDiagnosticSidePanel,
  closeAddDiagnosticSidePanel,
  openAddDiagnosticAttachmentSidePanel,
  closeAddDiagnosticAttachmentSidePanel,
  openAddMedicalNotePanel,
  closeAddMedicalNotePanel,
  openAddModificationSidePanel,
  closeAddModificationSidePanel,
  openAddTreatmentsSidePanel,
  closeAddTreatmentsSidePanel,
  openAddAllergySidePanel,
  closeAddAllergySidePanel,
  openAddMedicalAlertSidePanel,
  closeAddMedicalAlertSidePanel,
  openAddVaccinationSidePanel,
  closeAddVaccinationSidePanel,
  openAddTUESidePanel,
  closeAddTUESidePanel,
  openAddConcussionTestResultsSidePanel,
  closeAddConcussionTestResultsSidePanel,
  openAddConcussionAssessmentSidePanel,
  closeAddConcussionAssessmentSidePanel,
  openSelectAthletesSidePanel,
  closeSelectAthletesSidePanel,
  initialiseEditTreatmentState,
  setTreatmentFieldValue,
  clearSelectedTreatments,
  addTreatmentRow,
  removeTreatmentRow,
  removeAthlete,
  validateEditTreatmentCards,
  addToast,
  updateToast,
  removeToast,
  openWorkersCompSidePanel,
  closeWorkersCompSidePanel,
  goToNextOshaPanelPage,
  goToPreviousOshaPanelPage,
  updateClaimInformationField,
  updateAdditionalInformationField,
  showWorkersCompSubmitModal,
  closeWorkersCompSubmitModal,
  initaliseWorkersCompFormState,
  updateWorkersCompClaimInformation,
  updateWorkersCompAdditionalInformation,
  openWorkersCompPrintFlow,
  openOshaFormSidePanel,
  closeOshaFormSidePanel,
  initaliseOshaFormState,
  updateOshaInitialInformation,
  updateInitialInformationField,
  updateEmployeeDrInformationField,
  updateOshaEmployeeDrInformation,
  updateOshaCaseInformation,
  updateCaseInformationField,
  printOshaFormFromSidePanel,
  printOshaFormFromCard,
  printWorkersCompFromSidePanel,
  printWorkersCompFromCard,
} from '..';

describe('actions', () => {
  it('has the correct action OPEN_ADD_DIAGNOSTIC_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_DIAGNOSTIC_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
        diagnosticId: undefined,
        athleteId: undefined,
      },
    };

    expect(
      openAddDiagnosticSidePanel({
        isAthleteSelectable: false,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_DIAGNOSTIC_SIDE_PANEL with ids', () => {
    const expectedAction = {
      type: 'OPEN_ADD_DIAGNOSTIC_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
        diagnosticId: 321,
        athleteId: 654,
      },
    };

    expect(
      openAddDiagnosticSidePanel({
        isAthleteSelectable: false,
        diagnosticId: 321,
        athleteId: 654,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL',
    };

    expect(closeAddDiagnosticSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
      payload: { diagnosticId: '092782', athleteId: 123666 },
    };

    expect(
      openAddDiagnosticAttachmentSidePanel({
        diagnosticId: '092782',
        athleteId: 123666,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
    };

    expect(closeAddDiagnosticAttachmentSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_MEDICAL_NOTE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_MEDICAL_NOTE_PANEL',
      payload: {
        isAthleteSelectable: false,
        isDuplicatingNote: false,
        duplicateNote: null,
      },
    };

    expect(
      openAddMedicalNotePanel({
        isAthleteSelectable: false,
        isDuplicatingNote: false,
        duplicateNote: null,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_MEDICAL_NOTE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_MEDICAL_NOTE_PANEL',
    };

    expect(closeAddMedicalNotePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_MODIFICATION_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_MODIFICATION_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
      },
    };

    expect(
      openAddModificationSidePanel({
        isAthleteSelectable: false,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_MODIFICATION_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_MODIFICATION_SIDE_PANEL',
    };

    expect(closeAddModificationSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_TREATMENTS_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_TREATMENTS_SIDE_PANEL',
      payload: {
        isDuplicatingTreatment: false,
        isAthleteSelectable: false,
        duplicateTreatment: null,
      },
    };

    expect(
      openAddTreatmentsSidePanel({
        isDuplicatingTreatment: false,
        isAthleteSelectable: false,
        duplicateTreatment: null,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_TREATMENTS_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_TREATMENTS_SIDE_PANEL',
    };

    expect(closeAddTreatmentsSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_ALLERGY_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_ALLERGY_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
        selectedAllergy: null,
      },
    };

    expect(
      openAddAllergySidePanel({
        isAthleteSelectable: false,
        selectedAllergy: null,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_ALLERGY_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_ALLERGY_SIDE_PANEL',
    };

    expect(closeAddAllergySidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_MEDICAL_ALERT_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_MEDICAL_ALERT_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
        selectedMedicalAlert: null,
      },
    };

    expect(
      openAddMedicalAlertSidePanel({
        isAthleteSelectable: false,
        selectedMedicalAlert: null,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_MEDICAL_ALERT_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_MEDICAL_ALERT_SIDE_PANEL',
    };

    expect(closeAddMedicalAlertSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action ADD_TOAST', () => {
    const expectedAction = {
      type: 'ADD_TOAST',
      payload: {
        toast: {
          id: 1,
          title: 'filname.jpg',
          description: '12kb',
          status: 'LOADING',
        },
      },
    };

    expect(
      addToast({
        id: 1,
        title: 'filname.jpg',
        description: '12kb',
        status: 'LOADING',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TOAST', () => {
    const expectedAction = {
      type: 'UPDATE_TOAST',
      payload: { toastId: 1, attributes: { status: 'ERROR' } },
    };

    expect(updateToast(1, { status: 'ERROR' })).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_TOAST', () => {
    const expectedAction = {
      type: 'REMOVE_TOAST',
      payload: { toastId: 1 },
    };

    expect(removeToast(1)).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_VACCINATION_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_VACCINATION_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
      },
    };

    expect(
      openAddVaccinationSidePanel({
        isAthleteSelectable: false,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_VACCINATION_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_VACCINATION_SIDE_PANEL',
    };

    expect(closeAddVaccinationSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
        testProtocol: 'NPC',
      },
    };

    expect(
      openAddConcussionTestResultsSidePanel({
        isAthleteSelectable: false,
        testProtocol: 'NPC',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
    };

    expect(closeAddConcussionTestResultsSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
      },
    };

    expect(
      openAddConcussionAssessmentSidePanel({
        isAthleteSelectable: false,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
    };

    expect(closeAddConcussionAssessmentSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_ADD_TUE_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_ADD_TUE_SIDE_PANEL',
      payload: {
        isAthleteSelectable: false,
      },
    };

    expect(
      openAddTUESidePanel({
        isAthleteSelectable: false,
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_ADD_TUE_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_ADD_TUE_SIDE_PANEL',
    };

    expect(closeAddTUESidePanel()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_SELECT_ATHLETES_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_SELECT_ATHLETES_SIDE_PANEL',
    };

    expect(openSelectAthletesSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_SELECT_ATHLETES_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_SELECT_ATHLETES_SIDE_PANEL',
    };

    expect(closeSelectAthletesSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action INITIALISE_EDIT_TREATMENT_STATE', () => {
    const expectedAction = {
      type: 'INITIALISE_EDIT_TREATMENT_STATE',
      payload: {
        selectedAthleteIds: [123, 456],
        selectedTreatment: { id: 2 },
      },
    };

    expect(initialiseEditTreatmentState([123, 456], { id: 2 })).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TREATMENT_FIELD_VALUE', () => {
    const expectedAction = {
      type: 'SET_TREATMENT_FIELD_VALUE',
      payload: {
        id: 123,
        fieldKey: 'duration',
        value: 30,
      },
    };

    expect(setTreatmentFieldValue(123, 'duration', 30)).toEqual(expectedAction);
  });

  it('has the correct action CLEAR_SELECTED_TREATMENTS', () => {
    const expectedAction = {
      type: 'CLEAR_SELECTED_TREATMENTS',
    };

    expect(clearSelectedTreatments()).toEqual(expectedAction);
  });

  it('has the correct action ADD_TREATMENT_ROW', () => {
    const expectedAction = {
      type: 'ADD_TREATMENT_ROW',
      payload: {
        id: 123,
      },
    };

    expect(addTreatmentRow(123)).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_TREATMENT_ROW', () => {
    const expectedAction = {
      type: 'REMOVE_TREATMENT_ROW',
      payload: {
        id: 123,
        treatmentIndex: 0,
      },
    };

    expect(removeTreatmentRow(123, 0)).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_ATHLETE', () => {
    const expectedAction = {
      type: 'REMOVE_ATHLETE',
      payload: {
        id: 123,
      },
    };

    expect(removeAthlete(123)).toEqual(expectedAction);
  });

  it('has the correct action VALIDATE_EDIT_TREATMENT_CARDS', () => {
    const expectedAction = {
      type: 'VALIDATE_EDIT_TREATMENT_CARDS',
    };

    expect(validateEditTreatmentCards()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_WORKERS_COMP_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_WORKERS_COMP_SIDE_PANEL',
    };

    expect(openWorkersCompSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_WORKERS_COMP_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_WORKERS_COMP_SIDE_PANEL',
    };

    expect(closeWorkersCompSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action updateClaimInformationField', () => {
    const expectedAction = {
      type: 'UPDATE_CLAIM_INFORMATION_FIELD',
      fieldName: 'contactNumber',
      value: '1234',
    };

    expect(updateClaimInformationField('contactNumber', '1234')).toEqual(
      expectedAction
    );
  });

  it('has the correct action updateAdditionalInformationField', () => {
    const expectedAction = {
      type: 'UPDATE_ADDITIONAL_INFORMATION_FIELD',
      fieldName: 'zipCode',
      value: 'Zippy',
    };

    expect(updateAdditionalInformationField('zipCode', 'Zippy')).toEqual(
      expectedAction
    );
  });

  it('has the correct action showWorkersCompSubmitModal', () => {
    const modalFormState = {
      modal_test_object: 'testing',
    };

    const expectedAction = {
      type: 'SHOW_WORKERS_COMP_SUBMIT_MODAL',
      formState: modalFormState,
    };

    expect(showWorkersCompSubmitModal(modalFormState)).toEqual(expectedAction);
  });

  it('has the correct action closeWorkersCompSubmitModal', () => {
    const expectedAction = {
      type: 'CLOSE_WORKERS_COMP_SUBMIT_MODAL',
    };

    expect(closeWorkersCompSubmitModal()).toEqual(expectedAction);
  });

  it('has the correct action initaliseWorkersCompFormState', () => {
    const expectedAction = {
      type: 'INITALISE_WORKERS_COMP_FORM_STATE',
    };

    expect(initaliseWorkersCompFormState()).toEqual(expectedAction);
  });

  it('has the correct action updateWorkersCompClaimInformation', () => {
    const expectedAction = {
      type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
      claimInformationValues: { test: 'object' },
    };

    expect(updateWorkersCompClaimInformation({ test: 'object' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action updateWorkersCompAdditionalInformation', () => {
    const expectedAction = {
      type: 'UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION',
      additionalInformationValues: { test: 'object' },
    };

    expect(updateWorkersCompAdditionalInformation({ test: 'object' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action openWorkersCompPrintFlow', () => {
    const expectedAction = {
      type: 'OPEN_WORKERS_COMP_PRINT_FLOW',
    };

    expect(openWorkersCompPrintFlow()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_OSHA_FORM_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_OSHA_FORM_SIDE_PANEL',
    };

    expect(openOshaFormSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_OSHA_FORM_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_OSHA_FORM_SIDE_PANEL',
    };

    expect(closeOshaFormSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action initaliseOshaFormState', () => {
    const expectedAction = {
      type: 'INITALISE_OSHA_FORM_STATE',
    };

    expect(initaliseOshaFormState()).toEqual(expectedAction);
  });

  it('has the correct action updateInitialInformationField', () => {
    const expectedAction = {
      type: 'UPDATE_INITIAL_INFORMATION_FIELD',
      fieldName: 'reporterFullName',
      value: 'Sgt. Pepper',
    };

    expect(
      updateInitialInformationField('reporterFullName', 'Sgt. Pepper')
    ).toEqual(expectedAction);
  });

  it('has the correct action updateOshaInitialInformation', () => {
    const expectedAction = {
      type: 'UPDATE_OSHA_INITIAL_INFORMATION',
      initialInformationValues: { test: 'object' },
    };

    expect(updateOshaInitialInformation({ test: 'object' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action updateEmployeeDrInformationField', () => {
    const expectedAction = {
      type: 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD',
      fieldName: 'fullName',
      value: 'Sgt. Pepper',
    };

    expect(updateEmployeeDrInformationField('fullName', 'Sgt. Pepper')).toEqual(
      expectedAction
    );
  });

  it('has the correct action updateOshaEmployeeDrInformation', () => {
    const expectedAction = {
      type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
      employeeDrInformationValues: { test: 'object' },
    };

    expect(updateOshaEmployeeDrInformation({ test: 'object' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action updateCaseInformationField', () => {
    const expectedAction = {
      type: 'UPDATE_CASE_INFORMATION_FIELD',
      fieldName: 'caseNumber',
      value: '1',
    };

    expect(updateCaseInformationField('caseNumber', '1')).toEqual(
      expectedAction
    );
  });

  it('has the correct action updateOshaCaseInformation', () => {
    const expectedAction = {
      type: 'UPDATE_OSHA_CASE_INFORMATION',
      caseInformationValues: { test: 'object' },
    };

    expect(updateOshaCaseInformation({ test: 'object' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action goToNextOshaPanelPage', () => {
    const expectedAction = {
      type: 'GO_TO_NEXT_OSHA_PANEL_PAGE',
    };

    expect(goToNextOshaPanelPage()).toEqual(expectedAction);
  });

  it('has the correct action goToPreviousOshaPanelPage', () => {
    const expectedAction = {
      type: 'GO_TO_PREVIOUS_OSHA_PANEL_PAGE',
    };

    expect(goToPreviousOshaPanelPage()).toEqual(expectedAction);
  });

  it('has the correct action printOshaFormFromSidePanel', () => {
    const expectedAction = {
      type: 'PRINT_OSHA_FORM_FROM_SIDE_PANEL',
      showPrintPreview: true,
    };

    expect(printOshaFormFromSidePanel(true)).toEqual(expectedAction);
  });

  it('has the correct action printOshaFormFromCard', () => {
    const expectedAction = {
      type: 'PRINT_OSHA_FORM_FROM_CARD',
      showPrintPreview: true,
    };

    expect(printOshaFormFromCard(true)).toEqual(expectedAction);
  });

  it('has the correct action printWorkersCompFromSidePanel', () => {
    const expectedAction = {
      type: 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL',
      showPrintPreview: true,
      side: 'Left',
      bodyArea: 'Arm',
    };

    expect(printWorkersCompFromSidePanel(true, 'Left', 'Arm')).toEqual(
      expectedAction
    );
  });

  it('has the correct action printWorkersCompFromCard', () => {
    const expectedAction = {
      type: 'PRINT_WORKERS_COMP_FROM_CARD',
      showPrintPreview: true,
      side: 'Left',
      bodyArea: 'Arm',
    };

    expect(printWorkersCompFromCard(true, 'Left', 'Arm')).toEqual(
      expectedAction
    );
  });
});

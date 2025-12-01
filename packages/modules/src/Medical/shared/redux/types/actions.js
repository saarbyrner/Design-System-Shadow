// @flow
import type {
  MedicalNote,
  AthleteMedicalAlertDataResponse,
  AllergyDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { Toast, ToastId, ToastStatus } from '@kitman/components/src/types';
import type { WorkersCompSubmitPayload } from '@kitman/services/src/services/medical/submitWorkersComp';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import type { ConcussionTestProtocol, TreatmentSession } from '../../types';
import type { DuplicateTreatmentSession } from '../../components/AddTreatmentSidePanel/types';

// Diagnostic side panel
export type openAddDiagnosticSidePanel = {
  type: 'OPEN_ADD_DIAGNOSTIC_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    diagnosticId?: ?number,
    athleteId?: ?number,
  },
};
export type closeAddDiagnosticSidePanel = {
  type: 'CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL',
};

// Add attachment to existing diagnostic side panel

export type openAddDiagnosticAttachmentSidePanel = {
  type: 'OPEN_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
  payload: {
    diagnosticId: number,
    athleteId: number,
  },
};
export type closeAddDiagnosticAttachmentSidePanel = {
  type: 'CLOSE_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
};

// Add link to existing diagnostic side panel
export type openAddDiagnosticLinkSidePanel = {
  type: 'OPEN_ADD_DIAGNOSTIC_LINK_SIDE_PANEL',
  payload: {
    diagnosticId: number,
    athleteId: number,
  },
};

export type closeAddDiagnosticLinkSidePanel = {
  type: 'CLOSE_ADD_DIAGNOSTIC_LINK_SIDE_PANEL',
};

// Note side panel
export type openAddMedicalNotePanel = {
  type: 'OPEN_ADD_MEDICAL_NOTE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    isDuplicatingNote: boolean,
    duplicateNote?: ?MedicalNote,
  },
};
export type closeAddMedicalNotePanel = {
  type: 'CLOSE_ADD_MEDICAL_NOTE_PANEL',
};

// Modification side panel
export type openAddModificationSidePanel = {
  type: 'OPEN_ADD_MODIFICATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
export type closeAddModificationSidePanel = {
  type: 'CLOSE_ADD_MODIFICATION_SIDE_PANEL',
};

// Treatments side panel
export type openAddTreatmentsSidePanel = {
  type: 'OPEN_ADD_TREATMENTS_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    isDuplicatingTreatment: boolean,
    duplicateTreatment?: ?DuplicateTreatmentSession,
  },
};
export type closeAddTreatmentsSidePanel = {
  type: 'CLOSE_ADD_TREATMENTS_SIDE_PANEL',
};

// Allergy side panel
export type openAddAllergySidePanel = {
  type: 'OPEN_ADD_ALLERGY_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    selectedAllergy?: ?AllergyDataResponse,
  },
};

export type closeAddAllergySidePanel = {
  type: 'CLOSE_ADD_ALLERGY_SIDE_PANEL',
};
export type openAddMedicalAlertSidePanel = {
  type: 'OPEN_ADD_MEDICAL_ALERT_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    selectedMedicalAlert?: ?AthleteMedicalAlertDataResponse,
  },
};

export type closeAddMedicalAlertSidePanel = {
  type: 'CLOSE_ADD_MEDICAL_ALERT_SIDE_PANEL',
};

export type openAddMedicationSidePanel = {
  type: 'OPEN_ADD_MEDICATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};

export type closeAddMedicationSidePanel = {
  type: 'CLOSE_ADD_MEDICATION_SIDE_PANEL',
};

// Procedures side panel
export type openAddProcedureSidePanel = {
  type: 'OPEN_ADD_PROCEDURE_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};

export type closeAddProcedureSidePanel = {
  type: 'CLOSE_ADD_PROCEDURE_SIDE_PANEL',
};

// Add attachment to existing Procedure side panel

export type openAddProcedureAttachmentSidePanel = {
  type: 'OPEN_ADD_PROCEDURE_ATTACHMENT_SIDE_PANEL',
  payload: {
    procedureId: number,
    athleteId: number,
  },
};
export type closeAddProcedureAttachmentSidePanel = {
  type: 'CLOSE_ADD_PROCEDURE_ATTACHMENT_SIDE_PANEL',
};

// Add Concussion assessment side panel
export type openAddConcussionAssessmentSidePanel = {
  type: 'OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
export type closeAddConcussionAssessmentSidePanel = {
  type: 'CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
};

// Concussion test results side panel
export type openAddConcussionTestResultsSidePanel = {
  type: 'OPEN_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
  payload: {
    testProtocol: ConcussionTestProtocol,
    isAthleteSelectable: boolean,
  },
};
export type closeAddConcussionTestResultsSidePanel = {
  type: 'CLOSE_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
};

// Vaccination side panel
export type openAddVaccinationSidePanel = {
  type: 'OPEN_ADD_VACCINATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
export type closeAddVaccinationSidePanel = {
  type: 'CLOSE_ADD_VACCINATION_SIDE_PANEL',
};

// TUE side panel
export type openAddTUESidePanel = {
  type: 'OPEN_ADD_TUE_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
export type closeAddTUESidePanel = {
  type: 'CLOSE_ADD_TUE_SIDE_PANEL',
};

// Select athletes side panel
export type openSelectAthletesSidePanel = {
  type: 'OPEN_SELECT_ATHLETES_SIDE_PANEL',
};

export type closeSelectAthletesSidePanel = {
  type: 'CLOSE_SELECT_ATHLETES_SIDE_PANEL',
};

// Workers' comp
export type openWorkersCompSidePanel = {
  type: 'OPEN_WORKERS_COMP_SIDE_PANEL',
};

export type closeWorkersCompSidePanel = {
  type: 'CLOSE_WORKERS_COMP_SIDE_PANEL',
};

export type goToNextPanelPage = {
  type: 'GO_TO_NEXT_PANEL_PAGE',
};

export type goToPreviousPanelPage = {
  type: 'GO_TO_PREVIOUS_PANEL_PAGE',
};

export type updateClaimInformationField = {
  type: 'UPDATE_CLAIM_INFORMATION_FIELD',
  fieldName: string,
  value: Object | string | number,
};

export type updateAdditionalInformationField = {
  type: 'UPDATE_ADDITIONAL_INFORMATION_FIELD',
  fieldName: string,
  value: Object | string | number,
};

export type showWorkersCompSumbitModal = {
  type: 'SHOW_WORKERS_COMP_SUBMIT_MODAL',
  formState: WorkersCompSubmitPayload,
};

export type closeWorkersCompSumbitModal = {
  type: 'CLOSE_WORKERS_COMP_SUBMIT_MODAL',
};

export type initaliseWorkersCompFormState = {
  type: 'INITALISE_WORKERS_COMP_FORM_STATE',
};

export type updateWorkersCompClaimInformation = {
  type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
  claimInformationValues: WorkersCompSubmitPayload,
};

export type updateWorkersCompAdditionalInformation = {
  type: 'UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION',
  additionalInformationValues: WorkersCompSubmitPayload,
};

export type openWorkersCompPrintFlow = {
  type: 'OPEN_WORKERS_COMP_PRINT_FLOW',
};

export type printWorkersCompFromSidePanel = {
  type: 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL',
  showPrintPreview: boolean,
  side?: string,
  bodyArea?: string,
};

export type printWorkersCompFromCard = {
  type: 'PRINT_WORKERS_COMP_FROM_CARD',
  showPrintPreview: boolean,
  side?: string,
  bodyArea?: string,
};

// OSHA Form
export type openOshaFormSidePanel = {
  type: 'OPEN_OSHA_FORM_SIDE_PANEL',
};

export type closeOshaFormSidePanel = {
  type: 'CLOSE_OSHA_FORM_SIDE_PANEL',
};

export type goToNextOshaPanelPage = {
  type: 'GO_TO_NEXT_OSHA_PANEL_PAGE',
};

export type goToPreviousOshaPanelPage = {
  type: 'GO_TO_PREVIOUS_OSHA_PANEL_PAGE',
};

export type initaliseOshaFormState = {
  type: 'INITALISE_OSHA_FORM_STATE',
};

export type updateInitialInformationField = {
  type: 'UPDATE_INITIAL_INFORMATION_FIELD',
  fieldName: string,
  value: Object | string | number,
};

export type updateOshaInitialInformation = {
  type: 'UPDATE_OSHA_INITIAL_INFORMATION',
  initialInformationValues: {
    reporter: {
      label: string,
      value: number,
    },
    reporterPhoneNumber: string,
    title: string,
    issueDate: string,
  },
};

export type updateOshaEmployeeDrInformation = {
  type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
  employeeDrInformationValues: {
    city: string,
    dateHired: string,
    dateOfBirth: string,
    emergencyRoom: false,
    facilityCity: string,
    facilityName: string,
    facilityState: string,
    facilityStreet: string,
    facilityZip: string,
    fullName: string,
    hospitalized: false,
    physicianFullName: string,
    sex: string,
    state: string,
    street: string,
    zip: string,
  },
};

export type updateEmployeeDrInformationField = {
  type: 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD',
  fieldName: string,
  value: Object | string | number,
};

export type updateOshaCaseInformation = {
  type: 'UPDATE_OSHA_CASE_INFORMATION',
  caseInformationValues: {
    athleteActivity: string,
    caseNumber: string,
    dateInjured: string,
    dateOfDeath: string,
    issueDescription: string,
    noTimeEvent: boolean,
    objectSubstance: string,
    timeBeganWork: string,
    timeEvent: string,
    whatHappened: string,
  },
};

export type updateCaseInformationField = {
  type: 'UPDATE_CASE_INFORMATION_FIELD',
  fieldName: string,
  value: Object | string | number,
};

export type printOshaFormFromSidePanel = {
  type: 'PRINT_OSHA_FORM_FROM_SIDE_PANEL',
  showPrintPreview: boolean,
};

export type printOshaFormFromCard = {
  type: 'PRINT_OSHA_FORM_FROM_CARD',
  showPrintPreview: boolean,
};

// Treatment Card List
export type initialiseEditTreatmentState = {
  type: 'INITIALISE_EDIT_TREATMENT_STATE',
  payload: {
    selectedAthleteIds: Array<number>,
    selectedTreatment: TreatmentSession,
  },
};

export type setTreatmentFieldValue = {
  type: 'SET_TREATMENT_FIELD_VALUE',
  payload: {
    id: number,
    fieldKey: string,
    value: any, // TODO: update this type
  },
};

export type clearSelectedTreatments = {
  type: 'CLEAR_SELECTED_TREATMENTS',
};

export type addTreatmentRow = {
  type: 'ADD_TREATMENT_ROW',
  payload: {
    id: number,
  },
};

export type removeTreatmentRow = {
  type: 'REMOVE_TREATMENT_ROW',
  payload: {
    id: number,
    treatmentIndex: number,
  },
};

export type removeAllTreatments = {
  type: 'REMOVE_ALL_TREATMENTS',
  payload: {
    id: number,
  },
};

export type removeAthlete = {
  type: 'REMOVE_ATHLETE',
  payload: {
    id: number,
  },
};

export type validateEditTreatmentCards = {
  type: 'VALIDATE_EDIT_TREATMENT_CARDS',
};

// Toasts
export type addToast = {
  type: 'ADD_TOAST',
  payload: {
    toast: Toast,
  },
};
export type removeToast = {
  type: 'REMOVE_TOAST',
  payload: {
    toastId: ToastId,
  },
};
export type updateToast = {
  type: 'UPDATE_TOAST',
  payload: {
    toastId: ToastId,
    attributes: {
      title?: string,
      description?: string,
      status?: ToastStatus,
    },
  },
};

export type exportRosterBilling = {
  type: 'EXPORT_ROSTER_BILLING',
};

export type saveMedicalHistory = {
  type: 'SAVE_MEDICAL_HISTORY',
  payload: {
    athleteId: number,
    medicalHistory: MedicalHistories,
  },
};

export type Action =
  | openAddDiagnosticSidePanel
  | closeAddDiagnosticSidePanel
  | openAddDiagnosticAttachmentSidePanel
  | closeAddDiagnosticAttachmentSidePanel
  | openAddDiagnosticLinkSidePanel
  | closeAddDiagnosticLinkSidePanel
  | openAddMedicalNotePanel
  | closeAddMedicalNotePanel
  | openAddModificationSidePanel
  | closeAddModificationSidePanel
  | openAddTreatmentsSidePanel
  | closeAddTreatmentsSidePanel
  | openAddAllergySidePanel
  | closeAddAllergySidePanel
  | openAddMedicalAlertSidePanel
  | closeAddMedicalAlertSidePanel
  | openAddMedicationSidePanel
  | closeAddMedicationSidePanel
  | openAddProcedureSidePanel
  | closeAddProcedureSidePanel
  | openAddProcedureAttachmentSidePanel
  | closeAddProcedureAttachmentSidePanel
  | openAddConcussionTestResultsSidePanel
  | closeAddConcussionTestResultsSidePanel
  | openAddConcussionAssessmentSidePanel
  | closeAddConcussionAssessmentSidePanel
  | openAddVaccinationSidePanel
  | closeAddVaccinationSidePanel
  | openAddTUESidePanel
  | closeAddTUESidePanel
  | openSelectAthletesSidePanel
  | closeSelectAthletesSidePanel
  | openWorkersCompSidePanel
  | initaliseWorkersCompFormState
  | updateWorkersCompClaimInformation
  | updateWorkersCompAdditionalInformation
  | closeWorkersCompSidePanel
  | goToNextPanelPage
  | goToPreviousPanelPage
  | updateClaimInformationField
  | updateAdditionalInformationField
  | showWorkersCompSumbitModal
  | closeWorkersCompSumbitModal
  | openWorkersCompPrintFlow
  | printWorkersCompFromSidePanel
  | printWorkersCompFromCard
  | openOshaFormSidePanel
  | closeOshaFormSidePanel
  | goToNextOshaPanelPage
  | goToPreviousOshaPanelPage
  | initaliseOshaFormState
  | updateInitialInformationField
  | updateOshaInitialInformation
  | updateEmployeeDrInformationField
  | updateOshaCaseInformation
  | updateCaseInformationField
  | updateOshaEmployeeDrInformation
  | printOshaFormFromSidePanel
  | printOshaFormFromCard
  | initialiseEditTreatmentState
  | setTreatmentFieldValue
  | clearSelectedTreatments
  | addTreatmentRow
  | removeTreatmentRow
  | removeAllTreatments
  | removeAthlete
  | validateEditTreatmentCards
  | exportRosterBilling
  | addToast
  | updateToast
  | removeToast
  | saveMedicalHistory;

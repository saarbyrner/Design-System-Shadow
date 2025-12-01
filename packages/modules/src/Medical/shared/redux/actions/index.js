// @flow
import type { Toast, ToastId, ToastStatus } from '@kitman/components/src/types';
import type {
  MedicalNote,
  AthleteMedicalAlertDataResponse,
  AllergyDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import type { WorkersCompSubmitPayload } from '@kitman/services/src/services/medical/submitWorkersComp';
import type { Action } from '../types/actions';
import type { ConcussionTestProtocol, TreatmentSession } from '../../types';
import type { DuplicateTreatmentSession } from '../../components/AddTreatmentSidePanel/types';

// Diagnostic side panel
export const openAddDiagnosticSidePanel = (
  {
    isAthleteSelectable,
    diagnosticId,
    athleteId,
  }: {
    isAthleteSelectable: boolean,
    diagnosticId?: ?number,
    athleteId?: ?number,
  } = { isAthleteSelectable: true, diagnosticId: null, athleteId: null }
): Action => ({
  type: 'OPEN_ADD_DIAGNOSTIC_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
    diagnosticId,
    athleteId,
  },
});

export const closeAddDiagnosticSidePanel = (): Action => ({
  type: 'CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL',
});

// Diagnostic Tab: Add attachment to existing diagnostic side panel
export const openAddDiagnosticAttachmentSidePanel = ({
  diagnosticId,
  athleteId,
}: {
  diagnosticId: number,
  athleteId: number,
}): Action => ({
  type: 'OPEN_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
  payload: {
    diagnosticId,
    athleteId,
  },
});

export const closeAddDiagnosticAttachmentSidePanel = (): Action => ({
  type: 'CLOSE_ADD_DIAGNOSTIC_ATTACHMENT_SIDE_PANEL',
});

// Diagnostic Tab: Add Link to existing diagnostic side panel
export const openAddDiagnosticLinkSidePanel = ({
  diagnosticId,
  athleteId,
}: {
  diagnosticId: number,
  athleteId: number,
}): Action => ({
  type: 'OPEN_ADD_DIAGNOSTIC_LINK_SIDE_PANEL',
  payload: {
    diagnosticId,
    athleteId,
  },
});

export const closeAddDiagnosticLinkSidePanel = (): Action => ({
  type: 'CLOSE_ADD_DIAGNOSTIC_LINK_SIDE_PANEL',
});

// Note side panel
export const openAddMedicalNotePanel = (
  {
    isAthleteSelectable,
    isDuplicatingNote,
    duplicateNote,
  }: {
    isAthleteSelectable: boolean,
    isDuplicatingNote: boolean,
    duplicateNote?: ?MedicalNote,
  } = {
    isAthleteSelectable: true,
    isDuplicatingNote: false,
    duplicateNote: null,
  }
): Action => ({
  type: 'OPEN_ADD_MEDICAL_NOTE_PANEL',
  payload: {
    isAthleteSelectable,
    isDuplicatingNote,
    duplicateNote,
  },
});
export const closeAddMedicalNotePanel = (): Action => ({
  type: 'CLOSE_ADD_MEDICAL_NOTE_PANEL',
});

// Modification side panel
export const openAddModificationSidePanel = (
  {
    isAthleteSelectable,
  }: {
    isAthleteSelectable: boolean,
  } = { isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_MODIFICATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
  },
});

export const closeAddModificationSidePanel = (): Action => ({
  type: 'CLOSE_ADD_MODIFICATION_SIDE_PANEL',
});

// Treatments side panel
export const openAddTreatmentsSidePanel = (
  {
    isAthleteSelectable,
    isDuplicatingTreatment,
    duplicateTreatment,
  }: {
    isAthleteSelectable: boolean,
    isDuplicatingTreatment: boolean,
    duplicateTreatment?: ?DuplicateTreatmentSession,
  } = {
    isAthleteSelectable: true,
    isDuplicatingTreatment: false,
    duplicateTreatment: null,
  }
): Action => {
  return {
    type: 'OPEN_ADD_TREATMENTS_SIDE_PANEL',
    payload: {
      isAthleteSelectable,
      isDuplicatingTreatment,
      duplicateTreatment,
    },
  };
};

export const closeAddTreatmentsSidePanel = (): Action => ({
  type: 'CLOSE_ADD_TREATMENTS_SIDE_PANEL',
});

// Allergy side panel
export const openAddAllergySidePanel = (
  {
    isAthleteSelectable,
    selectedAllergy,
  }: {
    isAthleteSelectable: boolean,
    selectedAllergy?: ?AllergyDataResponse,
  } = { isAthleteSelectable: true, selectedAllergy: null }
): Action => ({
  type: 'OPEN_ADD_ALLERGY_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
    selectedAllergy,
  },
});

export const closeAddAllergySidePanel = (): Action => ({
  type: 'CLOSE_ADD_ALLERGY_SIDE_PANEL',
});

// Medical Alert side panel
export const openAddMedicalAlertSidePanel = (
  {
    isAthleteSelectable,
    selectedMedicalAlert,
  }: {
    isAthleteSelectable: boolean,
    selectedMedicalAlert?: ?AthleteMedicalAlertDataResponse,
  } = { isAthleteSelectable: true, selectedMedicalAlert: null }
): Action => ({
  type: 'OPEN_ADD_MEDICAL_ALERT_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
    selectedMedicalAlert,
  },
});

export const closeAddMedicalAlertSidePanel = (): Action => ({
  type: 'CLOSE_ADD_MEDICAL_ALERT_SIDE_PANEL',
});

export const openAddMedicationSidePanel = (
  {
    isAthleteSelectable,
  }: {
    isAthleteSelectable: boolean,
  } = { isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_MEDICATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
  },
});

export const closeAddMedicationSidePanel = (): Action => ({
  type: 'CLOSE_ADD_MEDICATION_SIDE_PANEL',
});

// Add procedure side panel
export const openAddProcedureSidePanel = (
  {
    isAthleteSelectable,
  }: {
    isAthleteSelectable: boolean,
  } = { isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_PROCEDURE_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
  },
});

export const closeAddProcedureSidePanel = (): Action => ({
  type: 'CLOSE_ADD_PROCEDURE_SIDE_PANEL',
});

// Procedure Tab: Add attachment to existing procedure side panel
export const openAddProcedureAttachmentSidePanel = ({
  procedureId,
  athleteId,
}: {
  procedureId: number,
  athleteId: number,
}): Action => ({
  type: 'OPEN_ADD_PROCEDURE_ATTACHMENT_SIDE_PANEL',
  payload: {
    procedureId,
    athleteId,
  },
});

export const closeAddProcedureAttachmentSidePanel = (): Action => ({
  type: 'CLOSE_ADD_PROCEDURE_ATTACHMENT_SIDE_PANEL',
});

// Add Concussion assessment side panel
export const openAddConcussionAssessmentSidePanel = (
  {
    isAthleteSelectable,
  }: {
    isAthleteSelectable: boolean,
  } = { isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
  },
});

export const closeAddConcussionAssessmentSidePanel = (): Action => ({
  type: 'CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL',
});

// Concussion test results side panel
export const openAddConcussionTestResultsSidePanel = (
  {
    testProtocol,
    isAthleteSelectable,
  }: {
    testProtocol: ConcussionTestProtocol,
    isAthleteSelectable: boolean,
  } = { testProtocol: 'NPC', isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
    testProtocol,
  },
});

export const closeAddConcussionTestResultsSidePanel = (): Action => ({
  type: 'CLOSE_ADD_CONCUSSION_TEST_RESULTS_SIDE_PANEL',
});

// Vaccination side panel
export const openAddVaccinationSidePanel = (
  {
    isAthleteSelectable,
  }: {
    isAthleteSelectable: boolean,
  } = { isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_VACCINATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
  },
});

export const closeAddVaccinationSidePanel = (): Action => ({
  type: 'CLOSE_ADD_VACCINATION_SIDE_PANEL',
});

// TUE side panel
export const openAddTUESidePanel = (
  {
    isAthleteSelectable,
  }: {
    isAthleteSelectable: boolean,
  } = { isAthleteSelectable: true }
): Action => ({
  type: 'OPEN_ADD_TUE_SIDE_PANEL',
  payload: {
    isAthleteSelectable,
  },
});

export const closeAddTUESidePanel = (): Action => ({
  type: 'CLOSE_ADD_TUE_SIDE_PANEL',
});

// Select Athletes side panel
export const openSelectAthletesSidePanel = (): Action => ({
  type: 'OPEN_SELECT_ATHLETES_SIDE_PANEL',
});

export const closeSelectAthletesSidePanel = (): Action => ({
  type: 'CLOSE_SELECT_ATHLETES_SIDE_PANEL',
});

// Treatment Card List
export const initialiseEditTreatmentState = (
  selectedAthleteIds: Array<number>,
  selectedTreatment: TreatmentSession
) => ({
  type: 'INITIALISE_EDIT_TREATMENT_STATE',
  payload: {
    selectedAthleteIds,
    selectedTreatment,
  },
});

export const setTreatmentFieldValue = (
  id: number,
  fieldKey: string,
  value: any // TODO: update this type
) => ({
  type: 'SET_TREATMENT_FIELD_VALUE',
  payload: {
    id,
    fieldKey,
    value,
  },
});

export const clearSelectedTreatments = () => ({
  type: 'CLEAR_SELECTED_TREATMENTS',
});

export const addTreatmentRow = (id: number) => ({
  type: 'ADD_TREATMENT_ROW',
  payload: {
    id,
  },
});

export const removeAllTreatments = (id: number) => ({
  type: 'REMOVE_ALL_TREATMENTS',
  payload: {
    id,
  },
});

export const removeTreatmentRow = (id: number, treatmentIndex: number) => ({
  type: 'REMOVE_TREATMENT_ROW',
  payload: {
    id,
    treatmentIndex,
  },
});

export const removeAthlete = (id: number) => ({
  type: 'REMOVE_ATHLETE',
  payload: {
    id,
  },
});

export const validateEditTreatmentCards = () => ({
  type: 'VALIDATE_EDIT_TREATMENT_CARDS',
});

export const exportRosterBilling = (): Action => ({
  type: 'EXPORT_ROSTER_BILLING',
});

// Toasts
export const addToast = (toast: Toast): Action => ({
  type: 'ADD_TOAST',
  payload: {
    toast,
  },
});
export const updateToast = (
  toastId: ToastId,
  attributes: {
    title?: string,
    description?: string,
    status?: ToastStatus,
  }
): Action => ({
  type: 'UPDATE_TOAST',
  payload: {
    toastId,
    attributes,
  },
});
export const removeToast = (toastId: ToastId): Action => ({
  type: 'REMOVE_TOAST',
  payload: {
    toastId,
  },
});

export const saveMedicalHistory = (
  athleteId: number,
  medicalHistory: MedicalHistories
): Action => ({
  type: 'SAVE_MEDICAL_HISTORY',
  payload: {
    athleteId,
    medicalHistory,
  },
});

// Workers' comp
export const openWorkersCompSidePanel = (): Action => ({
  type: 'OPEN_WORKERS_COMP_SIDE_PANEL',
});

export const closeWorkersCompSidePanel = (): Action => ({
  type: 'CLOSE_WORKERS_COMP_SIDE_PANEL',
});

export const goToNextPanelPage = (): Action => ({
  type: 'GO_TO_NEXT_PANEL_PAGE',
});

export const goToPreviousPanelPage = (): Action => ({
  type: 'GO_TO_PREVIOUS_PANEL_PAGE',
});

export const updateClaimInformationField = (
  fieldName: string,
  value: Object | string | number
): Action => ({
  type: 'UPDATE_CLAIM_INFORMATION_FIELD',
  fieldName,
  value,
});

export const updateAdditionalInformationField = (
  fieldName: string,
  value: Object | string | number
): Action => ({
  type: 'UPDATE_ADDITIONAL_INFORMATION_FIELD',
  fieldName,
  value,
});

export const showWorkersCompSubmitModal = (
  formState: WorkersCompSubmitPayload
): Action => ({
  type: 'SHOW_WORKERS_COMP_SUBMIT_MODAL',
  formState,
});

export const closeWorkersCompSubmitModal = (): Action => ({
  type: 'CLOSE_WORKERS_COMP_SUBMIT_MODAL',
});

export const initaliseWorkersCompFormState = (): Action => ({
  type: 'INITALISE_WORKERS_COMP_FORM_STATE',
});

export const updateWorkersCompClaimInformation = (
  claimInformationValues: Object
): Action => ({
  type: 'UPDATE_WORKERS_COMP_CLAIM_INFORMATION',
  claimInformationValues,
});

export const updateWorkersCompAdditionalInformation = (
  additionalInformationValues: Object
): Action => ({
  type: 'UPDATE_WORKERS_COMP_ADDITIONAL_INFORMATION',
  additionalInformationValues,
});

export const openWorkersCompPrintFlow = (): Action => ({
  type: 'OPEN_WORKERS_COMP_PRINT_FLOW',
});

export const printWorkersCompFromSidePanel = (
  showPrintPreview: boolean,
  side?: string,
  bodyArea?: string
): Action => ({
  type: 'PRINT_WORKERS_COMP_FROM_SIDE_PANEL',
  showPrintPreview,
  side,
  bodyArea,
});

export const printWorkersCompFromCard = (
  showPrintPreview: boolean,
  side?: string,
  bodyArea?: string
): Action => ({
  type: 'PRINT_WORKERS_COMP_FROM_CARD',
  showPrintPreview,
  side,
  bodyArea,
});

// OSHA Form
export const initaliseOshaFormState = (): Action => ({
  type: 'INITALISE_OSHA_FORM_STATE',
});

export const openOshaFormSidePanel = (): Action => ({
  type: 'OPEN_OSHA_FORM_SIDE_PANEL',
});

export const closeOshaFormSidePanel = (): Action => ({
  type: 'CLOSE_OSHA_FORM_SIDE_PANEL',
});

export const goToNextOshaPanelPage = (): Action => ({
  type: 'GO_TO_NEXT_OSHA_PANEL_PAGE',
});

export const goToPreviousOshaPanelPage = (): Action => ({
  type: 'GO_TO_PREVIOUS_OSHA_PANEL_PAGE',
});

export const updateInitialInformationField = (
  fieldName: string,
  value: Object | string | number
): Action => ({
  type: 'UPDATE_INITIAL_INFORMATION_FIELD',
  fieldName,
  value,
});

export const updateOshaInitialInformation = (
  initialInformationValues: Object
): Action => ({
  type: 'UPDATE_OSHA_INITIAL_INFORMATION',
  initialInformationValues,
});

export const updateOshaEmployeeDrInformation = (
  employeeDrInformationValues: Object
): Action => ({
  type: 'UPDATE_OSHA_EMPLOYEE_DR_INFORMATION',
  employeeDrInformationValues,
});

export const updateEmployeeDrInformationField = (
  fieldName: string,
  value: Object | string | number
): Action => ({
  type: 'UPDATE_EMPLOYEE_DR_INFORMATION_FIELD',
  fieldName,
  value,
});

export const updateOshaCaseInformation = (
  caseInformationValues: Object
): Action => ({
  type: 'UPDATE_OSHA_CASE_INFORMATION',
  caseInformationValues,
});

export const updateCaseInformationField = (
  fieldName: string,
  value: Object | string | number
): Action => ({
  type: 'UPDATE_CASE_INFORMATION_FIELD',
  fieldName,
  value,
});

export const printOshaFormFromSidePanel = (
  showPrintPreview: boolean
): Action => ({
  type: 'PRINT_OSHA_FORM_FROM_SIDE_PANEL',
  showPrintPreview,
});

export const printOshaFormFromCard = (showPrintPreview: boolean): Action => ({
  type: 'PRINT_OSHA_FORM_FROM_CARD',
  showPrintPreview,
});

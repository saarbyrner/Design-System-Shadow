// @flow

import type {
  IssueStatusOption,
  BamicGrades,
} from '@kitman/modules/src/AthleteInjury/types/_common';
import type { ModalStatus, GroupBy } from '@kitman/common/src/types';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { NoteData } from '@kitman/modules/src/AddNoteModal/types';
import type {
  GroupedDropdownItem,
  ToastAction,
  ToastItem,
} from '@kitman/components/src/types';
import type {
  Athlete as TreatmentAthlete,
  Action as TreatmentAction,
  TreatmentAttribute,
  treatableAreOptionResponse,
} from '@kitman/modules/src/TreatmentSessionModal/types';
import type {
  AlarmFilterOptions,
  AthleteFilterOptions,
  AvailabilityFilterOptions,
} from '@kitman/common/src/types/__common';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';

export type AbsenceData = {
  reason_id: number,
  from: string,
  to: ?string,
  athlete_id: number,
};

export type ModInfoData = {
  info: string,
  rtp: string,
};

export type ModRTPData = {
  rtp: string,
};

export type Athlete = {
  id: number,
  availability: AvailabilityStatus,
  unavailable_since: ?string,
  firstname: string,
  lastname: string,
  fullname: string,
  modification_info: ?string,
  position: string,
  positionId: number,
  positionGroup: string,
  positionGroupId: number,
  position_group: string,
  position_group_id: number,
  position_id: number,
  rtp: string,
  updated: string,
  illnesses: Array<IssueOccurrenceRequested>,
  injuries: Array<IssueOccurrenceRequested>,
  absences: Array<Object>,
};

export type DiagnosticData = {
  attachment_ids: Array<?number>,
  diagnostic_date: ?string,
  diagnostic_type: ?string,
  injury_ids: Array<?number>,
  illness_ids: Array<?number>,
  medication_type: ?string,
  medication_dosage: ?string,
  medication_frequency: ?string,
  medication_notes: ?string,
  medication_completed: boolean,
  medication_completed_at: ?string,
  covid_test_date: ?string,
  covid_test_type: ?string,
  covid_result: ?string,
  covid_reference: ?string,
  covid_antibody_test_date: ?string,
  covid_antibody_test_type: ?string,
  covid_antibody_result: ?string,
  covid_antibody_reference: ?string,
  annotation_content: ?string,
  restrict_access_to: ?string,
};

export type DiagnosticsWithExtraFields = {
  blood_tests: number,
  cardiac_data: number,
  concussion: number,
  covid_19_test: number,
  covid_19_antibody_test: number,
  medication: number,
};

type openAddAbsenceModal = {
  type: 'OPEN_ADD_ABSENCE_MODAL',
  payload: {
    athlete: ?Athlete,
  },
};

type closeAddAbsenceModal = {
  type: 'CLOSE_ADD_ABSENCE_MODAL',
};

type updateAbsenceReasonType = {
  type: 'UPDATE_ABSENCE_REASON_TYPE',
  payload: {
    reasonId: $PropertyType<AbsenceData, 'reason_id'>,
  },
};

type updateAbsenceFromDate = {
  type: 'UPDATE_ABSENCE_FROM_DATE',
  payload: {
    date: $PropertyType<AbsenceData, 'from'>,
  },
};

type updateAbsenceToDate = {
  type: 'UPDATE_ABSENCE_TO_DATE',
  payload: {
    date: $PropertyType<AbsenceData, 'to'>,
  },
};

type saveAbsence = {
  type: 'SAVE_ABSENCE_SUCCESS',
  payload: {
    athleteId: number,
    absenceData: AbsenceData,
  },
};

type openAddNoteModal = {
  type: 'OPEN_ADD_NOTE_MODAL',
  payload: {
    athlete: ?Athlete,
  },
};

type openInjuryUploadModal = {
  type: 'OPEN_INJURY_UPLOAD_MODAL',
};

type closeInjuryUploadModal = {
  type: 'CLOSE_INJURY_UPLOAD_MODAL',
};

type openModInfoModal = {
  type: 'OPEN_MOD_INFO_MODAL',
  payload: {
    athlete: ?Athlete,
  },
};

type openTreatmentModal = {
  type: 'OPEN_TREATMENT_MODAL',
  payload: {
    athlete: TreatmentAthlete,
  },
};

type updateTreatmentSessionStaticData = {
  type: 'UPDATE_TREATMENT_SESSION_STATIC_DATA',
  payload: {
    responseOptions: {
      issues_options: Array<GroupedDropdownItem>,
      treatable_area_options: Array<treatableAreOptionResponse>,
      treatment_modality_options: Array<GroupedDropdownItem>,
    },
  },
};

type closeModInfoModal = {
  type: 'CLOSE_MOD_INFO_MODAL',
};

type openRTPModal = {
  type: 'OPEN_RTP_MODAL',
  payload: {
    athlete: ?Athlete,
  },
};

type closeRTPModal = {
  type: 'CLOSE_RTP_MODAL',
};

type openDiagnosticModal = {
  type: 'OPEN_DIAGNOSTIC_MODAL',
  payload: {
    athlete: ?Athlete,
  },
};

type closeDiagnosticModal = {
  type: 'CLOSE_DIAGNOSTIC_MODAL',
};

type toggleAthleteFilters = {
  type: 'TOGGLE_ATHLETE_FILTERS',
  payload: {
    isFilterShown: boolean,
  },
};

type updateFilterOptions = {
  type: 'UPDATE_FILTER_OPTIONS',
  payload: {
    groupBy: GroupBy,
    alarmFilters: Array<?AlarmFilterOptions>,
    athleteFilters: Array<?AthleteFilterOptions>,
  },
};

type updateModInfoText = {
  type: 'UPDATE_MOD_INFO_TEXT',
  payload: {
    text: string,
  },
};

type updateModInfoRtp = {
  type: 'UPDATE_MOD_INFO_RTP',
  payload: {
    rtp: string,
  },
};

type updateInjuryUploadFile = {
  type: 'UPDATE_INJURY_UPLOAD_FILE',
  payload: {
    file: File,
  },
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type serverRequestSuccess = {
  type: 'SERVER_REQUEST_SUCCESS',
};

type saveAthleteAvailabilityModInfoSuccess = {
  type: 'SAVE_ATHLETE_AVAILABILITY_MOD_INFO_SUCCESS',
};

type saveUploadInjurySuccess = {
  type: 'SAVE_UPLOAD_INJURY_SUCCESS',
};

type saveUploadInjuryError = {
  type: 'SAVE_UPLOAD_INJURY_ERROR',
  payload: {
    errors: Array<string>,
    totalRows: number,
    skippedRows: number,
  },
};

type updateAthleteModInfo = {
  type: 'UPDATE_ATHLETE_MODINFO',
  payload: {
    athleteId: number,
    info: string,
    rtp: string,
  },
};

type serverRequestForDiagnosticIssues = {
  type: 'SERVER_REQUEST_FOR_DIAGNOSTIC_ISSUES',
};

type updateDiagnosticIssues = {
  type: 'UPDATE_DIAGNOSTIC_ISSUES',
  payload: {
    injuries: Array<?IssueOccurrenceRequested>,
    illnesses: Array<?IssueOccurrenceRequested>,
  },
};

type updateDiagnosticAttachments = {
  type: 'UPDATE_DIAGNOSTIC_ATTACHMENTS',
  payload: {
    file: File,
    index: number,
  },
};

type updateAttachmentIds = {
  type: 'UPDATE_ATTACHMENT_IDS',
  payload: {
    attachmentId: number,
  },
};

type updateDiagnosticType = {
  type: 'UPDATE_DIAGNOSTIC_TYPE',
  payload: {
    typeId: number,
  },
};

type updateDiagnosticDate = {
  type: 'UPDATE_DIAGNOSTIC_DATE',
  payload: {
    date: string,
  },
};

type updateRelevantDiagnosticInjuries = {
  type: 'UPDATE_RELEVANT_DIAGNOSTIC_INJURIES',
  payload: {
    issueId: number,
  },
};

type updateRelevantDiagnosticIllnesses = {
  type: 'UPDATE_RELEVANT_DIAGNOSTIC_ILLNESSES',
  payload: {
    issueId: number,
  },
};

type updateDiagnosticMedicationType = {
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_TYPE',
  payload: {
    type: string,
  },
};

type updateDiagnosticMedicationDosage = {
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_DOSAGE',
  payload: {
    dosage: string,
  },
};

type updateDiagnosticMedicationFrequency = {
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_FREQUENCY',
  payload: {
    frequency: string,
  },
};

type updateDiagnosticMedicationNotes = {
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_NOTES',
  payload: {
    notes: string,
  },
};

type updateDiagnosticMedicationCompleted = {
  type: 'UPDATE_DIAGNOSTIC_MEDICATION_COMPLETED',
  payload: {
    isCompleted: boolean,
  },
};

type saveAthleteAvailabilityDiagnosticSuccess = {
  type: 'SAVE_ATHLETE_AVAILABILITY_DIAGNOSTIC_SUCCESS',
};

type triggerToastDisplayProgress = {
  type: 'TRIGGER_TOAST_DISPLAY_PROGRESS',
  payload: {
    fileName: string,
    fileSize: number,
    fileId: number,
  },
};

type finishFileUpload = {
  type: 'FINISH_FILE_UPLOAD',
  payload: {
    fileId: number,
  },
};

type confirmFileUploadFailure = {
  type: 'CONFIRM_FILE_UPLOAD_FAILURE',
  payload: {
    fileId: number,
  },
};

type triggerFileUploadFailure = {
  type: 'TRIGGER_FILE_UPLOAD_FAILURE',
  payload: {
    fileId: number,
  },
};

type updateDiagnosticCovidTestDate = {
  type: 'UPDATE_DIAGNOSTIC_COVID_TEST_DATE',
  payload: {
    covidTestDate: string,
  },
};

type updateDiagnosticCovidTestType = {
  type: 'UPDATE_DIAGNOSTIC_COVID_TEST_TYPE',
  payload: {
    covidTestType: string,
  },
};

type updateDiagnosticCovidResult = {
  type: 'UPDATE_DIAGNOSTIC_COVID_RESULT',
  payload: {
    covidResult: string,
  },
};

type updateDiagnosticCovidReference = {
  type: 'UPDATE_DIAGNOSTIC_COVID_REFERENCE',
  payload: {
    covidReference: string,
  },
};

type updateDiagnosticCovidAntibodyTestDate = {
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_DATE',
  payload: {
    covidAntibodyTestDate: string,
  },
};

type updateDiagnosticCovidAntibodyTestType = {
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_TEST_TYPE',
  payload: {
    covidAntibodyTestType: string,
  },
};

type updateDiagnosticCovidAntibodyResult = {
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_RESULT',
  payload: {
    covidAntibodyResult: string,
  },
};

type updateDiagnosticCovidAntibodyReference = {
  type: 'UPDATE_DIAGNOSTIC_COVID_ANTIBODY_REFERENCE',
  payload: {
    covidAntibodyReference: string,
  },
};

type updateDiagnosticAnnotationContent = {
  type: 'UPDATE_DIAGNOSTIC_ANNOTATION_CONTENT',
  payload: {
    annotationContent: string,
  },
};

type updateDiagnosticRestrictAccessTo = {
  type: 'UPDATE_DIAGNOSTIC_RESTRICT_ACCESS_TO',
  payload: {
    restrictAccessTo: string,
  },
};

type serverRequestForAthletesByAvailability = {
  type: 'SERVER_REQUEST_FOR_ATHLETES_BY_AVAILABILITY',
};

type updateFilterOptionsByAvailability = {
  type: 'UPDATE_FILTER_OPTIONS_BY_AVAILABILITY',
  payload: {
    groupBy: GroupBy,
    alarmFilters: Array<?AlarmFilterOptions>,
    athleteFilters: Array<?AthleteFilterOptions>,
    availabilityFilters: Array<?AvailabilityFilterOptions>,
    athleteData: Array<?Athlete>,
  },
};

export type Action =
  | openAddAbsenceModal
  | closeAddAbsenceModal
  | updateDiagnosticMedicationType
  | updateDiagnosticMedicationDosage
  | updateDiagnosticMedicationFrequency
  | updateDiagnosticMedicationNotes
  | updateDiagnosticMedicationCompleted
  | updateAbsenceReasonType
  | updateAbsenceFromDate
  | updateAbsenceToDate
  | finishFileUpload
  | triggerToastDisplayProgress
  | confirmFileUploadFailure
  | triggerFileUploadFailure
  | saveAbsence
  | openTreatmentModal
  | updateTreatmentSessionStaticData
  | openAddNoteModal
  | toggleAthleteFilters
  | hideAppStatus
  | serverRequest
  | serverRequestSuccess
  | serverRequestError
  | openModInfoModal
  | closeModInfoModal
  | openRTPModal
  | closeRTPModal
  | updateModInfoText
  | updateModInfoRtp
  | saveAthleteAvailabilityModInfoSuccess
  | openInjuryUploadModal
  | closeInjuryUploadModal
  | updateInjuryUploadFile
  | saveUploadInjurySuccess
  | saveUploadInjuryError
  | openDiagnosticModal
  | closeDiagnosticModal
  | updateAthleteModInfo
  | serverRequestForDiagnosticIssues
  | updateDiagnosticIssues
  | updateDiagnosticAttachments
  | updateAttachmentIds
  | updateDiagnosticType
  | updateDiagnosticDate
  | updateRelevantDiagnosticInjuries
  | updateRelevantDiagnosticIllnesses
  | saveAthleteAvailabilityDiagnosticSuccess
  | updateFilterOptions
  | updateDiagnosticCovidTestDate
  | updateDiagnosticCovidTestType
  | updateDiagnosticCovidResult
  | updateDiagnosticCovidReference
  | updateDiagnosticCovidAntibodyTestDate
  | updateDiagnosticCovidAntibodyTestType
  | updateDiagnosticCovidAntibodyResult
  | updateDiagnosticCovidAntibodyReference
  | updateDiagnosticAnnotationContent
  | updateDiagnosticRestrictAccessTo
  | serverRequestForAthletesByAvailability
  | updateFilterOptionsByAvailability;

export type TreatmentState = {
  isModalOpen: boolean,
  athlete: TreatmentAthlete,
  treatmentSession: {
    athlete_id: number,
    user_id: number,
    timezone: string,
    title: string,
    treatments_attributes: Array<TreatmentAttribute>,
    annotation_attributes: {
      content: string,
      attachments_attributes: Array<{
        original_filename: string,
        filetype: string,
        filesize: number,
      }>,
    },
  },
  unUploadedFiles: Array<Object>,
  staticData: {
    bodyAreaOptions: Array<GroupedDropdownItem>,
    treatmentModalityOptions: Array<GroupedDropdownItem>,
    reasonOptions: Array<GroupedDropdownItem>,
    users: Array<{ id: number, name: string }>,
  },
};

export type AthleteState = {
  isLoading: boolean,
  all: Array<Athlete>,
  grouped: {
    position: { [string]: Array<Athlete> },
    positionGroup: { [string]: Array<Athlete> },
    availability: { [string]: Array<Athlete> },
    last_screening: { [string]: Array<Athlete> },
    name: { [string]: Array<Athlete> },
  },
  currentlyVisible: { [string]: Array<Athlete> },
  groupBy: GroupBy,
  groupOrderingByType: { [GroupBy]: Array<string> },
  isFilterShown: boolean,
  athleteFilters: Array<?AthleteFilterOptions>,
  groupingLabels: { string: string },
  availabilityByPositionGroup: { [string]: number },
  availabilityByPosition: { [string]: number },
  orgLogoPath: string,
  totalAvailableAthletes: string,
  totalAthleteCount: string,
  squadAvailabilityPercentage: string,
  currentOrgName: string,
  currentSquadName: string,
  currentUserName: string,
};

export type IssueStaticDataState = {
  injuryOsicsPathologies: Array<{ id: string, name: string }>,
  illnessOsicsPathologies: Array<{ id: string, name: string }>,
  absenceReasons: Array<{ id: number, reason: string, order: number }>,
  issueStatusOptions: Array<IssueStatusOption>,
  sides: Array<{ id: number, name: string }>,
  canViewIssues: boolean,
  canManageIssues: boolean,
  canViewAbsences: boolean,
  canManageAbsences: boolean,
  bamicGrades: BamicGrades,
};

export type AbsenceState = {
  absenceData: AbsenceData,
  athlete: Athlete,
  isModalOpen: boolean,
};

export type NoteState = {
  athlete: Athlete,
  athleteInjuries: Array<?IssueOccurrenceRequested>,
  athleteIllnesses: Array<?IssueOccurrenceRequested>,
  isModalOpen: boolean,
  attachments: Array<?File>,
  noteData: NoteData,
  noteMedicalTypeOptions: Array<GroupedDropdownItem>,
  requestStatus: {
    status: ?string,
    message: ?string,
  },
};

export type ModInfoState = {
  athlete: Athlete,
  isModalOpen: boolean,
  modInfoData: ModInfoData,
};

export type RTPModalState = {
  athlete: Athlete,
  isModalOpen: boolean,
  modRTPData: {
    rtp: string,
  },
};

export type DiagnosticModalState = {
  athlete: Athlete,
  athleteInjuries: Array<?IssueOccurrenceRequested>,
  athleteIllnesses: Array<?IssueOccurrenceRequested>,
  attachments: Array<?File>,
  isModalOpen: boolean,
  diagnosticData: DiagnosticData,
};

export type InjuryUploadModalState = {
  isModalOpen: boolean,
  file: File,
  errors: {
    messages: ?Array<string>,
    totalRows: ?number,
    skippedRows: ?number,
  },
};

export type FileUploadToastState = {
  fileOrder: Array<?number>,
  fileMap: {
    [number]: ToastItem,
  },
};

export type AppStatusState = {
  status: ?ModalStatus,
  message: ?string,
};

export type Store = {
  athletes: AthleteState,
  issueStaticData: IssueStaticDataState,
  addAbsenceModal: AbsenceState,
  treatmentSessionModal: TreatmentState,
  fileUploadToast: FileUploadToastState,
  noteModal: NoteState,
  modInfoModal: ModInfoState,
  diagnosticModal: DiagnosticModalState,
  injuryUploadModal: InjuryUploadModalState,
  appStatus: AppStatusState,
};

type Dispatch = (
  // eslint-disable-next-line no-use-before-define
  action: Action | ThunkAction | TreatmentAction | ToastAction
) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

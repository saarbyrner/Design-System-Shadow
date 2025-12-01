// @flow
/* eslint-disable no-use-before-define */
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { Grade } from '@kitman/services/src/services/medical/getGrades';
import type {
  Coding,
  CodingSystemKey,
  SecondaryPathology,
} from '@kitman/common/src/types/Coding';
import type {
  DuplicateTreatmentSession,
  UnuploadedFile,
} from '@kitman/modules/src/Medical/shared/components/AddTreatmentSidePanel/types';
import type {
  Question as QuestionType,
  IssueOccurrenceRequested,
} from '@kitman/common/src/types/Issues';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { ChronicIssue } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { GameAndTrainingOptions } from '@kitman/services/src/services/medical/getGameAndTrainingOptions';
import type { GridData, RosterFilters } from '../../../types';

import type {
  ConditionalFieldAnswer,
  IssueType,
  RequestStatus,
} from '../../../../shared/types';
import type { Store } from './store';

/* ------------ app ACTIONS ------------ */
type requestFailure = {
  type: 'REQUEST_FAILURE',
};
type requestPending = {
  type: 'REQUEST_PENDING',
};
type requestSuccess = {
  type: 'REQUEST_SUCCESS',
};
type requestCommentsGridSuccess = {
  type: 'REQUEST_COMMENTS_GRID_SUCCESS',
};
type requestCommentsGridFailure = {
  type: 'REQUEST_COMMENTS_GRID_FAILURE',
};
type setCommentsGridRequestStatus = {
  type: 'SET_COMMENTS_GRID_REQUEST_STATUS',
  payload: {
    commentsGridRequestStatus: string,
  },
};
type setRequestStatus = {
  type: 'SET_REQUEST_STATUS',
  payload: {
    requestStatus: string,
  },
};

/* ------------ addIssuePanel ACTIONS ------------ */
type openAddIssuePanel = {
  type: 'OPEN_ADD_ISSUE_PANEL',
  payload: {
    athleteId?: number,
    squadId?: number,
    positionId?: number,
    isAthleteSelectable: boolean,
    athleteData: AthleteData,
  },
};
type openAddIssuePanelPreviousState = {
  type: 'OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE',
  payload: {
    previousPanelState: Object,
  },
};
type closeAddIssuePanel = {
  type: 'CLOSE_ADD_ISSUE_PANEL',
};
type setIssueTitle = {
  type: 'SET_ISSUE_TITLE',
  payload: {
    title: string,
  },
};

type setLinkedIssues = {
  type: 'SET_LINKED_ISSUES',
  payload: {
    ids: number[],
    type: IssueType,
  },
};

export type IssueLink = {
  title: string,
  uri: string,
  id?: string,
};

type updateIssueLinks = {
  type: 'UPDATE_ISSUE_LINKS',
  payload: IssueLink[],
};

type updateIssueFiles = {
  type: 'UPDATE_ISSUE_FILES',
  payload: UnuploadedFile[],
};

type setChronicIssue = {
  type: 'SET_CHRONIC_ISSUE',
  payload: ChronicIssue,
};

type setChronicConditionOnsetDate = {
  type: 'SET_CHRONIC_CONDITION_ONSET_DATE',
  payload: {
    date: string,
  },
};

type addAdditionalAnnotation = {
  type: 'ADD_ADDITIONAL_ANNOTATION',
  payload: {
    attachmentType: string,
  },
};
type addStatus = {
  type: 'ADD_STATUS',
};
type createIssueFailure = {
  type: 'CREATE_ISSUE_FAILURE',
};
type createIssuePending = {
  type: 'CREATE_ISSUE_PENDING',
};
type createIssueSuccess = {
  type: 'CREATE_ISSUE_SUCCESS',
  payload?: Object,
};
type enterSupplementalPathology = {
  type: 'ENTER_SUPPLEMENTAL_PATHOLOGY',
  payload: {
    supplementalPathology: string,
  },
};
type goToNextPanelPage = {
  type: 'GO_TO_NEXT_PANEL_PAGE',
};
type goToPreviousPanelPage = {
  type: 'GO_TO_PREVIOUS_PANEL_PAGE',
};
type removeAdditionalAnnotation = {
  type: 'REMOVE_ADDITIONAL_ANNOTATION',
  payload: {
    index: number,
  },
};
type removeStatus = {
  type: 'REMOVE_STATUS',
  payload: {
    index: number,
  },
};
type removeSupplementalPathology = {
  type: 'REMOVE_SUPPLEMENTAL_PATHOLOGY',
};
type selectActivity = {
  type: 'SELECT_ACTIVITY',
  payload: {
    activity: ?number,
  },
};
type updatePrimaryMechanismFreetext = {
  type: 'UPDATE_PRIMARY_MECHANISM_FREE_TEXT',
  payload: {
    freeText: string,
  },
};
type selectAthlete = {
  type: 'SELECT_ATHLETE',
  payload: {
    athleteId: number,
  },
};
type selectAthleteData = {
  type: 'SELECT_ATHLETE_DATA',
  payload: {
    athleteData: AthleteData,
  },
};
type selectBodyArea = {
  type: 'SELECT_BODY_AREA',
  payload: {
    codingSystem: CodingSystemKey,
    bodyAreaId: number,
  },
};
type selectCoding = {
  type: 'SELECT_CODING',
  payload: {
    coding: Coding,
  },
};
type selectSupplementalCoding = {
  type: 'SELECT_SUPPLEMENTAL_CODING',
  payload: {
    supplementaryCoding: Coding,
  },
};
type selectClassification = {
  type: 'SELECT_CLASSIFICATION',
  payload: {
    codingSystem: CodingSystemKey,
    classificationId: number,
  },
};
type selectDiagnosisDate = {
  type: 'SELECT_DIAGNOSIS_DATE',
  payload: {
    date: string,
  },
};

type selectReportedDate = {
  type: 'SELECT_REPORTED_DATE',
  payload: {
    date: string,
  },
};
type selectPresentationType = {
  type: 'SELECT_PRESENTATION_TYPE',
  payload: {
    presentationTypeId: number,
  },
};

type setPresentationTypeFreeText = {
  type: 'SET_PRESENTATION_TYPE_FREE_TEXT',
  payload: {
    presentationTypeFreeText: string,
  },
};
type selectMechanismDescription = {
  type: 'SELECT_MECHANISM_DESCRIPTION',
  payload: {
    mechanismDescription: string,
  },
};
type selectIssueContactType = {
  type: 'SELECT_ISSUE_CONTACT_TYPE',
  payload: {
    issueContactType: number,
  },
};
type setIssueContactFreetext = {
  type: 'SET_ISSUE_CONTACT_FREE_TEXT',
  payload: {
    freeText: string,
  },
};
type selectInjuryMechanism = {
  type: 'SELECT_INJURY_MECHANISM',
  payload: {
    injuryMechanismId: number,
  },
};
type updateInjuryMechanismFreetext = {
  type: 'UPDATE_INJURY_MECHANISM_FREE_TEXT',
  payload: {
    freeText: string,
  },
};
type selectEvent = {
  type: 'SELECT_EVENT',
  payload: {
    eventId: string,
    eventType: string,
  },
};
type selectExaminationDate = {
  type: 'SELECT_EXAMINATION_DATE',
  payload: {
    date: string,
  },
};
type selectIssueType = {
  type: 'SELECT_ISSUE_TYPE',
  payload: {
    issueType: string,
  },
};
type selectOnset = {
  type: 'SELECT_ONSET',
  payload: {
    onset: string,
  },
};
type selectOnsetDescription = {
  type: 'SELECT_ONSET_DESCRIPTION',
  payload: {
    onsetDescription: string,
  },
};

type setOnsetFreeText = {
  type: 'SET_ONSET_FREE_TEXT',
  payload: {
    freeText: string,
  },
};
type selectPathology = {
  type: 'SELECT_PATHOLOGY',
  payload: {
    pathology: number,
  },
};

type selectCodingSystemPathology = {
  type: 'SELECT_CODING_SYSTEM_PATHOLOGY',
  payload: {
    pathology: ?MultiCodingV2Pathology,
  },
};
type updateAttachedConcussionAssessments = {
  type: 'UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS',
  payload: {
    assessmentIds: Array<number>,
  },
};
type selectPositionWhenInjured = {
  type: 'SELECT_POSITION_WHEN_INJURED',
  payload: {
    positionWhenInjured: number,
  },
};
type selectPreviousIssue = {
  type: 'SELECT_PREVIOUS_ISSUE',
  payload: {
    issueId: number,
    previousIssueId: number,
  },
};
type selectContinuationIssue = {
  type: 'SELECT_CONTINUATION_ISSUE',
  payload: {
    issue: IssueOccurrenceRequested,
  },
};
type selectRelatedChronicIssues = {
  type: 'SELECT_RELATED_CHRONIC_ISSUES',
  payload: {
    issueIds: Array<string>,
  },
};
type selectSessionCompleted = {
  type: 'SELECT_SESSION_COMPLETED',
  payload: {
    sessionCompleted: string,
  },
};
type selectSide = {
  type: 'SELECT_SIDE',
  payload: {
    codingSystem: CodingSystemKey,
    side: string,
  },
};
type selectSquad = {
  type: 'SELECT_SQUAD',
  payload: {
    squadId: string,
  },
};
type selectTimeOfInjury = {
  type: 'SELECT_TIME_OF_INJURY',
  payload: {
    injuryTime: string,
  },
};
type updateBodyArea = {
  type: 'UPDATE_BODY_AREA',
  payload: {
    bodyArea: number,
  },
};
type updateClassification = {
  type: 'UPDATE_CLASSIFICATION',
  payload: {
    classification: number,
  },
};
type updateGroups = {
  type: 'UPDATE_GROUPS',
  payload: {
    groups: ?Array<string>,
  },
};
type updateEvents = {
  type: 'UPDATE_EVENTS',
  payload: GameAndTrainingOptions,
};
type updateIcdCode = {
  type: 'UPDATE_ICD_CODE',
  payload: {
    icdCode: number,
  },
};
type updateInitialNote = {
  type: 'UPDATE_INITIAL_NOTE',
  payload: {
    note: string,
  },
};
type updateAnnotationContent = {
  type: 'UPDATE_ANNOTATION_CONTENT',
  payload: {
    index: number,
    content: string,
  },
};

type updateAnnotationVisibility = {
  type: 'UPDATE_ANNOTATION_VISIBILITY',
  payload: {
    index: number,
    visibility: string,
  },
};
type updateAnnotationAttachmentAttributes = {
  type: 'UPDATE_ANNOTATION_ATTACHMENTS_ATTRIBUTES',
  payload: {
    index: number,
    files: Array<any>,
  },
};
type updateAnnotationFilesQueue = {
  type: 'UPDATE_ANNOTATION_FILES_QUEUE',
  payload: {
    index: number,
    files: Array<any>,
  },
};

type updateOsicsCode = {
  type: 'UPDATE_OSICS_CODE',
  payload: {
    osicsCode: number,
  },
};
type updateStatusDate = {
  type: 'UPDATE_STATUS_DATE',
  payload: {
    index: number,
    date: string,
  },
};
type updateStatusType = {
  type: 'UPDATE_STATUS_TYPE',
  payload: {
    index: number,
    status: string,
  },
};
type updateConditionalFieldsAnswers = {
  type: 'UPDATE_CONDITIONAL_FIELDS_ANSWERS',
  payload: {
    answers: Array<ConditionalFieldAnswer>,
  },
};
type setPathologyGroupRequestStatus = {
  type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
  payload: {
    requestStatus: RequestStatus,
  },
};

/* ------------ addMedicalNotePanel ACTIONS ------------ */
type openAddMedicalNotePanel = {
  type: 'OPEN_ADD_MEDICAL_NOTE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    isDuplicatingNote: boolean,
    duplicateNote?: ?MedicalNote,
  },
};
type closeAddMedicalNotePanel = {
  type: 'CLOSE_ADD_MEDICAL_NOTE_PANEL',
};

/* ------------ addModificationSidePanel ACTIONS ------------ */
type openAddModificationSidePanel = {
  type: 'OPEN_ADD_MODIFICATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
type closeAddModificationSidePanel = {
  type: 'CLOSE_ADD_MODIFICATION_SIDE_PANEL',
};

/* ------------ addTreatmentsSidePanel ACTIONS ------------ */
type openAddTreatmentsSidePanel = {
  type: 'OPEN_ADD_TREATMENTS_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
    isDuplicatingTreatment: boolean,
    duplicateTreatment?: ?DuplicateTreatmentSession,
  },
};
type closeAddTreatmentsSidePanel = {
  type: 'CLOSE_ADD_TREATMENTS_SIDE_PANEL',
};

/* ------------ addAllergySidePanel ACTIONS ------------ */
type openAddAllergySidePanel = {
  type: 'OPEN_ADD_ALLERGY_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
type closeAddAllergySidePanel = {
  type: 'CLOSE_ADD_ALLERGY_SIDE_PANEL',
};

/* ------------ addMedicalAlertSidePanel ACTIONS ------------ */
type openAddMedicalAlertSidePanel = {
  type: 'OPEN_ADD_MEDICAL_ALERT_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
type closeAddMedicalAlertSidePanel = {
  type: 'CLOSE_ADD_MEDICAL_ALERT_SIDE_PANEL',
};

type openAddMedicationSidePanel = {
  type: 'OPEN_ADD_MEDICATION_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
type closeAddMedicationSidePanel = {
  type: 'CLOSE_ADD_MEDICATION_SIDE_PANEL',
};

/* ------------ addProcedureSidePanel ACTIONS ------------ */
type openAddProcedureSidePanel = {
  type: 'OPEN_ADD_PROCEDURE_SIDE_PANEL',
  payload: {
    isAthleteSelectable: boolean,
  },
};
type closeAddProcedureSidePanel = {
  type: 'CLOSE_ADD_PROCEDURE_SIDE_PANEL',
};

/* ------------ grid ACTIONS ------------ */

type resetGridPagination = {
  type: 'RESET_GRID_PAGINATION',
};

type setGridPagination = {
  type: 'SET_GRID_PAGINATION',
  payload: {
    currentId: number | null,
  },
};

type fetchGridSuccess = {
  type: 'FETCH_GRID_SUCCESS',
  payload: {
    grid: GridData,
    reset: boolean,
  },
};

type fetchCommentsGridSuccess = {
  type: 'FETCH_COMMENTS_GRID_SUCCESS',
  payload: {
    reset: boolean,
    grid: GridData,
  },
};

type updateComment = {
  type: 'UPDATE_COMMENT',
  payload: {
    comment: string,
    rowId: number,
  },
};

type resetCommentsGrid = {
  type: 'RESET_COMMENTS_GRID',
};

type resetGrid = {
  type: 'RESET_GRID',
};

/* ------------ filters ACTIONS ------------ */
type updateFilters = {
  type: 'UPDATE_FILTERS',
  payload: {
    filters: RosterFilters,
  },
};
/* ------------ filters ACTIONS ------------ */
type updateCoachesReportFilters = {
  type: 'UPDATE_COACHES_REPORT_FILTERS',
  payload: {
    filters: RosterFilters,
  },
};

/* ------------ BAMIC ACTIONS ------------ */
type setBamicGrades = {
  type: 'SET_BAMIC_GRADES_OPTIONS',
  payload: {
    bamicGradesOptions: Array<Grade>,
  },
};
type selectBamicGrade = {
  type: 'SELECT_BAMIC_GRADE',
  payload: {
    bamicGrade: number,
  },
};
type selectBamicSite = {
  type: 'SELECT_BAMIC_SITE',
  payload: {
    bamicSite: number,
  },
};
type updateIsBamic = {
  type: 'UPDATE_IS_BAMIC',
  payload: {
    isBamic: boolean,
  },
};

type setConditionalFieldRequestStatus = {
  type: 'SET_CONDITIONAL_FIELDS_REQUEST_STATUS',
  payload: {
    requestStatus: string,
  },
};

type setConditionalFieldsQuestions = {
  type: 'SET_CONDITIONAL_FIELDS_QUESTIONS',
  payload: {
    questions: Array<QuestionType>,
  },
};

type addSecondaryPathology = {
  type: 'ADD_SECONDARY_PATHOLOGY',
  payload: {
    secondaryPathology: SecondaryPathology,
  },
};
type editSecondaryPathology = {
  type: 'EDIT_SECONDARY_PATHOLOGY',
  payload: {
    index: number,
    secondaryPathology: SecondaryPathology,
  },
};

type removeSecondaryPathology = {
  type: 'REMOVE_SECONDARY_PATHOLOGY',
  payload: {
    index: number,
  },
};

export type Action =
  | requestFailure
  | requestPending
  | requestSuccess
  | requestCommentsGridSuccess
  | requestCommentsGridFailure
  | setCommentsGridRequestStatus
  | setRequestStatus
  | openAddIssuePanel
  | closeAddIssuePanel
  | addAdditionalAnnotation
  | addStatus
  | createIssueFailure
  | createIssuePending
  | createIssueSuccess
  | enterSupplementalPathology
  | goToNextPanelPage
  | goToPreviousPanelPage
  | removeAdditionalAnnotation
  | removeStatus
  | removeSupplementalPathology
  | selectActivity
  | updatePrimaryMechanismFreetext
  | selectAthlete
  | selectAthleteData
  | selectBodyArea
  | selectCoding
  | selectSupplementalCoding
  | selectClassification
  | selectDiagnosisDate
  | selectReportedDate
  | selectMechanismDescription
  | selectPresentationType
  | setPresentationTypeFreeText
  | selectIssueContactType
  | setIssueContactFreetext
  | selectEvent
  | selectExaminationDate
  | selectIssueType
  | selectOnset
  | setOnsetFreeText
  | selectOnsetDescription
  | selectPathology
  | selectCodingSystemPathology
  | updateAttachedConcussionAssessments
  | selectPositionWhenInjured
  | selectPreviousIssue
  | selectContinuationIssue
  | selectRelatedChronicIssues
  | selectSessionCompleted
  | selectSide
  | selectSquad
  | selectInjuryMechanism
  | updateInjuryMechanismFreetext
  | selectTimeOfInjury
  | updateBodyArea
  | updateClassification
  | updateGroups
  | updateFilters
  | updateCoachesReportFilters
  | updateEvents
  | updateIcdCode
  | updateInitialNote
  | updateAnnotationContent
  | updateAnnotationVisibility
  | updateAnnotationAttachmentAttributes
  | updateAnnotationFilesQueue
  | updateOsicsCode
  | updateStatusDate
  | updateStatusType
  | updateConditionalFieldsAnswers
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
  | setGridPagination
  | resetGridPagination
  | fetchGridSuccess
  | fetchCommentsGridSuccess
  | resetGrid
  | updateComment
  | resetCommentsGrid
  | setBamicGrades
  | selectBamicGrade
  | selectBamicSite
  | setIssueTitle
  | setLinkedIssues
  | updateIssueLinks
  | updateIssueFiles
  | updateIsBamic
  | setConditionalFieldRequestStatus
  | setConditionalFieldsQuestions
  | addSecondaryPathology
  | removeSecondaryPathology
  | editSecondaryPathology
  | setChronicIssue
  | setChronicConditionOnsetDate
  | setPathologyGroupRequestStatus
  | openAddIssuePanelPreviousState;

// redux specific types for thunk actions
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

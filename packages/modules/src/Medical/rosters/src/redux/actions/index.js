// @flow
import $ from 'jquery';
import moment from 'moment';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { GameAndTrainingOptions } from '@kitman/services/src/services/medical/getGameAndTrainingOptions';
import type {
  AnnotationAttachement,
  RequestStatus,
} from '@kitman/modules/src/Medical/shared/types';
import type {
  Coding,
  CodingSystemKey,
  SecondaryPathology,
} from '@kitman/common/src/types/Coding';
import type { OrganisationCodingSystem } from '@kitman/services/src/services/getOrganisation';
import _cloneDeep from 'lodash/cloneDeep';
import { uploadFile, getGroupsForPathology } from '@kitman/services';
import type {
  FreeTextComponent,
  Question as QuestionType,
  IssueOccurrenceRequested,
} from '@kitman/common/src/types/Issues';
import type { ChronicIssue } from '@kitman/services/src/services/medical/getAthleteChronicIssues';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import i18n from '@kitman/common/src/utils/i18n';
import { convertUrlToFile } from '@kitman/common/src/utils/fileHelper';
import { getCoachesReportData } from '@kitman/services/src/services/medical';
import type { ConditionalFieldAnswer as ConditionalFieldAnswerV2 } from '@kitman/modules/src/ConditionalFields/shared/types';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import {
  addToast,
  updateToast,
  removeToast,
} from '../../../../shared/redux/actions/index';
import type { Action as ToastAction } from '../../../../shared/redux/types/actions';
import type { RosterFilters, GridData } from '../../../types';
import type {
  ConditionalFieldAnswer as ConditionalFieldAnswerV1,
  IssueType,
} from '../../../../shared/types';
import {
  emptyHTMLeditorContent,
  issueIsAnInjury,
  isV2MultiCodingSystem,
} from '../../../../shared/utils';
import type { Action, IssueLink, ThunkAction } from '../types/actions';
import type { UnuploadedFile } from '../../../../shared/components/AddTreatmentSidePanel/types';
import { getConditionalFields } from '../../services/getConditionalFields';

/* ------------ appState ACTIONS ------------ */
export const requestPending = (): Action => ({
  type: 'REQUEST_PENDING',
});

export const requestFailure = (): Action => ({
  type: 'REQUEST_FAILURE',
});

export const requestSuccess = (): Action => ({
  type: 'REQUEST_SUCCESS',
});

export const setRequestStatus = (requestStatus: string): Action => ({
  type: 'SET_REQUEST_STATUS',
  payload: {
    requestStatus,
  },
});

export const requestCommentsGridFailure = (): Action => ({
  type: 'REQUEST_COMMENTS_GRID_FAILURE',
});

export const requestCommentsGridSuccess = (): Action => ({
  type: 'REQUEST_COMMENTS_GRID_SUCCESS',
});

export const setCommentsGridRequestStatus = (
  commentsGridRequestStatus: string
): Action => ({
  type: 'SET_COMMENTS_GRID_REQUEST_STATUS',
  payload: {
    commentsGridRequestStatus,
  },
});

/* ------------ addIssuePanel ACTIONS ------------ */
export const openAddIssuePanel = (
  {
    athleteId,
    squadId,
    positionId,
    isAthleteSelectable = true,
    athleteData,
  }: {
    athleteId?: number,
    squadId?: number,
    positionId?: number,
    isAthleteSelectable?: boolean,
    athleteData?: AthleteData,
  } = {
    athleteId: undefined,
    squadId: undefined,
    positionId: undefined,
    isAthleteSelectable: true,
    athleteData: {},
  }
): Action => ({
  type: 'OPEN_ADD_ISSUE_PANEL',
  payload: {
    athleteId,
    squadId,
    positionId,
    isAthleteSelectable,
    athleteData,
  },
});

export const openAddIssuePanelPreviousState = (
  previousPanelState: Object
): Action => ({
  type: 'OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE',
  payload: {
    previousPanelState,
  },
});

export const closeAddIssuePanel = (): Action => ({
  type: 'CLOSE_ADD_ISSUE_PANEL',
});
export const addAdditionalAnnotation = (attachmentType: string): Action => ({
  type: 'ADD_ADDITIONAL_ANNOTATION',
  payload: {
    attachmentType,
  },
});
export const addStatus = (): Action => ({
  type: 'ADD_STATUS',
});
export const createIssueFailure = (): Action => ({
  type: 'CREATE_ISSUE_FAILURE',
});
export const createIssuePending = (): Action => ({
  type: 'CREATE_ISSUE_PENDING',
});
export const createIssueSuccess = (
  issueCreateResponse?: Object = {}
): Action => ({
  type: 'CREATE_ISSUE_SUCCESS',
  payload: issueCreateResponse,
});
export const enterSupplementalPathology = (
  supplementalPathology: string
): Action => ({
  type: 'ENTER_SUPPLEMENTAL_PATHOLOGY',
  payload: {
    supplementalPathology,
  },
});
export const removeAdditionalAnnotation = (index: number): Action => ({
  type: 'REMOVE_ADDITIONAL_ANNOTATION',
  payload: {
    index,
  },
});
export const removeStatus = (index: number): Action => ({
  type: 'REMOVE_STATUS',
  payload: {
    index,
  },
});
export const removeSupplementalPathology = (): Action => ({
  type: 'REMOVE_SUPPLEMENTAL_PATHOLOGY',
});
export const goToNextPanelPage = (): Action => ({
  type: 'GO_TO_NEXT_PANEL_PAGE',
});
export const goToPreviousPanelPage = (): Action => ({
  type: 'GO_TO_PREVIOUS_PANEL_PAGE',
});
export const selectActivity = (activity: ?number): Action => ({
  type: 'SELECT_ACTIVITY',
  payload: {
    activity,
  },
});
export const updatePrimaryMechanismFreetext = (freeText: string): Action => ({
  type: 'UPDATE_PRIMARY_MECHANISM_FREE_TEXT',
  payload: {
    freeText,
  },
});
export const selectAthlete = (athleteId: number): Action => ({
  type: 'SELECT_ATHLETE',
  payload: {
    athleteId,
  },
});
export const selectAthleteData = (athleteData: AthleteData): Action => ({
  type: 'SELECT_ATHLETE_DATA',
  payload: {
    athleteData,
  },
});
export const selectBodyArea = (
  codingSystem: CodingSystemKey,
  bodyAreaId: number
): Action => ({
  type: 'SELECT_BODY_AREA',
  payload: {
    codingSystem,
    bodyAreaId,
  },
});
export const selectClassification = (
  codingSystem: CodingSystemKey,
  classificationId: number
): Action => ({
  type: 'SELECT_CLASSIFICATION',
  payload: {
    codingSystem,
    classificationId,
  },
});
export const selectDiagnosisDate = (date: string): Action => ({
  type: 'SELECT_DIAGNOSIS_DATE',
  payload: {
    date,
  },
});
export const selectReportedDate = (date: string): Action => ({
  type: 'SELECT_REPORTED_DATE',
  payload: {
    date,
  },
});
export const selectMechanismDescription = (
  mechanismDescription: string
): Action => ({
  type: 'SELECT_MECHANISM_DESCRIPTION',
  payload: {
    mechanismDescription,
  },
});
export const selectPresentationType = (presentationTypeId: number): Action => ({
  type: 'SELECT_PRESENTATION_TYPE',
  payload: {
    presentationTypeId,
  },
});
export const setPresentationTypeFreeText = (
  presentationTypeFreeText: string
): Action => ({
  type: 'SET_PRESENTATION_TYPE_FREE_TEXT',
  payload: {
    presentationTypeFreeText,
  },
});
export const selectIssueContactType = (issueContactType: number): Action => ({
  type: 'SELECT_ISSUE_CONTACT_TYPE',
  payload: {
    issueContactType,
  },
});

export const setIssueContactFreetext = (freeText: string): Action => ({
  type: 'SET_ISSUE_CONTACT_FREE_TEXT',
  payload: {
    freeText,
  },
});

export const selectInjuryMechanism = (injuryMechanismId: number): Action => ({
  type: 'SELECT_INJURY_MECHANISM',
  payload: {
    injuryMechanismId,
  },
});

export const updateInjuryMechanismFreetext = (freeText: string): Action => ({
  type: 'UPDATE_INJURY_MECHANISM_FREE_TEXT',
  payload: {
    freeText,
  },
});

export const selectEvent = (eventId: string, eventType: string): Action => ({
  type: 'SELECT_EVENT',
  payload: {
    eventId,
    eventType,
  },
});
export const selectExaminationDate = (date: string): Action => ({
  type: 'SELECT_EXAMINATION_DATE',
  payload: {
    date,
  },
});

export const selectCoding = (coding: Coding): Action => ({
  type: 'SELECT_CODING',
  payload: {
    coding,
  },
});

export const selectSupplementalCoding = (
  supplementaryCoding: Coding
): Action => ({
  type: 'SELECT_SUPPLEMENTAL_CODING',
  payload: {
    supplementaryCoding,
  },
});

export const setPathologyGroupRequestStatus = (
  requestStatus: RequestStatus
): Action => ({
  type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
  payload: {
    requestStatus,
  },
});

export const fetchGroupAndSelectCoding =
  (
    coding: Coding,
    organisationCodingSystem: ?OrganisationCodingSystem
  ): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    if (!organisationCodingSystem) {
      dispatch(selectCoding(coding)); // Just set the received coding object as is
      dispatch(setPathologyGroupRequestStatus('FAILURE'));
      return;
    }

    const codingObject = coding[organisationCodingSystem.key];
    if (!codingObject) {
      dispatch(selectCoding(coding)); // Just set the received coding object as is
      dispatch(setPathologyGroupRequestStatus('FAILURE'));
      return;
    }

    const pathologyCode = codingObject.code || codingObject.osics_id;
    dispatch(setPathologyGroupRequestStatus('PENDING'));

    getGroupsForPathology(pathologyCode, organisationCodingSystem.id)
      .then((groups) => {
        codingObject.groups = groups;
        dispatch(selectCoding(coding));
        dispatch(setPathologyGroupRequestStatus('SUCCESS'));
      })
      .catch(() => {
        dispatch(selectCoding(coding)); // Just set the received coding object as is
        dispatch(setPathologyGroupRequestStatus('FAILURE'));
      });
  };

export const selectIssueType = (issueType: string): Action => ({
  type: 'SELECT_ISSUE_TYPE',
  payload: {
    issueType,
  },
});
export const selectOnset = (onset: string): Action => ({
  type: 'SELECT_ONSET',
  payload: {
    onset,
  },
});
export const selectOnsetDescription = (onsetDescription: string): Action => ({
  type: 'SELECT_ONSET_DESCRIPTION',
  payload: {
    onsetDescription,
  },
});
export const setOnsetFreeText = (freeText: string): Action => ({
  type: 'SET_ONSET_FREE_TEXT',
  payload: {
    freeText,
  },
});

export const selectPathology = (pathology: number): Action => ({
  type: 'SELECT_PATHOLOGY',
  payload: {
    pathology,
  },
});

export const selectCodingSystemPathology = (
  pathology: ?MultiCodingV2Pathology
): Action => ({
  type: 'SELECT_CODING_SYSTEM_PATHOLOGY',
  payload: {
    pathology,
  },
});

export const selectBamicGrade = (bamicGrade: number): Action => ({
  type: 'SELECT_BAMIC_GRADE',
  payload: {
    bamicGrade,
  },
});

export const selectBamicSite = (bamicSite: number): Action => ({
  type: 'SELECT_BAMIC_SITE',
  payload: {
    bamicSite,
  },
});

export const updateIsBamic = (isBamic: boolean): Action => ({
  type: 'UPDATE_IS_BAMIC',
  payload: {
    isBamic,
  },
});
export const updateAttachedConcussionAssessments = (
  assessmentIds: Array<number>
): Action => ({
  type: 'UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS',
  payload: {
    assessmentIds,
  },
});
export const selectPositionWhenInjured = (
  positionWhenInjured: number
): Action => ({
  type: 'SELECT_POSITION_WHEN_INJURED',
  payload: {
    positionWhenInjured,
  },
});
export const selectPreviousIssue = (
  issueId: number,
  previousIssueId: number
): Action => ({
  type: 'SELECT_PREVIOUS_ISSUE',
  payload: { issueId, previousIssueId },
});
export const selectContinuationIssue = (
  issue: IssueOccurrenceRequested
): Action => ({
  type: 'SELECT_CONTINUATION_ISSUE',
  payload: { issue },
});
export const selectSessionCompleted = (sessionCompleted: string): Action => ({
  type: 'SELECT_SESSION_COMPLETED',
  payload: {
    sessionCompleted,
  },
});
export const selectRelatedChronicIssues = (
  issueIds: Array<string>
): Action => ({
  type: 'SELECT_RELATED_CHRONIC_ISSUES',
  payload: {
    issueIds,
  },
});
export const selectSide = (
  codingSystem: CodingSystemKey,
  side: string
): Action => ({
  type: 'SELECT_SIDE',
  payload: {
    codingSystem,
    side,
  },
});
export const selectSquad = (squadId: string): Action => ({
  type: 'SELECT_SQUAD',
  payload: {
    squadId,
  },
});
export const selectTimeOfInjury = (injuryTime: string): Action => ({
  type: 'SELECT_TIME_OF_INJURY',
  payload: {
    injuryTime,
  },
});
export const setBamicGrades = (bamicGradesOptions: any): Action => ({
  type: 'SET_BAMIC_GRADES_OPTIONS',
  payload: {
    bamicGradesOptions,
  },
});
export const updateBodyArea = (bodyArea: number): Action => ({
  type: 'UPDATE_BODY_AREA',
  payload: {
    bodyArea,
  },
});
export const updateClassification = (classification: number): Action => ({
  type: 'UPDATE_CLASSIFICATION',
  payload: {
    classification,
  },
});
export const updateGroups = (groups: ?Array<string>): Action => ({
  type: 'UPDATE_GROUPS',
  payload: {
    groups,
  },
});
export const updateEvents = (events: GameAndTrainingOptions) => ({
  type: 'UPDATE_EVENTS',
  payload: events,
});
export const updateIcdCode = (icdCode: number): Action => ({
  type: 'UPDATE_ICD_CODE',
  payload: {
    icdCode,
  },
});
export const updateInitialNote = (note: string): Action => ({
  type: 'UPDATE_INITIAL_NOTE',
  payload: {
    note,
  },
});
export const updateAnnotationContent = (
  index: number,
  content: string
): Action => ({
  type: 'UPDATE_ANNOTATION_CONTENT',
  payload: {
    index,
    content,
  },
});

export const updateAnnotationVisibility = (
  index: number,
  visibility: string
): Action => ({
  type: 'UPDATE_ANNOTATION_VISIBILITY',
  payload: {
    index,
    visibility,
  },
});
export const updateAnnotationAttachmentAttributes = (
  index: number,
  files: Array<AnnotationAttachement>
): Action => ({
  type: 'UPDATE_ANNOTATION_ATTACHMENTS_ATTRIBUTES',
  payload: {
    index,
    files,
  },
});
export const updateAnnotationFilesQueue = (
  index: number,
  files: Array<AnnotationAttachement>
): Action => ({
  type: 'UPDATE_ANNOTATION_FILES_QUEUE',
  payload: {
    index,
    files,
  },
});
export const updateOsicsCode = (osicsCode: number): Action => ({
  type: 'UPDATE_OSICS_CODE',
  payload: {
    osicsCode,
  },
});
export const updateStatusDate = (index: number, date: string): Action => ({
  type: 'UPDATE_STATUS_DATE',
  payload: {
    index,
    date,
  },
});
export const updateStatusType = (index: number, status: string): Action => ({
  type: 'UPDATE_STATUS_TYPE',
  payload: {
    index,
    status,
  },
});

export const updateConditionalFieldsAnswers = (
  answers: Array<ConditionalFieldAnswerV1> | Array<ConditionalFieldAnswerV2>
) => ({
  type: 'UPDATE_CONDITIONAL_FIELDS_ANSWERS',
  payload: { answers },
});

export const setIssueTitle = (title: string) => ({
  type: 'SET_ISSUE_TITLE',
  payload: {
    title,
  },
});

export const setLinkedIssues = (
  ids: Array<number>,
  type: IssueType
): Action => ({
  type: 'SET_LINKED_ISSUES',
  payload: {
    ids,
    type,
  },
});

export const updateIssueLinks = (linkArray: IssueLink[]): Action => ({
  type: 'UPDATE_ISSUE_LINKS',
  payload: linkArray,
});

export const updateIssueFiles = (files: UnuploadedFile[]): Action => ({
  type: 'UPDATE_ISSUE_FILES',
  payload: files,
});

export const setChronicIssue = (issue: ChronicIssue): Action => ({
  type: 'SET_CHRONIC_ISSUE',
  payload: issue,
});

export const setChronicConditionOnsetDate = (date: string): Action => ({
  type: 'SET_CHRONIC_CONDITION_ONSET_DATE',
  payload: {
    date,
  },
});

export const addSecondaryPathology = (
  secondaryPathology: SecondaryPathology
): Action => ({
  type: 'ADD_SECONDARY_PATHOLOGY',
  payload: { secondaryPathology },
});

export const editSecondaryPathology = (
  secondaryPathology: SecondaryPathology,
  index: number
): Action => ({
  type: 'EDIT_SECONDARY_PATHOLOGY',
  payload: { secondaryPathology, index },
});

export const removeSecondaryPathology = (index: number): Action => ({
  type: 'REMOVE_SECONDARY_PATHOLOGY',
  payload: {
    index,
  },
});

/* ------------ grid ACTIONS ------------ */

export const setGridPagination = (
  updatedPaginationId: number | null
): Action => ({
  type: 'SET_GRID_PAGINATION',
  payload: {
    currentId: updatedPaginationId,
  },
});

export const resetGridPagination = (): Action => ({
  type: 'RESET_GRID_PAGINATION',
});

export const fetchGridSuccess = (grid: GridData, reset: boolean): Action => ({
  type: 'FETCH_GRID_SUCCESS',
  payload: {
    grid,
    reset,
  },
});

export const fetchCommentsGridSuccess = (
  grid: GridData,
  reset: boolean
): Action => ({
  type: 'FETCH_COMMENTS_GRID_SUCCESS',
  payload: {
    grid,
    reset,
  },
});

export const updateComment = (comment: string, rowId: number): Action => ({
  type: 'UPDATE_COMMENT',
  payload: {
    comment,
    rowId,
  },
});

export const resetCommentsGridGrid = (): Action => ({
  type: 'RESET_COMMENTS_GRID',
});

export const resetGrid = (): Action => ({
  type: 'RESET_GRID',
});

/* ------------ filters ACTIONS ------------ */
export const updateFilters = (filters: RosterFilters): Action => ({
  type: 'UPDATE_FILTERS',
  payload: {
    filters,
  },
});

export const updateCoachesReportFilters = (filters: RosterFilters): Action => ({
  type: 'UPDATE_COACHES_REPORT_FILTERS',
  payload: {
    filters,
  },
});

/* ------------ THUNK ACTIONS ------------ */

export const setConditionalFieldsRequestStatus = (
  requestStatus: string
): Action => ({
  type: 'SET_CONDITIONAL_FIELDS_REQUEST_STATUS',
  payload: {
    requestStatus,
  },
});

export const setConditionalFieldsQuestions = (
  questions: Array<QuestionType>
): Action => ({
  type: 'SET_CONDITIONAL_FIELDS_QUESTIONS',
  payload: {
    questions,
  },
});

export const fetchConditionalFields =
  (conditions: Object): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    if (window.featureFlags['conditional-fields-v1-stop']) return;

    dispatch(setConditionalFieldsRequestStatus('PENDING'));
    getConditionalFields(conditions)
      .then((data) => {
        dispatch(setConditionalFieldsQuestions(data.questions));
        dispatch(setConditionalFieldsRequestStatus('SUCCESS'));
      })
      .catch(() => dispatch(setConditionalFieldsRequestStatus('FAILURE')));
  };

let activeRosterGridRequest = null;
export const fetchRosterGrid =
  (reset: boolean): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (reset) {
      dispatch(resetGrid());
    }
    if (activeRosterGridRequest) {
      dispatch(resetGrid());
      activeRosterGridRequest.abort();
    }
    dispatch(requestPending());
    activeRosterGridRequest = $.ajax({
      method: 'POST',
      url: '/medical/rosters/fetch',
      contentType: 'application/json',
      data: JSON.stringify({
        next_id: getState().grid?.next_id || null,
        filters: getState().filters,
      }),
    })
      .done((grid) => {
        dispatch(fetchGridSuccess(grid, reset));
        dispatch(requestSuccess());
      })
      .fail(() => {
        dispatch(requestFailure());
      })
      .always(() => {
        activeRosterGridRequest = null;
      });
  };

const activeCoachesReportGridRequest = null;
export const fetchCoachesReportGrid =
  (reset: boolean, nextId: ?number, currentDate: string): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (reset) {
      dispatch(resetCommentsGridGrid());
    }
    if (activeCoachesReportGridRequest) {
      activeCoachesReportGridRequest.abort();
    }
    dispatch(setCommentsGridRequestStatus('PENDING'));
    getCoachesReportData({
      next_id: nextId,
      ...(window.featureFlags['coaches-report-v2'] && currentDate
        ? {
            filters: {
              ...getState().commentsFilters,
              report_date: currentDate,
            },
          }
        : { filters: getState().commentsFilters }),
    }).then(
      (data) => {
        dispatch(fetchCommentsGridSuccess(data, reset));
        dispatch(requestCommentsGridSuccess());
      },
      () => {
        dispatch(requestCommentsGridFailure());
      }
    );
  };

export const fetchIssueDetails =
  (pathologyId: number) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    $.ajax({
      method: 'GET',
      url: `/athletes/${
        getState().addIssuePanel.initialInfo.athlete
      }/issues/osics_info/?id=${pathologyId}`,
      data: { scope_to_org: true },
    }).done((osicsData) => {
      dispatch(updateClassification(osicsData.osics_classification_id));
      dispatch(updateGroups(osicsData.groups));
      dispatch(updateBodyArea(osicsData.osics_body_area_id));
      dispatch(updateOsicsCode(osicsData.id));
      dispatch(updateIcdCode(osicsData.icd));
      dispatch(updateIsBamic(osicsData?.bamic || false));
    });
  };

export const fetchBAMICGrades = () => (dispatch: (action: Action) => void) => {
  $.ajax({
    method: 'GET',
    url: '/ui/medical/bamic_grades',
  }).done((bamicGradesOptions) => {
    dispatch(setBamicGrades(bamicGradesOptions));
  });
};

export const fetchGameAndTrainingOptions =
  (detailedView: boolean, strictDateMatch: boolean) =>
  (dispatch: (action: Action) => void, getState: Function) => {
    const athlete = getState().addIssuePanel.initialInfo.athlete;
    const date = getState().addIssuePanel.initialInfo.diagnosisDate;
    if (!athlete || !date) {
      return;
    }
    $.ajax({
      type: 'GET',
      url: `/athletes/${athlete}/injuries/game_and_training_options`,
      data: {
        date,
        scope_to_org: true,
        detailed_view: detailedView,
        strict_date_match: strictDateMatch,
      },
    }).done((events: GameAndTrainingOptions) => {
      dispatch(updateEvents(events));
    });
  };

export const createFreetextComponentData = ({
  onsetFreetext = null,
  injuryMechanismFreetext = null,
  presentationFreeText = null,
  primaryMechanismFreetext = null,
  issueContactFreetext = null,
}: {
  onsetFreetext?: ?string,
  injuryMechanismFreetext?: ?string,
  presentationFreeText?: ?string,
  primaryMechanismFreetext?: ?string,
  issueContactFreetext?: ?string,
}): Array<FreeTextComponent> => {
  const freetextArray = [];
  if (onsetFreetext)
    freetextArray.push({
      name: 'issue_occurrence_onsets',
      value: onsetFreetext,
    });
  if (injuryMechanismFreetext)
    freetextArray.push({
      name: 'injury_mechanisms',
      value: injuryMechanismFreetext,
    });
  if (presentationFreeText)
    freetextArray.push({
      name: 'presentation_types',
      value: presentationFreeText,
    });
  if (primaryMechanismFreetext)
    freetextArray.push({
      name: 'primary_mechanisms',
      value: primaryMechanismFreetext,
    });
  if (issueContactFreetext)
    freetextArray.push({
      name: 'issue_contact_types',
      value: issueContactFreetext,
    });
  return freetextArray;
};

export const createChronicIssue =
  (codingSystemId: number, codingSystemKey: string) =>
  (dispatch: (action: Action | ToastAction) => void, getState: Function) => {
    dispatch(createIssuePending());
    const panelState = getState().addIssuePanel;
    const relatedChronicIssues =
      panelState.diagnosisInfo.relatedChronicIssues || [];
    let chronicOccurrences = relatedChronicIssues.map((issue) => {
      const [type, id] = issue.split('_');
      return {
        id,
        issue_type: type.toLowerCase(),
      };
    });

    // NFL Change - 'Chronic Injury/Illness' use created issue id to be passed in.
    let occurrenceDate = panelState.initialInfo.diagnosisDate;
    if (!chronicOccurrences.length && panelState?.issueCreateResponse?.id) {
      chronicOccurrences = [
        {
          id: panelState.issueCreateResponse.id,
          issue_type: 'injury',
        },
      ];
      occurrenceDate = panelState.initialInfo.chronicConditionOnsetDate;
    }

    let additionalFields = {};
    let sideId = null;

    if (isV2MultiCodingSystem(codingSystemKey)) {
      const pathologyData =
        Array.isArray(panelState.diagnosisInfo.coding?.pathologies) &&
        panelState.diagnosisInfo.coding.pathologies.length > 0
          ? panelState.diagnosisInfo.coding.pathologies[0]
          : null;

      if (pathologyData) {
        additionalFields = {
          pathology_id: pathologyData.id,
        };
        sideId = pathologyData.coding_system_side_id;
      }
    } else {
      if (codingSystemKey === 'osics_10') {
        additionalFields = {
          pathology_id: panelState.diagnosisInfo.coding.osics_10.osics_id,
        };
      } else {
        additionalFields = {
          pathology_id: panelState.diagnosisInfo.coding[codingSystemKey]?.id,
        };
      }
      sideId = panelState.diagnosisInfo.coding[codingSystemKey]?.side_id;
    }

    if (
      window.featureFlags['nfl-injury-flow-fields'] &&
      codingSystemKey === 'clinical_impressions' &&
      panelState.diagnosisInfo.onsetDescription
    ) {
      additionalFields = {
        ...additionalFields,
        onset_description: panelState.diagnosisInfo.onsetDescription,
      };
    }

    if (window.featureFlags['nfl-injury-flow-fields']) {
      const freetextArr = createFreetextComponentData({
        onsetFreetext: panelState.diagnosisInfo.onsetFreeText,
      });
      if (freetextArr.length) {
        additionalFields = {
          ...additionalFields,
          freetext_components: freetextArr,
        };
      }
    }

    // this is a one off usecase, for creating a Chronic Issue while creating an Injury
    // since we need the eventInfo.event to be tied to the training_session_id for creation of the Injury
    const findEventId = () =>
      panelState.eventInfo.events.sessions.find(
        (option) => option.value === parseInt(panelState.eventInfo.event, 10)
      )?.event_id || null;

    if (panelState.eventInfo.event && panelState.eventInfo.event !== 'other') {
      additionalFields = {
        ...additionalFields,
        event_id: findEventId() || panelState.eventInfo.event,
      };
    }

    const eventInfo = {
      activity_id: panelState.eventInfo.activity,
      activity_type: panelState.eventInfo.eventType,
      game_id:
        panelState.eventInfo.event === 'unlisted' ||
        panelState.eventInfo.event === 'other' ||
        panelState.eventInfo.eventType === 'training'
          ? ''
          : panelState.eventInfo.event,
      position_when_injured_id: panelState.eventInfo.positionWhenInjured,
      session_completed: panelState.eventInfo.sessionCompleted === 'YES',
      training_session_id:
        panelState.eventInfo.event === 'unlisted' ||
        panelState.eventInfo.event === 'other' ||
        panelState.eventInfo.eventType === 'game'
          ? ''
          : panelState.eventInfo.event,
      athlete_id: panelState.initialInfo.athlete,
      presentation_type_id: panelState.eventInfo.presentationTypeId,
    };

    let dataToSend = {
      ...additionalFields,
      coding_system_id: codingSystemId,
      side_id: sideId,
      reported_date: panelState.initialInfo.reportedDate,
      examination_date: panelState.diagnosisInfo.examinationDate,
      onset_type_id: panelState.diagnosisInfo.onset,
      title: panelState.title,
      chronic_occurrences: chronicOccurrences,
      occurrence_date: occurrenceDate,
      annotations: [
        {
          annotationable_type: 'Athlete',
          annotationable_id: panelState.initialInfo.athlete,
          organisation_annotation_type_id: null,
          title: 'Initial Note',
          annotation_date: moment().format(dateTransferFormat),
          content:
            panelState.initialInfo.initialNote === emptyHTMLeditorContent
              ? ''
              : panelState.initialInfo.initialNote,
          illness_occurrence_ids: [],
          injury_occurrence_ids: [],
          restricted_to_doc: false,
          restricted_to_psych: false,
          attachments_attributes: [],
          annotation_actions_attributes: [],
        },
        ...panelState.additionalInfo.annotations.map(
          (annotation) => annotation.attachmentContent
        ),
      ],
    };

    if (
      panelState.initialInfo.chronicConditionOnsetDate ===
      panelState.initialInfo.diagnosisDate
    ) {
      dataToSend = {
        ...dataToSend,
        ...eventInfo,
      };
    }

    const toastId: number = panelState.initialInfo.athlete;
    const loadingToastOption = {
      title: i18n.t('Creating chronic condition...'),
      status: 'LOADING',
      id: toastId,
    };
    const successToastOption = {
      title: i18n.t('Chronic condition created successfully'),
      status: 'SUCCESS',
    };
    const errorToastOption = {
      title: i18n.t('Chronic condition not created'),
      description: i18n.t(
        'There was an error while creating chronic condition'
      ),
      links: [
        {
          id: toastId,
          text: i18n.t('Try again'),
          link: '#',
          withHashParam: true,
          metadata: {
            action: 'REMOVE_TOAST_AND_OPEN_CHRONIC_CONDITION_ISSUE_PANEL',
            panelState: getState().addIssuePanel,
          },
        },
      ],
      status: 'ERROR',
    };

    dispatch(addToast(loadingToastOption));
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: `/athletes/${panelState.initialInfo.athlete}/chronic_issues`,
      data: JSON.stringify(dataToSend),
      success: (response) => {
        let viewDetailLink = '';
        if (
          window.location.pathname.includes(
            `athletes/${panelState.initialInfo.athlete}`
          )
        ) {
          viewDetailLink = `${panelState.initialInfo.athlete}/chronic_issues/${response.id}`;
        } else {
          viewDetailLink = `athletes/${panelState.initialInfo.athlete}/chronic_issues/${response.id}`;
        }
        const successLinks = [
          {
            id: toastId,
            text: i18n.t('View Details'),
            withHashParam: true,
            link: viewDetailLink,
          },
        ];
        dispatch(
          updateToast(toastId, { ...successToastOption, links: successLinks })
        );
        dispatch(createIssueSuccess({}));
        dispatch(closeAddIssuePanel());
        // $FlowFixMe
        dispatch(fetchRosterGrid(true));
      },
      error: () => {
        dispatch(closeAddIssuePanel());
        dispatch(updateToast(toastId, errorToastOption));
      },
    });
  };

export const createIssue =
  (trackEvent: (issueType: string) => void) =>
  (dispatch: (action: Action | ToastAction) => void, getState: Function) => {
    dispatch(createIssuePending());

    const panelState = getState().addIssuePanel;
    const untransformedFiles = panelState.additionalInfo.annotations
      .map((annotation) => annotation.attachmentContent.attachments)
      .flat();
    const issueType = panelState.initialInfo.type;
    const baseUrl = `/athletes/${panelState.initialInfo.athlete}`;
    const events = panelState.diagnosisInfo.statuses
      .map(({ status, date }) => {
        return {
          id: '',
          injury_status_id: status,
          date,
        };
      })
      .filter((event) => event.injury_status_id !== '');

    let additionalDataFields = {};

    const pathology = panelState.diagnosisInfo.coding?.pathologies?.[0];

    if (pathology?.id) {
      panelState.diagnosisInfo.coding.pathologies = [
        {
          id: pathology.id,
          coding_system_side_id:
            pathology.coding_system_side_id ??
            pathology.coding_system_side?.coding_system_side_id,
        },
      ];
    }

    if (window.featureFlags['emr-multiple-coding-systems']) {
      const coding = _cloneDeep(panelState.diagnosisInfo.coding);

      if (window.featureFlags['multi-part-injury-ci-code']) {
        // Secondary pathologies are only available for CI coding system
        const secondaryPathologies =
          panelState.diagnosisInfo.secondary_pathologies || [];

        // This can be undefined in the case of preliminary injuries
        if (!coding.clinical_impressions) {
          coding.clinical_impressions = {};
        }

        coding.clinical_impressions.secondary_pathologies =
          secondaryPathologies.map(({ record, side }) => ({
            record: record?.value,
            side: {
              id: side,
            },
          }));
      }

      additionalDataFields = {
        ...additionalDataFields,
        coding: {
          ...coding,
        },
      };
    } else {
      additionalDataFields = {
        ...additionalDataFields,
        osics: panelState.diagnosisInfo.coding[codingSystemKeys.OSICS_10],
        side_id: panelState.diagnosisInfo.side,
      };
    }

    if (
      window.featureFlags['injury-onset-time-selector'] &&
      panelState.eventInfo.timeOfInjury
    ) {
      additionalDataFields = {
        ...additionalDataFields,
        occurrence_date: `${panelState.initialInfo.diagnosisDate}${`T${
          panelState.eventInfo.timeOfInjury.split('T')[1]
        }`}`,
        occurrence_min: null,
      };
    } else {
      additionalDataFields = {
        ...additionalDataFields,
        occurrence_date: panelState.initialInfo.diagnosisDate,
        occurrence_min: panelState.eventInfo.timeOfInjury,
      };
    }

    if (window.featureFlags['nfl-injury-flow-fields']) {
      const freetextArr = createFreetextComponentData({
        onsetFreetext: panelState.diagnosisInfo.onsetFreeText,
        injuryMechanismFreetext: panelState.eventInfo.injuryMechanismFreetext,
        presentationFreeText: panelState.eventInfo.presentationTypeFreeText,
        primaryMechanismFreetext: panelState.eventInfo.primaryMechanismFreetext,
        issueContactFreetext: panelState.eventInfo.issueContactFreetext,
      });
      if (freetextArr.length)
        additionalDataFields = {
          ...additionalDataFields,
          issue_contact_type_id: panelState.eventInfo.issueContactType,
          injury_mechanism_id: panelState.eventInfo.injuryMechanismId,
          freetext_components: freetextArr,
        };
      else
        additionalDataFields = {
          ...additionalDataFields,
          issue_contact_type_id: panelState.eventInfo.issueContactType,
          injury_mechanism_id: panelState.eventInfo.injuryMechanismId,
        };

      if (panelState.diagnosisInfo.onsetDescription) {
        additionalDataFields = {
          ...additionalDataFields,
          onset_description: panelState.diagnosisInfo.onsetDescription,
        };
      }

      if (panelState.eventInfo.mechanismDescription) {
        additionalDataFields = {
          ...additionalDataFields,
          mechanism_description: panelState.eventInfo.mechanismDescription,
        };
      }
    }

    let linkedChronicIssue = [];
    const isNoPriorChronicRecorded =
      panelState.initialInfo.linkedChronicIssue === 'NoPriorChronicRecorded';
    if (
      panelState.initialInfo.linkedChronicIssue &&
      !isNoPriorChronicRecorded
    ) {
      linkedChronicIssue = [
        {
          id: panelState.initialInfo.linkedChronicIssue,
        },
      ];
    }

    if (window.featureFlags['supplemental-recurrence-code']) {
      additionalDataFields = {
        ...additionalDataFields,
        supplementary_coding:
          panelState.diagnosisInfo.supplementaryCoding?.clinical_impressions
            ?.pathology,
      };
    }

    const isNotGameEvent =
      panelState.eventInfo.event === 'unlisted' ||
      panelState.eventInfo.event === 'other' ||
      panelState.eventInfo.eventType === 'training';

    const isNotTrainingSession =
      panelState.eventInfo.event === 'unlisted' ||
      panelState.eventInfo.event === 'other' ||
      panelState.eventInfo.eventType === 'game';

    const otherEventId = panelState.eventInfo?.events?.otherEventOptions?.find(
      (otherEvent) => otherEvent.shortname === panelState.eventInfo.eventType
    )?.id;

    const isContinuation =
      panelState?.initialInfo?.type === 'INJURY_CONTINUATION';

    const isNFLInjuryFlowFields = window.featureFlags['nfl-injury-flow-fields'];

    const shouldPersistOtherEventId =
      isContinuation &&
      !isNFLInjuryFlowFields &&
      window.featureFlags['medical-additional-event-info-events'];

    const data = {
      ...additionalDataFields,
      issue_occurrence_title: panelState.title,
      activity_id: panelState.eventInfo.activity,
      activity_type: panelState.eventInfo.eventType,
      association_period_id: null,
      athlete_id: panelState.initialInfo.athlete,
      closed: false,
      created_by: '',
      events,
      examination_date: panelState.diagnosisInfo.examinationDate,
      reported_date: panelState.initialInfo.reportedDate,
      game_id: isNotGameEvent ? '' : panelState.eventInfo.event,
      has_recurrence: !!panelState.initialInfo.previousIssueId,
      recurrence_id: panelState.initialInfo.recurrenceOutsideSystem
        ? null
        : panelState.initialInfo.previousIssueId,
      continuation_issue_id: panelState.initialInfo.continuationIssueId ?? null,
      continuation_outside_system:
        issueType.includes('CONTINUATION') &&
        panelState.initialInfo.issueId === -1,
      has_supplementary_pathology:
        panelState.diagnosisInfo.supplementalPathology !== null,
      id: null,
      modification_info: null,
      annotations: [
        {
          annotationable_type: 'Athlete',
          annotationable_id: panelState.initialInfo.athlete,
          organisation_annotation_type_id: null,
          title: 'Initial Note',
          annotation_date: moment().format(dateTransferFormat),
          content:
            panelState.initialInfo.initialNote === emptyHTMLeditorContent
              ? ''
              : panelState.initialInfo.initialNote,
          illness_occurrence_ids: [],
          injury_occurrence_ids: [],
          restricted_to_doc: false,
          restricted_to_psych: false,
          attachments_attributes: [],
          annotation_actions_attributes: [],
        },
        ...panelState.additionalInfo.annotations.map(
          (annotation) => annotation.attachmentContent
        ),
      ],
      position_when_injured_id: panelState.eventInfo.positionWhenInjured,
      prior_resolved_date: null,
      session_completed: panelState.eventInfo.sessionCompleted === 'YES',
      supplementary_pathology:
        panelState.diagnosisInfo.supplementalPathology || '',
      total_duration: null,
      training_session_id: isNotTrainingSession
        ? ''
        : panelState.eventInfo.event,
      type_id: panelState.diagnosisInfo.onset,
      concussion_assessments: panelState.diagnosisInfo.concussion_assessments,
      unavailability_duration: null,
      conditional_fields_answers: window.featureFlags[
        'conditional-fields-showing-in-ip'
      ]
        ? panelState.additionalInfo.conditionalFieldsAnswers
        : [],
      screening_answers:
        window.featureFlags['conditional-fields-showing-in-ip'] &&
        window.featureFlags['conditional-fields-v1-stop']
          ? panelState.additionalInfo.conditionalFieldsAnswers.map(
              // eslint-disable-next-line camelcase
              ({ question_id, screening_ruleset_version_id, value }) => ({
                question_id,
                screening_ruleset_version_id,
                values: value, // 'values' needed in BE but 'value' used directly in Select, Textarea, DatePicker
              })
            )
          : [],
      bamic_site_id: panelState.diagnosisInfo.bamicSite,
      bamic_grade_id: panelState.diagnosisInfo.bamicGrade,
      presentation_type_id: panelState.eventInfo.presentationTypeId,
      recurrence_outside_system: panelState.initialInfo.recurrenceOutsideSystem,
      linked_issues: panelState.additionalInfo.linkedIssues,
      attached_links: panelState.additionalInfo.issueLinks,
      // NFL Change - Multi select was updated to a single select but API expects an array.
      linked_chronic_issues: linkedChronicIssue,
      squad_id: panelState.initialInfo.squadId,
      // $FlowFixMe - state is ready at this stage
      ...(shouldPersistOtherEventId && {
        other_event_id: otherEventId,
      }),
    };

    const newData = Object.assign({}, data);

    if (window.featureFlags['conditional-fields-v1-stop']) {
      delete newData.conditional_fields_answers;
    } else {
      delete newData.screening_answers;
    }

    if (issueType === 'ILLNESS') {
      delete newData.activity_id;
      delete newData.activity_type;
      delete newData.occurrence_min;
      delete newData.session_completed;
      delete newData.position_when_injured_id;
      delete newData.bamic_grade_id;
      delete newData.bamic_site_id;

      // In order to prevent conflict with the already existing Illness types on the backend
      // We need to rename type_id to onset_id when the issue is an illness.
      newData.onset_id = data.type_id;
    }
    if (issueIsAnInjury(issueType)) {
      newData.issue_occurrence_onset_id = newData.type_id;
      delete newData.type_id;
    }

    newData.scope_to_org = true;

    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: issueIsAnInjury(issueType)
        ? `${baseUrl}/injuries`
        : `${baseUrl}/illnesses`,
      data: JSON.stringify(newData),
      success: (res) => {
        const annotationsWithAttachments = res.annotations.filter(
          (annotation) => annotation.attachments.length > 0
        );

        const attachments = annotationsWithAttachments.map(
          (annotation) => annotation.attachments
        );

        const unConfirmedFiles = attachments
          .map((attachmentArray) =>
            attachmentArray.filter((file) => file.confirmed === false)
          )
          .flat();

        unConfirmedFiles.forEach((unConfirmedFile, index) => {
          convertUrlToFile(
            untransformedFiles[index].file,
            untransformedFiles[index].filename,
            untransformedFiles[index].filetype
          ).then((unTransformedFile) => {
            if (!unTransformedFile) {
              return;
            }
            const fileName = unTransformedFile.name;
            const fileSize = fileSizeLabel(unTransformedFile.size, true);
            const fileId = unConfirmedFile.id;
            const presignedPost = unConfirmedFile.presigned_post;

            dispatch(
              addToast({
                title: fileName,
                description: fileSize,
                status: 'LOADING',
                id: fileId,
              })
            );

            uploadFile(unTransformedFile, fileId, presignedPost)
              .then(() => {
                dispatch(updateToast(fileId, { status: 'SUCCESS' }));

                // eslint-disable-next-line max-nested-callbacks
                setTimeout(() => dispatch(removeToast(fileId)), 5000);
              })
              .catch(() => {
                dispatch(updateToast(fileId, { status: 'ERROR' }));
              });
          });
        });
        dispatch(createIssueSuccess(res));
        trackEvent(issueType);
        if (!isNoPriorChronicRecorded) {
          dispatch(closeAddIssuePanel());
          // $FlowFixMe
          dispatch(fetchRosterGrid(true));
        }
      },
      error: () => {
        dispatch(createIssueFailure());
      },
    });
  };

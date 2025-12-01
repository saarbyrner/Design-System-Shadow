import moment from 'moment-timezone';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import addIssuePanelReducer from '@kitman/modules/src/Medical/rosters/src/redux/reducers/addIssuePanel';
import { mockedIssue } from '@kitman/modules/src/Medical/shared/services/getAthleteIssue';

describe('addIssuePanel reducer', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    const octoberFifteenth = new Date('2020-10-15T00:00:00Z'); // UTC format for consistency
    jest.useFakeTimers();
    jest.setSystemTime(octoberFifteenth);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    moment.tz.setDefault();
  });

  const getInitialState = () => ({
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
      type: null,
      athlete: null,
      athleteData: null,
      previousIssue: null,
      diagnosisDate: moment().format('YYYY-MM-DD'),
      reportedDate: moment().format(dateTransferFormat),
      initialNote: '',
      squadId: null,
      recurrenceOutsideSystem: false,
      linkedChronicIssue: null,
      chronicConditionOnsetDate: null,
    },
    diagnosisInfo: {
      supplementalPathology: null,
      examinationDate: null,
      onset: null,
      onsetDescription: null,
      side: null,
      statuses: [{ status: '', date: moment().format('YYYY-MM-DD') }],
      concussion_assessments: [],
      isBamic: false,
      bamicGrade: null,
      bamicSite: null,
      coding: {},
      secondary_pathologies: [],
      supplementaryCoding: {},
    },
    eventInfo: {
      diagnosisDate: moment().format('YYYY-MM-DD'),
      event: null,
      eventType: null,
      events: {
        games: [],
        sessions: [],
      },
      activity: null,
      positionWhenInjured: null,
      sessionCompleted: null,
      timeOfInjury: null,
      presentationType: null,
      issueContactType: null,
      issueContactFreetext: '',
      injuryMechanismId: null,
      mechanismDescription: null,
    },
    additionalInfo: {
      annotations: [],
      conditionalFieldsAnswers: [],
      questions: [],
      requestStatus: null,
      linkedIssues: {
        injuries: [],
        illnesses: [],
      },
      issueLinks: [],
      issueFiles: [],
    },
    title: '',
    bamicGradesOptions: [],
    page: 1,
    requestStatus: null,
    pathologyGroupRequestStatus: null,
  });

  test('returns correct state on OPEN_ADD_ISSUE_PANEL', () => {
    const action = {
      type: 'OPEN_ADD_ISSUE_PANEL',
      payload: {
        athleteId: 1234,
        squadId: 8,
        positionId: 13,
        isAthleteSelectable: true,
        athleteData: {},
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      isOpen: true,
      shouldRestoreData: false,
      initialInfo: {
        type: 'INJURY',
        athlete: 1234,
        previousIssue: null,
        diagnosisDate: moment().format('YYYY-MM-DD'),
        reportedDate: moment().format(dateTransferFormat),
        initialNote: '',
        squadId: 8,
        isAthleteSelectable: true,
        recurrenceOutsideSystem: false,
        athleteData: {},
        chronicConditionOnsetDate: null,
        linkedChronicIssue: null,
      },
      eventInfo: {
        diagnosisDate: moment().format('YYYY-MM-DD'),
        event: null,
        eventType: null,
        events: {
          games: [],
          sessions: [],
        },
        activity: null,
        positionWhenInjured: 13,
        sessionCompleted: null,
        timeOfInjury: null,
        presentationType: null,
        issueContactType: null,
        issueContactFreetext: '',
        injuryMechanismId: null,
        mechanismDescription: null,
      },
    });
  });

  test('returns correct state on OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE', () => {
    const action = {
      type: 'OPEN_ADD_ISSUE_PANEL_PREVIOUS_STATE',
      payload: {
        previousPanelState: {
          isOpen: true,
          shouldRestoreData: true,
          requestStatus: null,
          pathologyGroupRequestStatus: null,
          page: 1,
        },
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      isOpen: true,
      shouldRestoreData: true,
      requestStatus: null,
      pathologyGroupRequestStatus: null,
      page: 1,
    });
  });

  test('returns correct state on CLOSE_ADD_ISSUE_PANEL', () => {
    const state = {
      ...getInitialState(),
      isOpen: true,
      shouldRestoreData: false,
      title: 'Issue title',
      initialInfo: {
        type: 'ILLNESS',
        athlete: 12456,
        previousIssue: 43,
        diagnosisDate: '2021-11-06',
        initialNote: 'Test',
      },
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        examinationDate: '2021-11-06',
      },
      additionalInfo: {
        ...getInitialState().additionalInfo,
        linkedIssues: {
          injuries: [123],
          illnesses: [234],
        },
      },
    };

    const action = {
      type: 'CLOSE_ADD_ISSUE_PANEL',
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      isOpen: false,
      shouldRestoreData: false,
      title: '',
      initialInfo: {
        type: null,
        athlete: null,
        athleteData: null,
        diagnosisDate: null,
        reportedDate: null,
        initialNote: '',
        issueId: null,
        previousIssueId: null,
        continuationIssueId: null,
        squadId: null,
        previousIssue: null,
        recurrenceOutsideSystem: false,
        chronicConditionOnsetDate: null,
        linkedChronicIssue: null,
      },
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        examinationDate: null,
      },
      additionalInfo: {
        ...getInitialState().additionalInfo,
        linkedIssues: {
          injuries: [],
          illnesses: [],
        },
      },
    });
  });

  test('returns correct state on ADD_ADDITIONAL_ANNOTATION', () => {
    const state = {
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        type: 'INJURY',
        athlete: 1162,
      },
    };

    const action = {
      type: 'ADD_ADDITIONAL_ANNOTATION',
      payload: {
        attachmentType: 'NOTE',
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        type: 'INJURY',
        athlete: 1162,
      },
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(dateTransferFormat),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              attachments: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
              filesQueue: [],
            },
          },
        ],
      },
    });
  });

  test('returns correct state on SET_CONDITIONAL_FIELDS_REQUEST_STATUS', () => {
    const action = {
      type: 'SET_CONDITIONAL_FIELDS_REQUEST_STATUS',
      payload: {
        requestStatus: 'PENDING',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        requestStatus: 'PENDING',
      },
    });
  });

  test('returns correct state on SET_CONDITIONAL_FIELDS_QUESTIONS', () => {
    const action = {
      type: 'SET_CONDITIONAL_FIELDS_QUESTIONS',
      payload: {
        questions: ['some', 'question', 'objects'],
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        questions: ['some', 'question', 'objects'],
      },
    });
  });

  test('returns correct state on ADD_STATUS', () => {
    const action = {
      type: 'ADD_STATUS',
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: '', date: moment().format('YYYY-MM-DD') },
          { status: '', date: moment().format('YYYY-MM-DD') },
        ],
      },
    });
  });

  test('returns correct state on CREATE_ISSUE_PENDING', () => {
    const action = {
      type: 'CREATE_ISSUE_PENDING',
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      requestStatus: 'loading',
    });
  });

  test('returns correct state on CREATE_ISSUE_FAILURE', () => {
    const action = {
      type: 'CREATE_ISSUE_FAILURE',
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      requestStatus: 'error',
    });
  });

  test('returns correct state on CREATE_ISSUE_SUCCESS', () => {
    const action = {
      type: 'CREATE_ISSUE_SUCCESS',
      payload: {},
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      requestStatus: 'success',
      issueCreateResponse: {},
    });
  });

  test('returns correct state on ENTER_SUPPLEMENTAL_PATHOLOGY', () => {
    const action = {
      type: 'ENTER_SUPPLEMENTAL_PATHOLOGY',
      payload: {
        supplementalPathology: 'Test supplemental pathology',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        supplementalPathology: 'Test supplemental pathology',
      },
    });
  });

  test('returns correct state on REMOVE_ADDITIONAL_ANNOTATION', () => {
    const state = {
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note 1',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note 2',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    };
    const action = {
      type: 'REMOVE_ADDITIONAL_ANNOTATION',
      payload: {
        index: 0,
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1, // Id gets changed as part of removal
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note 2',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    });
  });

  test('returns correct state on REMOVE_STATUS', () => {
    const state = {
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: 'One', date: moment().format('YYYY-MM-DD') },
          { status: 'Two', date: moment().format('YYYY-MM-DD') },
          { status: 'Three', date: moment().format('YYYY-MM-DD') },
          { status: 'Four', date: moment().format('YYYY-MM-DD') },
        ],
      },
    };
    const action = {
      type: 'REMOVE_STATUS',
      payload: {
        index: 2,
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: 'One', date: moment().format('YYYY-MM-DD') },
          { status: 'Two', date: moment().format('YYYY-MM-DD') },
          { status: 'Four', date: moment().format('YYYY-MM-DD') },
        ],
      },
    });
  });

  test('returns correct state on REMOVE_SUPPLEMENTAL_PATHOLOGY', () => {
    const state = {
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        supplementalPathology: 'Test supplemental pathology',
      },
    };
    const action = {
      type: 'REMOVE_SUPPLEMENTAL_PATHOLOGY',
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        supplementalPathology: null,
      },
    });
  });

  test('returns correct state on GO_TO_NEXT_PANEL_PAGE', () => {
    const state = {
      ...getInitialState(),
      page: 2,
    };

    const action = {
      type: 'GO_TO_NEXT_PANEL_PAGE',
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      page: 3,
    });
  });

  test('defaults the examination date on page 2', () => {
    const state = {
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        examinationDate: null,
      },
    };

    const action = {
      type: 'GO_TO_NEXT_PANEL_PAGE',
    };
    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      page: 2,
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        examinationDate: moment('2020-10-15').format(dateTransferFormat),
      },
    });
  });

  test('returns correct state on GO_TO_PREVIOUS_PANEL_PAGE', () => {
    const state = {
      ...getInitialState(),
      page: 2,
    };

    const action = {
      type: 'GO_TO_PREVIOUS_PANEL_PAGE',
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      page: 1,
    });
  });

  test('returns correct state on SELECT_ISSUE_TYPE', () => {
    const action = {
      type: 'SELECT_ISSUE_TYPE',
      payload: {
        issueType: 'INJURY',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        type: 'INJURY',
        issueId: null,
        previousIssueId: null,
        continuationIssueId: null,
        linkedChronicIssue: null,
      },
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        supplementalPathology: null,
        coding: {},
      },
      eventInfo: {
        ...getInitialState().eventInfo,
        event: null,
        eventType: null,
        activity: null,
        sessionCompleted: null,
        timeOfInjury: null,
      },
    });
  });

  test('returns correct state on SELECT_ISSUE_TYPE when additional annotations exist', () => {
    const state = {
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        type: 'INJURY',
      },
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    };

    const action = {
      type: 'SELECT_ISSUE_TYPE',
      payload: {
        issueType: 'ILLNESS',
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        type: 'ILLNESS',
        issueId: null,
        previousIssueId: null,
        continuationIssueId: null,
      },
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Illness note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Illness note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    });
  });

  test('returns correct state on SELECT_ACTIVITY', () => {
    const action = {
      type: 'SELECT_ACTIVITY',
      payload: {
        activity: 5,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        activity: 5,
      },
    });
  });

  test('returns correct state on SELECT_ACTIVITY with null activity', () => {
    const action = {
      type: 'SELECT_ACTIVITY',
      payload: {
        activity: null,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        activity: null,
      },
    });
  });

  test('returns correct state on UPDATE_PRIMARY_MECHANISM_FREE_TEXT', () => {
    const action = {
      type: 'UPDATE_PRIMARY_MECHANISM_FREE_TEXT',
      payload: {
        freeText: 'test reason',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        primaryMechanismFreetext: action.payload.freeText,
      },
    });
  });

  test('returns correct state on SELECT_ATHLETE', () => {
    const action = {
      type: 'SELECT_ATHLETE',
      payload: {
        athleteId: 1235,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        athlete: 1235,
      },
    });
  });

  test('returns correct state on SELECT_ATHLETE_DATA', () => {
    const action = {
      type: 'SELECT_ATHLETE_DATA',
      payload: {
        athleteData: { id: 1, fullname: 'John Doh' },
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        athleteData: { id: 1, fullname: 'John Doh' },
      },
    });
  });

  test('returns correct state on SELECT_BODY_AREA when the coding system is OSCIS', () => {
    const action = {
      type: 'SELECT_BODY_AREA',
      payload: {
        codingSystem: codingSystemKeys.OSICS_10,
        bodyAreaId: 1,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            osics_body_area_id: 1,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_BODY_AREA when the coding system is DATALYS', () => {
    const action = {
      type: 'SELECT_BODY_AREA',
      payload: {
        codingSystem: codingSystemKeys.DATALYS,
        bodyAreaId: 1,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.DATALYS]: {
            datalys_body_area_id: 1,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_BODY_AREA when the coding system is CI', () => {
    const action = {
      type: 'SELECT_BODY_AREA',
      payload: {
        codingSystem: codingSystemKeys.CLINICAL_IMPRESSIONS,
        bodyAreaId: 1,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
            clinical_impression_body_area_id: 1,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_CODING', () => {
    const action = {
      type: 'SELECT_CODING',
      payload: {
        coding: {
          [codingSystemKeys.ICD]: {
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
            body_part: null,
            pathology_type: null,
            side: null,
          },
        },
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
            side_id: undefined,
          },
          [codingSystemKeys.ICD]: {
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
            body_part: null,
            pathology_type: null,
            side: null,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_SUPPLEMENTAL_CODING', () => {
    const action = {
      type: 'SELECT_SUPPLEMENTAL_CODING',
      payload: {
        supplementaryCoding: {
          [codingSystemKeys.ICD]: {
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
            body_part: null,
            pathology_type: null,
            side: null,
          },
        },
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        supplementaryCoding: {
          [codingSystemKeys.ICD]: {
            code: 'S92',
            diagnosis: 'Fracture of foot and toe, except ankle',
            body_part: null,
            pathology_type: null,
            side: null,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_CLASSIFICATION when the coding system is OSICS', () => {
    const action = {
      type: 'SELECT_CLASSIFICATION',
      payload: {
        codingSystem: codingSystemKeys.OSICS_10,
        classificationId: 11,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            osics_classification_id: 11,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_CLASSIFICATION when the coding system is DATALYS', () => {
    const action = {
      type: 'SELECT_CLASSIFICATION',
      payload: {
        codingSystem: codingSystemKeys.DATALYS,
        classificationId: 11,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.DATALYS]: {
            datalys_classification_id: 11,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_CLASSIFICATION when the coding system is CI', () => {
    const action = {
      type: 'SELECT_CLASSIFICATION',
      payload: {
        codingSystem: codingSystemKeys.CLINICAL_IMPRESSIONS,
        classificationId: 11,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
            clinical_impression_classification_id: 11,
          },
        },
      },
    });
  });

  test('returns correct state on SELECT_DIAGNOSIS_DATE', () => {
    const action = {
      type: 'SELECT_DIAGNOSIS_DATE',
      payload: {
        date: '2021-11-30',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        diagnosisDate: '2021-11-30',
      },
      eventInfo: {
        ...getInitialState().eventInfo,
        diagnosisDate: '2021-11-30',
      },
    });
  });

  test('returns correct state on SELECT_REPORTED_DATE', () => {
    const action = {
      type: 'SELECT_REPORTED_DATE',
      payload: {
        date: '2021-11-30',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        reportedDate: '2021-11-30',
      },
    });
  });

  test('returns correct state on SELECT_MECHANISM_DESCRIPTION', () => {
    const action = {
      type: 'SELECT_MECHANISM_DESCRIPTION',
      payload: {
        mechanismDescription: 'Mocked mechanism description',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        mechanismDescription: 'Mocked mechanism description',
      },
    });
  });

  test('returns correct state on SELECT_PRESENTATION_TYPE', () => {
    const action = {
      type: 'SELECT_PRESENTATION_TYPE',
      payload: {
        presentationTypeId: 123,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        presentationTypeId: 123,
      },
    });
  });

  test('returns correct state on SELECT_ISSUE_CONTACT_TYPE', () => {
    const action = {
      type: 'SELECT_ISSUE_CONTACT_TYPE',
      payload: {
        issueContactType: 123,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        issueContactType: 123,
      },
    });
  });

  test('returns correct state on SET_ISSUE_CONTACT_FREE_TEXT', () => {
    const action = {
      type: 'SET_ISSUE_CONTACT_FREE_TEXT',
      payload: {
        freeText: 'test text',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        issueContactFreetext: action.payload.freeText,
      },
    });
  });

  test('returns correct state on SELECT_INJURY_MECHANISM', () => {
    const action = {
      type: 'SELECT_INJURY_MECHANISM',
      payload: {
        injuryMechanismId: 123,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        injuryMechanismId: 123,
      },
    });
  });

  test('returns correct state on UPDATE_INJURY_MECHANISM_FREE_TEXT', () => {
    const action = {
      type: 'UPDATE_INJURY_MECHANISM_FREE_TEXT',
      payload: {
        freeText: 'test text',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        injuryMechanismFreetext: action.payload.freeText,
      },
    });
  });

  test('returns correct state on SELECT_EVENT', () => {
    const action = {
      type: 'SELECT_EVENT',
      payload: {
        eventId: '123',
        eventType: 'game',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        event: '123',
        eventType: 'game',
      },
    });
  });

  test('returns correct state on SELECT_EXAMINATION_DATE', () => {
    const action = {
      type: 'SELECT_EXAMINATION_DATE',
      payload: {
        date: '2021-11-29',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        examinationDate: '2021-11-29',
      },
    });
  });

  test('returns correct state on SELECT_ONSET', () => {
    const action = {
      type: 'SELECT_ONSET',
      payload: {
        onset: '2021-11-29',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        onset: '2021-11-29',
      },
    });
  });

  test('returns correct state on SELECT_ONSET_DESCRIPTION', () => {
    const action = {
      type: 'SELECT_ONSET_DESCRIPTION',
      payload: {
        onsetDescription: 'Mocked onset description',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        onsetDescription: 'Mocked onset description',
      },
    });
  });

  test('returns correct state on SET_ONSET_FREE_TEXT', () => {
    const action = {
      type: 'SET_ONSET_FREE_TEXT',
      payload: {
        freeText: 'Test Reason',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        onsetFreeText: 'Test Reason',
      },
    });
  });

  test('returns correct state on SET_PRESENTATION_TYPE_FREE_TEXT', () => {
    const action = {
      type: 'SET_PRESENTATION_TYPE_FREE_TEXT',
      payload: {
        presentationTypeFreeText: 'Test Reason for Presentation Type',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        presentationTypeFreeText: 'Test Reason for Presentation Type',
      },
    });
  });

  test('returns correct state on SET_CHRONIC_ISSUE', () => {
    const action = {
      type: 'SET_CHRONIC_ISSUE',
      payload: {
        id: 1,
        title: 'Test Title',
        pathology: 'Test Pathology',
      },
    };
    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        linkedChronicIssue: {
          id: 1,
          title: 'Test Title',
          pathology: 'Test Pathology',
        },
      },
    });
  });

  test('returns correct state on SET_CHRONIC_CONDITION_ONSET_DATE', () => {
    const action = {
      type: 'SET_CHRONIC_CONDITION_ONSET_DATE',
      payload: {
        date: '2021-12-12',
      },
    };
    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        chronicConditionOnsetDate: '2021-12-12',
      },
    });
  });

  test('returns correct state on SELECT_PATHOLOGY', () => {
    const action = {
      type: 'SELECT_PATHOLOGY',
      payload: {
        pathology: 123,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            osics_pathology_id: 123,
          },
        },
      },
    });
  });

  test('returns correct state on UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS', () => {
    const action = {
      type: 'UPDATE_ATTACHED_CONCUSSION_ASSESSMENTS',
      payload: {
        assessmentIds: [1, 2, 3],
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        concussion_assessments: [1, 2, 3],
      },
    });
  });

  test('returns correct state on SELECT_POSITION_WHEN_INJURED', () => {
    const action = {
      type: 'SELECT_POSITION_WHEN_INJURED',
      payload: {
        positionWhenInjured: 52,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        positionWhenInjured: 52,
      },
    });
  });

  test('returns correct state on SELECT_PREVIOUS_ISSUE', () => {
    const action = {
      type: 'SELECT_PREVIOUS_ISSUE',
      payload: {
        issueId: 1136,
        previousIssueId: 19,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        issueId: 1136,
        previousIssueId: 19,
      },
    });
  });

  describe('SELECT_CONTINUATION_ISSUE', () => {
    test('returns correct state on SELECT_CONTINUATION_ISSUE when non prior record', () => {
      const action = {
        type: 'SELECT_CONTINUATION_ISSUE',
        payload: {
          issue: {
            id: -1,
          },
        },
      };
      const nextState = addIssuePanelReducer(
        {
          ...getInitialState(),
          initialInfo: {
            ...getInitialState().initialInfo,
            type: 'INJURY_CONTINUATION',
          },
        },
        action
      );

      expect(nextState).toEqual({
        ...getInitialState(),
        initialInfo: {
          ...getInitialState().initialInfo,
          type: 'INJURY_CONTINUATION',
          issueId: -1,
          continuationIssueId: null,
        },
      });
    });

    test('returns correct state on SELECT_CONTINUATION_ISSUE', () => {
      const action = {
        type: 'SELECT_CONTINUATION_ISSUE',
        payload: {
          issue: {
            ...mockedIssue,
            concussion_assessments: [1, 2, 3],
            type_id: 1,
            onset_description: 'Onset description',
            freetext_components: [
              { name: 'issue_occurrence_onsets', value: 'Test Reason' },
            ],
            issue_occurrence_title: 'Issue title',
            supplementary_coding: '',
            coding: {
              ...mockedIssue.coding,
              clinical_impressions: {
                secondary_pathologies: [
                  {
                    record: {
                      clinical_impression_body_area: {
                        id: 27,
                        name: 'Urogenital/Anogenital',
                      },
                      clinical_impression_classification: {
                        id: 9,
                        name: 'Gen Trauma',
                      },
                      code: '330210',
                      id: 2985,
                      pathology: 'Gonad Testis Contusion',
                    },
                  },
                ],
              },
            },
          },
        },
      };

      const nextState = addIssuePanelReducer(
        {
          ...getInitialState(),
          initialInfo: {
            ...getInitialState().initialInfo,
            type: 'INJURY_CONTINUATION',
          },
        },
        action
      );
      expect(nextState).toEqual({
        ...getInitialState(),
        initialInfo: {
          ...getInitialState().initialInfo,
          type: 'INJURY_CONTINUATION',
          diagnosisDate: null,
          reportedDate: null,
          issueId: 3,
          continuationIssueId: 3,
          recurrenceOutsideSystem: false,
          previousIssueId: null,
          athleteData: null,
        },
        eventInfo: {
          ...getInitialState().eventInfo,
          eventType: 'game',
        },
        diagnosisInfo: {
          ...getInitialState().diagnosisInfo,
          coding: {
            osics_10: {
              icd: 'NC54',
              osics_body_area: 'Ankle',
              osics_body_area_id: 20,
              osics_classification: 'Fracture',
              osics_classification_id: 9,
              osics_id: 'WUPM',
              osics_pathology: 'Ankle Fracture',
              osics_pathology_id: 1394,
              side_id: 2,
            },
            clinical_impressions: {
              secondary_pathologies: [
                {
                  record: {
                    clinical_impression_body_area: {
                      id: 27,
                      name: 'Urogenital/Anogenital',
                    },
                    clinical_impression_classification: {
                      id: 9,
                      name: 'Gen Trauma',
                    },
                    code: '330210',
                    id: 2985,
                    pathology: 'Gonad Testis Contusion',
                  },
                },
              ],
            },
          },
          onset: 1,
          side: 'Right',
          concussion_assessments: [1, 2, 3],
          onsetDescription: 'Onset description',
          onsetFreeText: 'Test Reason',
          secondary_pathologies: [
            {
              record: {
                label: 'Gonad Testis Contusion',
                value: {
                  clinical_impression_body_area: 'Urogenital/Anogenital',
                  clinical_impression_body_area_id: 27,
                  clinical_impression_classification: 'Gen Trauma',
                  clinical_impression_classification_id: 9,
                  code: '330210',
                  id: 2985,
                  pathology: 'Gonad Testis Contusion',
                },
              },
            },
          ],
        },
        title: 'Issue title',
      });
    });

    test('returns correct state on SELECT_CONTINUATION_ISSUE when the issue is an illness', () => {
      const action = {
        type: 'SELECT_CONTINUATION_ISSUE',
        payload: {
          issue: {
            ...mockedIssue,
            onset_id: 1,
          },
        },
      };

      const nextState = addIssuePanelReducer(
        {
          ...getInitialState(),
          initialInfo: {
            ...getInitialState().initialInfo,
            type: 'ILLNESS_CONTINUATION',
          },
        },
        action
      );
      expect(nextState.diagnosisInfo.onset).toEqual(1);
    });
  });

  test('returns correct state on SELECT_SESSION_COMPLETED', () => {
    const action = {
      type: 'SELECT_SESSION_COMPLETED',
      payload: {
        sessionCompleted: 'NO',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        sessionCompleted: 'NO',
      },
    });
  });

  test('returns correct state on SELECT_SIDE', () => {
    const action = {
      type: 'SELECT_SIDE',
      payload: {
        side: 'RIGHT',
      },
    };
    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        side: 'RIGHT',
      },
    });
  });

  describe('when emr-multiple-coding-systems is enabled', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
    });
    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    test('returns correct state on SELECT_SIDE when the coding system is OSCIS', () => {
      const action = {
        type: 'SELECT_SIDE',
        payload: {
          codingSystem: codingSystemKeys.OSICS_10,
          side: 'RIGHT',
        },
      };

      const nextState = addIssuePanelReducer(getInitialState(), action);
      expect(nextState).toEqual({
        ...getInitialState(),
        diagnosisInfo: {
          ...getInitialState().diagnosisInfo,
          coding: {
            [codingSystemKeys.OSICS_10]: {
              ...getInitialState().diagnosisInfo.coding[
                codingSystemKeys.OSICS_10
              ],
              side_id: 'RIGHT',
            },
          },
        },
      });
    });

    test('returns correct state on SELECT_SIDE when the coding system is DATALYS', () => {
      const action = {
        type: 'SELECT_SIDE',
        payload: {
          codingSystem: codingSystemKeys.DATALYS,
          side: 'RIGHT',
        },
      };

      const nextState = addIssuePanelReducer(getInitialState(), action);
      expect(nextState).toEqual({
        ...getInitialState(),
        diagnosisInfo: {
          ...getInitialState().diagnosisInfo,
          coding: {
            [codingSystemKeys.DATALYS]: {
              ...getInitialState().diagnosisInfo.coding[
                codingSystemKeys.DATALYS
              ],
              side_id: 'RIGHT',
            },
          },
        },
      });
    });

    test('returns correct state on SELECT_SIDE when the coding system is CI', () => {
      const action = {
        type: 'SELECT_SIDE',
        payload: {
          codingSystem: codingSystemKeys.CLINICAL_IMPRESSIONS,
          side: 'RIGHT',
        },
      };

      const nextState = addIssuePanelReducer(getInitialState(), action);
      expect(nextState).toEqual({
        ...getInitialState(),
        diagnosisInfo: {
          ...getInitialState().diagnosisInfo,
          coding: {
            [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
              ...getInitialState().diagnosisInfo.coding[
                codingSystemKeys.CLINICAL_IMPRESSIONS
              ],
              side_id: 'RIGHT',
            },
          },
        },
      });
    });

    test('returns correct state on ADD_SECONDARY_PATHOLOGY when the coding system is CI', () => {
      let initialState = getInitialState();
      initialState = {
        ...initialState,
        diagnosisInfo: {
          ...initialState.diagnosisInfo,
          coding: {
            [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
              side_id: 1,
            },
          },
        },
      };
      const mockSecondaryPathology = {
        id: 4179,
        pathology: 'Man gets hit by football',
        code: '999',
        clinical_impression_body_area: {
          id: 30,
          name: 'Groin',
        },
        clinical_impression_classification: {
          id: 9,
          name: 'Gen Trauma',
        },
      };
      const secondaryPathology = {
        record: mockSecondaryPathology,
      };
      const action = {
        type: 'ADD_SECONDARY_PATHOLOGY',
        payload: { secondaryPathology },
      };

      const nextState = addIssuePanelReducer(initialState, action);

      expect(nextState).toEqual({
        ...initialState,
        diagnosisInfo: {
          ...initialState.diagnosisInfo,
          secondary_pathologies: [
            {
              ...secondaryPathology,
              side: initialState.diagnosisInfo.coding[
                codingSystemKeys.CLINICAL_IMPRESSIONS
              ].side_id,
            },
          ],
        },
      });
    });
  });

  test('returns correct state on SELECT_TIME_OF_INJURY', () => {
    const action = {
      type: 'SELECT_TIME_OF_INJURY',
      payload: {
        injuryTime: '33',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        timeOfInjury: '33',
      },
    });
  });

  test('returns correct state on UPDATE_BODY_AREA', () => {
    const action = {
      type: 'UPDATE_BODY_AREA',
      payload: {
        bodyArea: 3,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            osics_body_area_id: 3,
          },
        },
      },
    });
  });

  test('returns correct state on UPDATE_CLASSIFICATION', () => {
    const action = {
      type: 'UPDATE_CLASSIFICATION',
      payload: {
        classification: 22,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            osics_classification_id: 22,
          },
        },
      },
    });
  });

  test('returns correct state on UPDATE_EVENTS', () => {
    const action = {
      type: 'UPDATE_EVENTS',
      payload: {
        games: [
          {
            name: 'Unlisted Game',
            value: '',
            game_date: null,
          },
        ],
        other_events: [
          {
            id: 1,
            shortname: 'test',
            label: 'test label',
            sport: null,
          },
        ],
        training_sessions: [
          {
            name: 'Unlisted Training Sessions',
            value: '',
          },
        ],
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      eventInfo: {
        ...getInitialState().eventInfo,
        events: {
          games: [
            {
              name: 'Unlisted Game',
              value: '',
              game_date: null,
            },
          ],
          otherEventOptions: [
            {
              id: 1,
              shortname: 'test',
              label: 'test label',
              sport: null,
            },
          ],
          sessions: [
            {
              name: 'Unlisted Training Sessions',
              value: '',
            },
          ],
        },
      },
    });
  });

  test('returns correct state on UPDATE_ICD_CODE', () => {
    const action = {
      type: 'UPDATE_ICD_CODE',
      payload: {
        icdCode: 'NA41',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            icd: 'NA41',
          },
        },
      },
    });
  });

  test('returns correct state on UPDATE_INITIAL_NOTE', () => {
    const action = {
      type: 'UPDATE_INITIAL_NOTE',
      payload: {
        note: 'this is an initial note',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      initialInfo: {
        ...getInitialState().initialInfo,
        initialNote: 'this is an initial note',
      },
    });
  });

  test('returns correct state on UPDATE_ANNOTATION_CONTENT', () => {
    const state = {
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    };

    const action = {
      type: 'UPDATE_ANNOTATION_CONTENT',
      payload: {
        index: 0,
        content: 'Test Content 12345',
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: 'Test Content 12345',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    });
  });

  test('returns correct state on UPDATE_ANNOTATION_VISIBILITY', () => {
    const state = {
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    };

    const action = {
      type: 'UPDATE_ANNOTATION_VISIBILITY',
      payload: {
        index: 0,
        visibility: 'DOCTORS',
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: true,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              annotationable_type: 'Athlete',
              annotationable_id: 1162,
              organisation_annotation_type_id: null,
              title: 'Injury note',
              annotation_date: moment().format(),
              content: '',
              illness_occurrence_ids: [],
              injury_occurrence_ids: [],
              restricted_to_doc: false,
              restricted_to_psych: false,
              attachments_attributes: [],
              annotation_actions_attributes: [],
            },
          },
        ],
      },
    });
  });

  test('returns correct state on UPDATE_ANNOTATION_FILES_QUEUE', () => {
    const state = {
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              content: 'Note 1 content',
              filesQueue: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              content: 'Note 2 content',
              filesQueue: [],
            },
          },
        ],
      },
    };

    const action = {
      type: 'UPDATE_ANNOTATION_FILES_QUEUE',
      payload: {
        index: 1,
        files: [
          { id: 1, name: 'File 1' },
          { id: 2, name: 'File 2' },
        ],
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        ...getInitialState().additionalInfo,
        annotations: [
          {
            id: 1,
            type: 'NOTE',
            attachmentContent: {
              content: 'Note 1 content',
              filesQueue: [],
            },
          },
          {
            id: 2,
            type: 'NOTE',
            attachmentContent: {
              content: 'Note 2 content',
              filesQueue: [1, 2],
            },
          },
        ],
      },
    });
  });

  test('returns correct state on UPDATE_OSICS_CODE', () => {
    const action = {
      type: 'UPDATE_OSICS_CODE',
      payload: {
        osicsCode: 'SNBX',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        coding: {
          [codingSystemKeys.OSICS_10]: {
            osics_id: 'SNBX',
            code: 'SNBX',
          },
        },
      },
    });
  });

  test('returns correct state on UPDATE_STATUS_DATE', () => {
    const state = {
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: 'One', date: moment().format('YYYY-MM-DD') },
          { status: 'Two', date: moment().format('YYYY-MM-DD') },
          { status: 'Three', date: moment().format('YYYY-MM-DD') },
          { status: 'Four', date: moment().format('YYYY-MM-DD') },
        ],
      },
    };

    const action = {
      type: 'UPDATE_STATUS_DATE',
      payload: {
        index: 1,
        date: '2021-11-29',
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: 'One', date: moment().format('YYYY-MM-DD') },
          { status: 'Two', date: '2021-11-29' },
          { status: 'Three', date: moment().format('YYYY-MM-DD') },
          { status: 'Four', date: moment().format('YYYY-MM-DD') },
        ],
      },
    });
  });
  test('returns correct state on UPDATE_STATUS_TYPE', () => {
    const state = {
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: 'One', date: moment().format('YYYY-MM-DD') },
          { status: 'Two', date: moment().format('YYYY-MM-DD') },
          { status: 'Three', date: moment().format('YYYY-MM-DD') },
          { status: 'Four', date: moment().format('YYYY-MM-DD') },
        ],
      },
    };

    const action = {
      type: 'UPDATE_STATUS_TYPE',
      payload: {
        index: 1,
        status: 'NEW_STATUS',
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        statuses: [
          { status: 'One', date: moment().format('YYYY-MM-DD') },
          {
            status: 'NEW_STATUS',
            date: moment().format('YYYY-MM-DD'),
          },
          { status: 'Three', date: moment().format('YYYY-MM-DD') },
          { status: 'Four', date: moment().format('YYYY-MM-DD') },
        ],
      },
    });
  });

  test('returns correct state on UPDATE_CONDITIONAL_FIELDS_ANSWERS', () => {
    const action = {
      type: 'UPDATE_CONDITIONAL_FIELDS_ANSWERS',
      payload: {
        answers: [
          {
            id: 1,
            value: 'Answer 1',
          },
          {
            id: 2,
            value: 'Updated answer',
          },
        ],
      },
    };

    const nextState = addIssuePanelReducer(
      {
        ...getInitialState(),
        additionalInfo: {
          conditionalFieldsAnswers: [
            {
              id: 1,
              value: 'Answer 1',
            },
            {
              id: 2,
              value: 'Answer 2',
            },
          ],
        },
      },
      action
    );
    expect(nextState).toEqual({
      ...getInitialState(),
      additionalInfo: {
        conditionalFieldsAnswers: [
          {
            id: 1,
            value: 'Answer 1',
          },
          {
            id: 2,
            value: 'Updated answer',
          },
        ],
      },
    });
  });

  test('returns correct state on UPDATE_IS_BAMIC', () => {
    const action = {
      type: 'UPDATE_IS_BAMIC',
      payload: {
        isBamic: true,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        isBamic: true,
      },
    });
  });

  test('returns correct state on SELECT_BAMIC_GRADE', () => {
    const action = {
      type: 'SELECT_BAMIC_GRADE',
      payload: {
        bamicGrade: 1,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        bamicGrade: 1,
      },
    });
  });

  test('returns correct state on SELECT_BAMIC_SITE', () => {
    const action = {
      type: 'SELECT_BAMIC_SITE',
      payload: {
        bamicSite: 1,
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        bamicSite: 1,
      },
    });
  });

  test('returns correct state on SET_BAMIC_GRADES_OPTIONS', () => {
    const action = {
      type: 'SET_BAMIC_GRADES_OPTIONS',
      payload: {
        bamicGradesOptions: [
          {
            id: 1,
            name: 'Grade 0',
            sites: [{ id: 1, name: 'a - myofascial (peripheral)' }],
          },
        ],
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      bamicGradesOptions: [
        {
          id: 1,
          name: 'Grade 0',
          sites: [{ id: 1, name: 'a - myofascial (peripheral)' }],
        },
      ],
    });
  });

  test('returns correct state on SET_ISSUE_TITLE', () => {
    const action = {
      type: 'SET_ISSUE_TITLE',
      payload: {
        title: 'New Title',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      title: 'New Title',
    });
  });

  test('returns correct state on SET_LINKED_ISSUES when type is Injury', () => {
    const action = {
      type: 'SET_LINKED_ISSUES',
      payload: {
        ids: [1, 2, 3, 4],
        type: 'Injury',
      },
    };

    const initialState = getInitialState();
    const nextState = addIssuePanelReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      additionalInfo: {
        ...initialState.additionalInfo,
        linkedIssues: {
          injuries: [1, 2, 3, 4],
          illnesses: [],
        },
      },
    });
  });

  test('returns correct state on SET_LINKED_ISSUES when type is Illness', () => {
    const action = {
      type: 'SET_LINKED_ISSUES',
      payload: {
        ids: [1, 2, 3, 4],
        type: 'Illness',
      },
    };

    const initialState = getInitialState();
    const nextState = addIssuePanelReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      additionalInfo: {
        ...initialState.additionalInfo,
        linkedIssues: {
          injuries: [],
          illnesses: [1, 2, 3, 4],
        },
      },
    });
  });

  test('returns correct state on UPDATE_ISSUE_LINKS when the links are updated', () => {
    const action = {
      type: 'UPDATE_ISSUE_LINKS',
      payload: [{ title: 'test link 1', uri: 'test-link.com' }],
    };

    const initialState = getInitialState();
    const nextState = addIssuePanelReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      additionalInfo: {
        ...initialState.additionalInfo,
        issueLinks: action.payload,
      },
    });
  });
  test('returns correct state on ADD_SECONDARY_PATHOLOGY', () => {
    const mockSecondaryPathology = {
      id: 4179,
      pathology: 'Man gets hit by football',
      code: '999',
      clinical_impression_body_area: {
        id: 30,
        name: 'Groin',
      },
      clinical_impression_classification: {
        id: 9,
        name: 'Gen Trauma',
      },
    };
    const secondaryPathology = {
      side: 1,
      record: mockSecondaryPathology,
    };
    const action = {
      type: 'ADD_SECONDARY_PATHOLOGY',
      payload: { secondaryPathology },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        secondary_pathologies: [secondaryPathology],
      },
    });
  });

  test('returns correct state on EDIT_SECONDARY_PATHOLOGY', () => {
    const blankPathology = {
      record: null,
      onset: null,
      side: null,
      supplementalPathology: null,
    };
    const action = {
      type: 'EDIT_SECONDARY_PATHOLOGY',
      payload: {
        index: 1,
        secondaryPathology: {
          record: null,
          onset: null,
          side: 123,
          supplementalPathology: null,
        },
      },
    };

    const nextState = addIssuePanelReducer(
      {
        ...getInitialState(),
        diagnosisInfo: {
          ...getInitialState().diagnosisInfo,
          secondary_pathologies: [
            blankPathology,
            blankPathology,
            blankPathology,
          ],
        },
      },
      action
    );
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        secondary_pathologies: [
          blankPathology,
          { ...blankPathology, side: 123 },
          blankPathology,
        ],
      },
    });
  });

  test('returns correct state on REMOVE_SECONDARY_PATHOLOGY', () => {
    const mockRecords = [
      {
        id: 4179,
        pathology: 'Man gets hit by football',
        code: '999',
        clinical_impression_body_area: {
          id: 30,
          name: 'Groin',
        },
        clinical_impression_classification: {
          id: 9,
          name: 'Gen Trauma',
        },
      },
      {
        id: 4180,
        pathology: 'Man gets hit by rake',
        code: '999',
        clinical_impression_body_area: {
          id: 30,
          name: 'Face',
        },
        clinical_impression_classification: {
          id: 9,
          name: 'Repetitive',
        },
      },
    ];

    const state = {
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        secondary_pathologies: [...mockRecords],
      },
    };
    const action = {
      type: 'REMOVE_SECONDARY_PATHOLOGY',
      payload: {
        index: 0,
      },
    };

    const nextState = addIssuePanelReducer(state, action);
    expect(nextState).toEqual({
      ...getInitialState(),
      diagnosisInfo: {
        ...getInitialState().diagnosisInfo,
        secondary_pathologies: [mockRecords[1]],
      },
    });
  });

  test('returns correct state on SET_PATHOLOGY_GROUP_REQUEST_STATUS', () => {
    const action = {
      type: 'SET_PATHOLOGY_GROUP_REQUEST_STATUS',
      payload: {
        requestStatus: 'SUCCESS',
      },
    };

    const nextState = addIssuePanelReducer(getInitialState(), action);
    expect(nextState).toEqual({
      ...getInitialState(),
      pathologyGroupRequestStatus: 'SUCCESS',
    });
  });
});

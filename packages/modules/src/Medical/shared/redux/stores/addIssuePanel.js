/* eslint-disable flowtype/require-valid-file-annotation */

import moment from 'moment';

const getDefaultAddIssuePanelStore = () => ({
  isOpen: false,
  title: '',
  initialInfo: {
    type: null,
    athlete: null,
    diagnosisDate: null,
    reportedDate: null,
    initialNote: '',
    issueId: null,
    previousIssueId: null,
    squadId: null,
    isAthleteSelectable: true,
    attachments: [],
    recurrenceOutsideSystem: false,
    linkedChronicIssue: null,
    chronicConditionOnsetDate: null,
  },
  diagnosisInfo: {
    supplementalPathology: null,
    examinationDate: null,
    onset: null,
    onsetDescription: null,
    onsetFreeText: '',
    // When emr-multiple-coding-systems is enabled, the side information is in the coding object
    ...(window.featureFlags['emr-multiple-coding-systems']
      ? {}
      : { side: null }),
    statuses: [{ status: '', date: moment(Date.now()).format('YYYY-MM-DD') }],
    concussion_assessments: [],
    isBamic: false,
    bamicGrade: null,
    bamicSite: null,
    coding: {},
    supplementaryCoding: {},
    pathology: null,
    classification: null,
    bodyArea: null,
    osicsCode: null,
    icdCode: null,
    secondary_pathologies: [],
    relatedChronicIssues: [],
    selectedCodingSystemPathology: null,
  },
  eventInfo: {
    diagnosisDate: moment(Date.now()).format('YYYY-MM-DD'),
    event: null,
    eventType: null,
    events: {
      games: [],
      sessions: [],
      otherEventOptions: [],
    },
    activity: null,
    positionWhenInjured: null,
    sessionCompleted: null,
    timeOfInjury: null,
    mechanismDescription: null,
    presentationTypeId: null,
    presentationTypeFreeText: '',
    injuryMechanismId: null,
    injuryMechanismFreetext: '',
    primaryMechanismFreetext: '',
  },
  additionalInfo: {
    annotations: [],
    conditionalFieldsAnswers: [],
    requestStatus: null,
    questions: [],
    linkedIssues: {
      injuries: [],
      illnesses: [],
    },
    issueLinks: [],
  },
  bamicGradesOptions: [],
  page: 1,
  requestStatus: null,
  pathologyGroupRequestStatus: null,
});

export default getDefaultAddIssuePanelStore;

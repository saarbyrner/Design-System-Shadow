// @flow

export default {
  viewType: 'LIST',
  athletes: [{ id: 0 }],
  assessmentTemplates: [],
  organisationTrainingVariables: [],
  statusVariables: [],
  currentSquad: {},
  users: [],
  turnaroundList: [],
  assessments: [],
  appState: {
    assessmentsRequestStatus: null,
    selectedAthlete: null,
    filteredTemplates: [],
    nextAssessmentId: null,
    fetchAssessmentsXHR: null,
  },
  appStatus: {
    status: null,
  },
  toasts: [],
};

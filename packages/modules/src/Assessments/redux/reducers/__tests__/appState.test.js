import appStateReducer from '../appState';
import {
  assessmentsLoading,
  selectAthlete,
  fetchAssessmentsFailure,
  fetchAssessmentsSuccess,
  applyTemplateFilter,
  deleteTemplateSuccess,
  saveTemplateSuccess,
  saveAssessmentSuccess,
} from '../../actions';

describe('appState reducer', () => {
  const initialState = {
    assessmentsRequestStatus: null,
    filteredTemplates: [],
  };

  it('returns correct state on ASSESSMENT_LOADING', () => {
    const lastFetchAssessmentsXHR = { readyState: 4 };
    const action = assessmentsLoading(lastFetchAssessmentsXHR);
    const nextState = appStateReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      assessmentsRequestStatus: 'PENDING',
      fetchAssessmentsXHR: lastFetchAssessmentsXHR,
    });
  });

  it('returns correct state on SELECT_ATHLETE', () => {
    const action = selectAthlete(3);
    const nextState = appStateReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      selectedAthlete: 3,
    });
  });

  it('returns correct state on FETCH_ASSESSMENTS_FAILURE', () => {
    const action = fetchAssessmentsFailure();
    const nextState = appStateReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      assessmentsRequestStatus: 'FAILURE',
    });
  });

  it('returns correct state on FETCH_ASSESSMENTS_SUCCESS', () => {
    const action = fetchAssessmentsSuccess([], 3);
    const nextState = appStateReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      assessmentsRequestStatus: 'SUCCESS',
      nextAssessmentId: 3,
    });
  });

  it('returns correct state on APPLY_TEMPLATE_FILTER', () => {
    const action = applyTemplateFilter([1, 2, 3]);
    const nextState = appStateReducer(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      filteredTemplates: [1, 2, 3],
    });
  });

  it('returns correct state on DELETE_TEMPLATE_SUCCESS', () => {
    const action = deleteTemplateSuccess(1);
    const currentState = { ...initialState, filteredTemplates: [1, 2, 3] };
    const nextState = appStateReducer(currentState, action);

    expect(nextState).toEqual({
      ...initialState,
      filteredTemplates: [2, 3],
    });
  });

  it('returns correct state on SAVE_TEMPLATE_SUCCESS', () => {
    const newTemplate = { id: 4, name: 'new template' };
    const action = saveTemplateSuccess(null, newTemplate);
    const currentState = { ...initialState, filteredTemplates: [1, 2, 3] };
    const nextState = appStateReducer(currentState, action);

    expect(nextState).toEqual({
      ...initialState,
      filteredTemplates: [1, 2, 3, 4],
    });
  });

  it('returns correct state on SAVE_ASSESSMENT_SUCCESS', () => {
    const assessment = {
      id: 1,
      assessment_template: { id: 4, name: 'Template name' },
    };
    const action = saveAssessmentSuccess(assessment);
    const currentState = { ...initialState, filteredTemplates: [1, 2, 3] };
    const nextState = appStateReducer(currentState, action);

    expect(nextState).toEqual({
      ...initialState,
      filteredTemplates: [1, 2, 3, 4],
    });
  });

  it('returns correct state on SAVE_ASSESSMENT_SUCCESS when the assessment has no template', () => {
    const assessment = {
      id: 1,
      assessment_template: null,
    };
    const action = saveAssessmentSuccess(assessment);
    const currentState = { ...initialState, filteredTemplates: [1, 2, 3] };
    const nextState = appStateReducer(currentState, action);

    expect(nextState).toEqual({
      ...initialState,
      filteredTemplates: [1, 2, 3, null],
    });
  });
});

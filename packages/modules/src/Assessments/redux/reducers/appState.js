// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'appState'> = {},
  action: Action
) {
  switch (action.type) {
    case 'ASSESSMENT_LOADING': {
      return {
        ...state,
        assessmentsRequestStatus: 'PENDING',
        fetchAssessmentsXHR: action.payload.lastFetchAssessmentsXHR,
      };
    }
    case 'SELECT_ATHLETE': {
      return {
        ...state,
        selectedAthlete: action.payload.athleteId,
      };
    }
    case 'FETCH_ASSESSMENTS_FAILURE': {
      return {
        ...state,
        assessmentsRequestStatus: 'FAILURE',
      };
    }
    case 'FETCH_ASSESSMENTS_SUCCESS': {
      return {
        ...state,
        assessmentsRequestStatus: 'SUCCESS',
        nextAssessmentId: action.payload.nextAssessmentId,
      };
    }
    case 'APPLY_TEMPLATE_FILTER': {
      return {
        ...state,
        filteredTemplates: action.payload.filteredTemplates,
      };
    }
    case 'DELETE_TEMPLATE_SUCCESS': {
      const filteredTemplates: Array<string> = state.filteredTemplates.filter(
        (templateId) => templateId !== action.payload.templateId
      );

      return {
        ...state,
        filteredTemplates,
      };
    }
    case 'SAVE_ASSESSMENT_SUCCESS': {
      if (state.filteredTemplates.length === 0) {
        return state;
      }

      return {
        ...state,
        filteredTemplates: [
          ...state.filteredTemplates,
          action.payload.assessment.assessment_template?.id || null,
        ],
      };
    }
    case 'SAVE_TEMPLATE_SUCCESS': {
      if (state.filteredTemplates.length === 0) {
        return state;
      }

      return {
        ...state,
        filteredTemplates: [
          ...state.filteredTemplates,
          action.payload.template.id,
        ],
      };
    }
    default:
      return state;
  }
}

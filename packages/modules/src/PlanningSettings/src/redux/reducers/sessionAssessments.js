// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'sessionAssessments'> = {},
  action: Action
) {
  switch (action.type) {
    case 'CLEAR_EDITED_SESSION_ASSESSMENTS': {
      return {
        ...state,
        editedSessionAssessments: {},
      };
    }
    case 'SELECT_ASSESSMENT_TYPE': {
      const exists =
        !!state.editedSessionAssessments[action.payload.sessionTypeId];

      if (exists) {
        const newEditedSessionAssessments = {
          ...state.editedSessionAssessments,
        };
        newEditedSessionAssessments[action.payload.sessionTypeId] =
          action.payload.selectedAssessmentTypeArray;

        return {
          ...state,
          editedSessionAssessments: newEditedSessionAssessments,
        };
      }

      return {
        ...state,
        editedSessionAssessments: {
          ...state.editedSessionAssessments,
          [action.payload.sessionTypeId]:
            action.payload.selectedAssessmentTypeArray,
        },
      };
    }
    case 'SESSION_ASSESSMENT_REQUEST_PENDING': {
      return {
        ...state,
        requestStatus: 'LOADING',
      };
    }
    case 'SESSION_ASSESSMENT_REQUEST_FAILURE': {
      return {
        ...state,
        requestStatus: 'FAILURE',
      };
    }
    case 'SESSION_ASSESSMENT_REQUEST_SUCCESS': {
      return {
        ...state,
        requestStatus: 'SUCCESS',
      };
    }
    case 'SET_SESSION_TEMPLATES': {
      return {
        ...state,
        data: action.payload.data,
      };
    }
    default:
      return state;
  }
}

// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'gameTemplates'> = {},
  action: Action
) {
  switch (action.type) {
    case 'CLEAR_EDITED_GAME_TEMPLATES': {
      return {
        ...state,
        editedGameTemplates: null,
      };
    }
    case 'SELECT_GAME_ASSESSMENT_TYPE': {
      return {
        ...state,
        editedGameTemplates: action.payload.selectedAssessmentTypeArray,
      };
    }
    case 'GAME_REQUEST_PENDING': {
      return {
        ...state,
        requestStatus: 'LOADING',
      };
    }
    case 'GAME_REQUEST_FAILURE': {
      return {
        ...state,
        requestStatus: 'FAILURE',
      };
    }
    case 'GAME_REQUEST_SUCCESS': {
      return {
        ...state,
        requestStatus: 'SUCCESS',
      };
    }
    case 'SET_GAME_TEMPLATES': {
      return {
        ...state,
        assessmentTemplates: action.payload.assessmentTemplates,
      };
    }
    default:
      return state;
  }
}

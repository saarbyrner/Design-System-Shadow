// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'app'> = {},
  action: Action
) {
  switch (action.type) {
    case 'REQUEST_PENDING': {
      return {
        ...state,
        requestStatus: 'LOADING',
      };
    }
    case 'REQUEST_FAILURE': {
      return {
        ...state,
        requestStatus: 'FAILURE',
      };
    }
    case 'REQUEST_SUCCESS': {
      return {
        ...state,
        requestStatus: 'SUCCESS',
      };
    }
    case 'SET_ASSESSMENT_TEMPLATES': {
      return {
        ...state,
        assessmentTemplates: action.payload.assessmentTemplates,
      };
    }
    default:
      return state;
  }
}

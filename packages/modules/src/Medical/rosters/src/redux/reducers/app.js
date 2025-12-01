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
        requestStatus: 'PENDING',
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

    case 'SET_REQUEST_STATUS': {
      return {
        ...state,
        requestStatus: action.payload.requestStatus,
      };
    }

    case 'REQUEST_COMMENTS_GRID_SUCCESS': {
      return {
        ...state,
        commentsGridRequestStatus: 'SUCCESS',
      };
    }

    case 'REQUEST_COMMENTS_GRID_FAILURE': {
      return {
        ...state,
        commentsGridRequestStatus: 'FAILURE',
      };
    }

    case 'SET_COMMENTS_GRID_REQUEST_STATUS': {
      return {
        ...state,
        commentsGridRequestStatus: action.payload.commentsGridRequestStatus,
      };
    }

    default:
      return state;
  }
}

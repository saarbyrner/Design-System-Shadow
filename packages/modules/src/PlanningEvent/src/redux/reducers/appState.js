// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

const defaultState = {
  requestStatus: 'LOADING',
};

export default function (
  state: $PropertyType<Store, 'appState'> = defaultState,
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
    case 'SET_REQUEST_STATUS': {
      return {
        ...state,
        requestStatus: action.payload.requestStatus,
      };
    }
    default:
      return state;
  }
}

// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'appStatus'> = {},
  action: Action
) {
  switch (action.type) {
    case 'SAVE_PARTICIPATION_FORM_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'SAVE_PARTICIPATION_FORM_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    case 'SAVE_PARTICIPATION_FORM_SUCCESS': {
      return {
        ...state,
        status: 'success',
      };
    }
    case 'SHOW_CANCEL_CONFIRM': {
      return {
        ...state,
        status: 'confirm',
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        ...state,
        status: null,
      };
    }
    default:
      return state;
  }
}

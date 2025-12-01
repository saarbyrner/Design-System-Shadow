// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'appStatus'> = {},
  action: Action
) {
  switch (action.type) {
    case 'SAVE_ASSESSMENT_ITEM_SUCCESS':
    case 'DELETE_ASSESSMENT_SUCCESS':
    case 'DELETE_ASSESSMENT_ITEM_SUCCESS':
    case 'SAVE_ASSESSMENT_SUCCESS':
    case 'SAVE_TEMPLATE_SUCCESS':
    case 'DELETE_TEMPLATE_SUCCESS':
    case 'RENAME_TEMPLATE_SUCCESS':
    case 'SAVE_ASSESSMENT_ATHLETES_SUCCESS':
    case 'SAVE_ASSESSMENT_ITEM_COMMENTS_SUCCESS':
    case 'SAVE_METRIC_SCORES_SUCCESS':
    case 'SAVE_ASSESSMENT_ITEMS_ORDER_SUCCESS': {
      return {
        ...state,
        status: null,
      };
    }
    case 'REQUEST_PENDING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'REQUEST_FAILURE': {
      return {
        ...state,
        status: 'error',
      };
    }
    default:
      return state;
  }
}

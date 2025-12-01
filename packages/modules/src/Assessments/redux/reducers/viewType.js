// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'viewType'> = 'LIST',
  action: Action
) {
  switch (action.type) {
    case 'UPDATE_VIEW_TYPE': {
      return action.payload.viewType;
    }
    default:
      return state;
  }
}

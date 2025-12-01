// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'participantForm'> = {},
  action: Action
) {
  switch (action.type) {
    default:
      return state;
  }
}

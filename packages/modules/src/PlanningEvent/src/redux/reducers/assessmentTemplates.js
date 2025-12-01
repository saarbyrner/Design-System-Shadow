// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'assessmentTemplates'> = [],
  action: Action
) {
  switch (action.type) {
    case 'SET_ASSESSMENT_TEMPLATES': {
      return action.payload.assessmentTemplates || [];
    }
    default:
      return state;
  }
}

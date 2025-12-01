// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

const defaultState = { assessments: [] };

export default function (
  state: $PropertyType<Store, 'eventAssessments'> = defaultState,
  action: Action
) {
  switch (action.type) {
    case 'FETCH_ASSESSMENTS_SUCCESS': {
      const assessments = action.payload.assessments;

      return {
        ...state,
        assessments,
      };
    }
    default:
      return state;
  }
}

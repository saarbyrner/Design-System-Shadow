// @flow
import type { Store } from '../../../issues/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<Store, 'addConcussionAssessmentSidePanel'> = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        initialInfo: {
          isAthleteSelectable: action.payload.isAthleteSelectable,
        },
      };
    }
    case 'CLOSE_ADD_CONCUSSION_ASSESSMENT_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
};

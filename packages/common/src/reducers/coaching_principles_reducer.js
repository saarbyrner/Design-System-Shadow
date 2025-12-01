// @flow
import type {
  CoachingPrinciplesState,
  SetCoachingPrinciplesEnabled,
} from '@kitman/common/src/types';

const defaultState = { isEnabled: false };

const coachingPrinciplesReducer = (
  state: CoachingPrinciplesState = defaultState,
  action: SetCoachingPrinciplesEnabled
) => {
  switch (action.type) {
    case 'SET_COACHING_PRINCIPLES_ENABLED': {
      return {
        ...state,
        isEnabled: action.payload.value,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default coachingPrinciplesReducer;

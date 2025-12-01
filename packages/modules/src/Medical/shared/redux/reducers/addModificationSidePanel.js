// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'addModificationSidePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_MODIFICATION_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        initialInfo: {
          isAthleteSelectable: action.payload.isAthleteSelectable,
        },
      };
    }
    case 'CLOSE_ADD_MODIFICATION_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
};

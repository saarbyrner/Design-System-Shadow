// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'addTreatmentsSidePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_TREATMENTS_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        initialInfo: {
          isAthleteSelectable: action.payload.isAthleteSelectable,
          isDuplicatingTreatment: action.payload.isDuplicatingTreatment,
          duplicateTreatment: action.payload.duplicateTreatment,
        },
      };
    }
    case 'CLOSE_ADD_TREATMENTS_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
};

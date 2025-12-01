// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'addMedicalAlertSidePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_MEDICAL_ALERT_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        selectedMedicalAlert: action.payload.selectedMedicalAlert,
        initialInfo: {
          isAthleteSelectable: action.payload.isAthleteSelectable,
        },
      };
    }
    case 'CLOSE_ADD_MEDICAL_ALERT_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
};

// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'addDiagnosticSidePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_DIAGNOSTIC_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        athleteId: action.payload.athleteId,
        initialInfo: {
          isAthleteSelectable: action.payload.isAthleteSelectable,
          diagnosticId: action.payload.diagnosticId,
        },
      };
    }
    case 'CLOSE_ADD_DIAGNOSTIC_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
        athleteId: null,
      };
    }
    default:
      return state;
  }
};

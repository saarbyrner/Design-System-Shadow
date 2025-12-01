// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Store as IssuePageStore } from '../../../issues/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore | IssuePageStore,
    'addDiagnosticLinkSidePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_DIAGNOSTIC_LINK_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        diagnosticId: action.payload.diagnosticId,
        athleteId: action.payload.athleteId,
      };
    }
    case 'CLOSE_ADD_DIAGNOSTIC_LINK_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
        diagnosticId: null,
        athleteId: null,
      };
    }
    default:
      return state;
  }
};

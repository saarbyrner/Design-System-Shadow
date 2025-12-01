// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'addProcedureAttachmentSidePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_PROCEDURE_ATTACHMENT_SIDE_PANEL': {
      return {
        ...state,
        isOpen: true,
        procedureId: action.payload.procedureId,
        athleteId: action.payload.athleteId,
      };
    }
    case 'CLOSE_ADD_PROCEDURE_ATTACHMENT_SIDE_PANEL': {
      return {
        ...state,
        isOpen: false,
        procedureId: null,
        athleteId: null,
      };
    }
    default:
      return state;
  }
};

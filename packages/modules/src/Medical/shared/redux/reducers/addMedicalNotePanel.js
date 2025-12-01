// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'addMedicalNotePanel'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'OPEN_ADD_MEDICAL_NOTE_PANEL': {
      return {
        ...state,
        isOpen: true,
        initialInfo: {
          isAthleteSelectable: action.payload.isAthleteSelectable,
          isDuplicatingNote: action.payload.isDuplicatingNote,
          duplicateNote: action.payload?.duplicateNote || null,
        },
      };
    }
    case 'CLOSE_ADD_MEDICAL_NOTE_PANEL': {
      return {
        ...state,
        isOpen: false,
      };
    }
    default:
      return state;
  }
};

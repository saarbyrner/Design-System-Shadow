// @flow
import type { Store as RostersPageStore } from '../../../rosters/src/redux/types/store';
import type { Store as AthletesPageStore } from '../../../athletes/src/redux/types/store';
import type { Action } from '../types/actions';

export default (
  state: $PropertyType<
    RostersPageStore | AthletesPageStore,
    'medicalHistory'
  > = {},
  action: Action
) => {
  switch (action.type) {
    case 'SAVE_MEDICAL_HISTORY': {
      const tue = [];
      const vaccinations = [];

      action.payload.medicalHistory.forEach((item) => {
        if (item.medical_meta.note_medical_type === 'TUE' && window.getFlag('pm-show-tue')) {
          tue.push(item);
        }
        if (item.medical_meta.note_medical_type === 'Vaccination') {
          vaccinations.push(item);
        }
      });

      return {
        ...state,
        [action.payload.athleteId]: {
          tue,
          vaccinations,
        },
      };
    }
    default:
      return state;
  }
};

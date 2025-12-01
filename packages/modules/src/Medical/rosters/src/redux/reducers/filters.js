// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';
import {
  getPersistedMedicalFilters,
  setPersistedMedicalFilters,
} from '../../../../shared/utils/filters';

const initialState = getPersistedMedicalFilters({}, [
  'squads',
  'availabilities',
  'positions',
  'issues',
]);

export default (
  state: $PropertyType<Store, 'filters'> = initialState,
  action: Action
) => {
  switch (action.type) {
    case 'UPDATE_FILTERS': {
      setPersistedMedicalFilters(
        ['squads', 'availabilities', 'positions', 'issues'],
        { ...state, ...action.payload.filters },
        'roster'
      );
      return getPersistedMedicalFilters(
        { ...state, ...action.payload.filters },
        ['squads', 'availabilities', 'positions', 'issues'],
        'roster'
      );
    }
    default:
      return state;
  }
};

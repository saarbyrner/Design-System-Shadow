// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';
import {
  getPersistedCommentsFilters,
  setPersistedCommentsFilters,
} from '../../../../shared/utils/CommentsFilters';

const initialState = getPersistedCommentsFilters({}, [
  'squads',
  'availabilities',
  'positions',
  'issues',
]);

export default (
  state: $PropertyType<Store, 'commentsFilters'> = initialState,
  action: Action
) => {
  switch (action.type) {
    case 'UPDATE_COACHES_REPORT_FILTERS': {
      setPersistedCommentsFilters(
        ['squads', 'availabilities', 'positions', 'issues'],
        { ...state, ...action.payload.filters },
        'roster'
      );
      return getPersistedCommentsFilters(
        { ...state, ...action.payload.filters },
        ['squads', 'availabilities', 'positions', 'issues'],
        'roster'
      );
    }
    default:
      return state;
  }
};

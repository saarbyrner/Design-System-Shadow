// @flow
import { eventTypeFilterEnumLike } from './enum-likes';
import type { Filters, FilterKey } from '../redux/types';

export const allEventTypes = ((Object.values(
  eventTypeFilterEnumLike
): any): Array<string>);

export const initialFilters: Filters = {
  squads: [],
  types: allEventTypes,
  venueTypes: [],
  locationNames: [],
  athletes: [],
  staff: [],
  competitions: [],
  oppositions: [],
  session_type_names: [],
};

export const filtersSavedInLocalStorageSet: Set<FilterKey> = new Set([
  'types',
  'squads',
]);

// @flow
import type { ID } from '@kitman/components/src/Athletes/types';
import type { ItemValue } from '@kitman/components/src/CheckboxList';

import type { EventTypeFilter } from '../utils/types';
import { reducerKey } from './consts';

export type LocationName = {
  value: number,
  label: string,
};

export type Filters = {
  squads: Array<number>,
  types: Array<EventTypeFilter>,
  athletes: Array<ID>,
  staff: Array<number>,
  venueTypes: Array<ItemValue>,
  locationNames: Array<LocationName>,
  competitions: Array<number>,
  oppositions: Array<number>,
  session_type_names: Array<string>,
};

export type FiltersState = {
  filters: Filters,
};

export type Store = {
  [typeof reducerKey]: FiltersState,
};

export type FilterKey = $Keys<Filters>;
export type FiltersValue = $Values<Filters>;

export type SetFilterActionPayload = {
  key: FilterKey,
  value: FiltersValue,
};

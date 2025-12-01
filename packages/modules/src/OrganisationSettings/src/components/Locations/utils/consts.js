// @flow

import type { Locations } from './types';

export const NEW_LOCATION_ID_PREFIX = 'newLocationIdPrefix__';

export const locationsMock: Locations = [
  {
    id: '1',
    name: 'Pallet',
    location_type: 'other',
    event_types: ['game'],
    active: true,
  },
  {
    id: '2',
    name: 'Viridian',
    location_type: 'stadium',
    event_types: ['game', 'session'],
    active: true,
  },
  {
    id: '3',
    name: 'Pewter',
    location_type: 'training_facility',
    event_types: ['custom', 'game'],
    active: true,
  },
  {
    id: '4',
    name: 'Cerulean',
    location_type: 'stadium',
    event_types: ['custom'],
    active: true,
  },
];

export const archivedLocationsMock: Locations = [
  {
    id: '1',
    name: 'PalletArchived',
    location_type: 'other',
    event_types: ['game'],
    active: false,
  },
  {
    id: '2',
    name: 'ViridianArchived',
    location_type: 'stadium',
    event_types: ['game', 'session'],
    active: false,
  },
  {
    id: '3',
    name: 'PewterArchived',
    location_type: 'training_facility',
    event_types: ['custom', 'game'],
    active: false,
  },
  {
    id: '4',
    name: 'CeruleanArchived',
    location_type: 'stadium',
    event_types: ['custom'],
    active: false,
  },
];

export const headerMarginBottomRemEditMode = 1;
export const headerMarginBottomRemViewArchiveMode = 0;

export const eventTypesJoinSeparator = ', ';

export const searchDebounceMs = 400;

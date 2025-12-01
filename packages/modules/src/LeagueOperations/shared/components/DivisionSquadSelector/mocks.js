// @flow

const divisionsAndConferences = [
  {
    id: 8135,
    name: 'Cal North',
    division: {
      id: 53,
      name: 'Cal North',
      parent_division_id: 35,
    },
  },
  {
    id: 8081,
    name: 'Conference A',
    division: {
      id: 7,
      name: 'Conference A',
      parent_division_id: 1,
    },
  },
  {
    id: 8082,
    name: 'Conference B',
    division: {
      id: 8,
      name: 'Conference B',
      parent_division_id: 1,
    },
  },
  {
    id: 8086,
    name: 'East',
    division: {
      id: 12,
      name: 'East',
      parent_division_id: 8,
    },
  },
  {
    id: 8131,
    name: 'Elite Academy League',
    division: {
      id: 49,
      name: 'Elite Academy League',
      parent_division_id: 35,
    },
  },
  {
    id: 8130,
    name: 'Heartland',
    division: {
      id: 48,
      name: 'Heartland',
      parent_division_id: 47,
    },
  },
  {
    id: 7643,
    name: 'KLS',
    division: {
      id: 3,
      name: 'KLS',
      parent_division_id: null,
    },
  },
  {
    id: 3492,
    name: 'KLS Next',
    division: {
      id: 1,
      name: 'KLS Next',
      parent_division_id: null,
    },
  },
  {
    id: 8117,
    name: 'KLS Next 2',
    division: {
      id: 35,
      name: 'KLS Next 2',
      parent_division_id: null,
    },
  },
  {
    id: 6421,
    name: 'KLS Next Pro',
    division: {
      id: 4,
      name: 'KLS Next Pro',
      parent_division_id: null,
    },
  },
  {
    id: 8121,
    name: 'Mid-Atlantic',
    division: {
      id: 39,
      name: 'Mid-Atlantic',
      parent_division_id: 36,
    },
  },
  {
    id: 8133,
    name: 'Mountain',
    division: {
      id: 51,
      name: 'Mountain',
      parent_division_id: 49,
    },
  },

  {
    id: 8083,
    name: 'North',
    division: {
      id: 9,
      name: 'North',
      parent_division_id: 7,
    },
  },
  {
    id: 8136,
    name: 'North California',
    division: {
      id: 54,
      name: 'North California',
      parent_division_id: 53,
    },
  },
  {
    id: 8118,
    name: 'National Academy League',
    division: {
      id: 36,
      name: 'National Academy League',
      parent_division_id: 35,
    },
  },
  {
    id: 8134,
    name: 'South Califonia',
    division: {
      id: 52,
      name: 'South Califonia',
      parent_division_id: 49,
    },
  },
];

const divisionsAndSquadsToSort = [
  {
    id: 1,
    name: 'Squad 1',
    division: { id: 11, name: 'Division 1', parent_division_id: null },
  },
  {
    id: 2,
    name: 'Squad 2',
    division: { id: 12, name: 'Division 0', parent_division_id: null },
  },
  {
    id: 3,
    name: 'Squad 3',
    division: { id: 11, name: 'Division 1', parent_division_id: null },
  },
];

const divisionsAndSquads = [
  {
    id: 7536,
    name: 'Next Pro Team',
    division: { id: 4, name: 'KLS Next Pro', parent_division_id: null },
  },
  {
    id: 3494,
    name: 'U13',
    division: { id: 1, name: 'KLS Next', parent_division_id: null },
  },
  {
    id: 8087,
    name: 'U13 AD',
    division: { id: 10, name: 'South', parent_division_id: 7 },
  },
  {
    id: 5636,
    name: 'U14',
    division: { id: 1, name: 'KLS Next', parent_division_id: null },
  },
  {
    id: 8089,
    name: 'U17 AD',
    division: { id: 11, name: 'West', parent_division_id: 8 },
  },
];

const sharedMocks = [
  {
    disabled: false,
    id: 8135,
    indentLevel: 1,
    name: 'Cal North',
  },
  {
    disabled: false,
    id: 8136,
    indentLevel: 2,
    name: 'North California',
  },
  {
    disabled: false,
    id: 8131,
    indentLevel: 1,
    name: 'Elite Academy League',
  },
  {
    disabled: false,
    id: 8133,
    indentLevel: 2,
    name: 'Mountain',
  },
  {
    disabled: false,
    id: 8134,
    indentLevel: 2,
    name: 'South Califonia',
  },
  {
    disabled: false,
    id: 8118,
    indentLevel: 1,
    name: 'National Academy League',
  },
  {
    disabled: false,
    id: 8121,
    indentLevel: 2,
    name: 'Mid-Atlantic',
  },
];

const divisionsAndConferencesInDivisionsAndSquads = [
  {
    disabled: true,
    id: 48,
    indentLevel: 0,
    name: 'Heartland',
  },
  {
    disabled: false,
    id: 8130,
    indentLevel: 1,
    name: 'Heartland',
  },
  {
    disabled: true,
    id: 3,
    indentLevel: 0,
    name: 'KLS',
  },
  {
    disabled: false,
    id: 7643,
    indentLevel: 1,
    name: 'KLS',
  },
  {
    disabled: true,
    id: 1,
    indentLevel: 0,
    name: 'KLS Next',
  },
  {
    disabled: false,
    id: 3492,
    indentLevel: 1,
    name: 'KLS Next',
  },
  {
    disabled: false,
    id: 8081,
    indentLevel: 1,
    name: 'Conference A',
  },
  {
    disabled: false,
    id: 8083,
    indentLevel: 2,
    name: 'North',
  },
  {
    disabled: false,
    id: 8082,
    indentLevel: 1,
    name: 'Conference B',
  },
  {
    disabled: false,
    id: 8086,
    indentLevel: 2,
    name: 'East',
  },
  {
    disabled: true,
    id: 35,
    indentLevel: 0,
    name: 'KLS Next 2',
  },
  {
    disabled: false,
    id: 8117,
    indentLevel: 1,
    name: 'KLS Next 2',
  },
  ...sharedMocks,
  {
    disabled: true,
    id: 4,
    indentLevel: 0,
    name: 'KLS Next Pro',
  },
  {
    disabled: false,
    id: 6421,
    indentLevel: 1,
    name: 'KLS Next Pro',
  },
];

const divisionsAndConferencesInDivisionsAndConferences = [
  {
    disabled: false,
    id: 8130,
    indentLevel: 0,
    name: 'Heartland',
  },
  {
    disabled: false,
    id: 7643,
    indentLevel: 0,
    name: 'KLS',
  },
  {
    disabled: false,
    id: 3492,
    indentLevel: 0,
    name: 'KLS Next',
  },
  {
    disabled: false,
    id: 8081,
    indentLevel: 1,
    name: 'Conference A',
  },
  {
    disabled: false,
    id: 8083,
    indentLevel: 2,
    name: 'North',
  },
  {
    disabled: false,
    id: 8082,
    indentLevel: 1,
    name: 'Conference B',
  },
  {
    disabled: false,
    id: 8086,
    indentLevel: 2,
    name: 'East',
  },
  {
    disabled: false,
    id: 8117,
    indentLevel: 0,
    name: 'KLS Next 2',
  },
  ...sharedMocks,
  {
    disabled: false,
    id: 6421,
    indentLevel: 0,
    name: 'KLS Next Pro',
  },
];

const divisionsAndSquadsToSortInDivisionsAndSquads = [
  {
    disabled: true,
    id: 12,
    indentLevel: 0,
    name: 'Division 0',
  },
  {
    disabled: false,
    id: 2,
    indentLevel: 1,
    name: 'Squad 2',
  },
  {
    disabled: true,
    id: 11,
    indentLevel: 0,
    name: 'Division 1',
  },
  {
    disabled: false,
    id: 1,
    indentLevel: 1,
    name: 'Squad 1',
  },
  {
    disabled: false,
    id: 3,
    indentLevel: 1,
    name: 'Squad 3',
  },
];

const divisionsAndSquadsToSortInDivisionsAndConferences = [
  {
    disabled: false,
    id: 2,
    indentLevel: 0,
    name: 'Squad 2',
  },
  {
    disabled: false,
    id: 1,
    indentLevel: 0,
    name: 'Squad 1',
  },
];
const divisionsAndSquadsInDivisionsAndSquads = [
  { disabled: true, id: 1, indentLevel: 0, name: 'KLS Next' },
  { disabled: false, id: 3494, indentLevel: 1, name: 'U13' },
  { disabled: false, id: 5636, indentLevel: 1, name: 'U14' },
  { disabled: true, id: 4, indentLevel: 0, name: 'KLS Next Pro' },
  { disabled: false, id: 7536, indentLevel: 1, name: 'Next Pro Team' },
  { disabled: true, id: 10, indentLevel: 0, name: 'South' },
  { disabled: false, id: 8087, indentLevel: 1, name: 'U13 AD' },
  { disabled: true, id: 11, indentLevel: 0, name: 'West' },
  { disabled: false, id: 8089, indentLevel: 1, name: 'U17 AD' },
];

const divisionsAndSquadsInDivisionsAndConferences = [
  { disabled: false, id: 3494, indentLevel: 0, name: 'U13' },
  { disabled: false, id: 7536, indentLevel: 0, name: 'Next Pro Team' },
  { disabled: false, id: 8087, indentLevel: 0, name: 'U13 AD' },
  { disabled: false, id: 8089, indentLevel: 0, name: 'U17 AD' },
];

export default {
  divisionsAndConferences,
  divisionsAndSquadsToSort,
  divisionsAndSquads,
  divisionsAndConferencesInDivisionsAndSquads,
  divisionsAndConferencesInDivisionsAndConferences,
  divisionsAndSquadsToSortInDivisionsAndSquads,
  divisionsAndSquadsToSortInDivisionsAndConferences,
  divisionsAndSquadsInDivisionsAndSquads,
  divisionsAndSquadsInDivisionsAndConferences,
};

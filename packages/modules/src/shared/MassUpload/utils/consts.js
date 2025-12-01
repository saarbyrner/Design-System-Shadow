// @flow
export const PARSE_STATE = {
  Dormant: 'DORMANT',
  Processing: 'PROCESSING',
  Complete: 'COMPLETE',
  Error: 'ERROR',
  FilePondError: 'FILE_POND_ERROR',
  Success: 'SUCCESS',
};

export const ACCEPTED_FILE_TYPES = {
  FilePond: ['text/csv'], // used for filepond
  Text: 'csv', // used for text usages, different to above as text isn't actually supported
};

export const USER_TYPES_WITH_ONLY_MISSING_COLUMNS_WHEN_ERROR = [
  'growth_and_maturation',
  'baselines',
  'league_benchmarking',
  'training_variable_answer',
];

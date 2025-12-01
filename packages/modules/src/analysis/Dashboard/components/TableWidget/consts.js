// @flow
export const GAMEDAY_FILTER_OPTIONS = [
  { label: '-7', value: -7 },
  { label: '-6', value: -6 },
  { label: '-5', value: -5 },
  { label: '-4', value: -4 },
  { label: '-3', value: -3 },
  { label: '-2', value: -2 },
  { label: '-1', value: -1 },
  { label: '+0', value: 0 },
  { label: '+1', value: 1 },
  { label: '+2', value: 2 },
  { label: '+3', value: 3 },
  { label: '+4', value: 4 },
  { label: '+5', value: 5 },
  { label: '+6', value: 6 },
  { label: '+7', value: 7 },
];

export const DATA_STATUS = {
  pending: 'PENDING',
  forbidden: 'FORBIDDEN',
  success: 'SUCCESS',
  failure: 'FAILURE',
  caching: 'CACHING',
};

export const INHERIT_GROUPING = {
  yes: 'yes',
  no: 'no',
};

export const DATA_LOAD_MODE = {
  update: 'UPDATE',
  cacheRefresh: 'CACHE_REFRESH',
};

export const FORMULA_CONFIG_KEYS = {
  filters: 'filters',
  calculation_params: 'calculation_params',
  groupings: 'groupings',
};

export const LOADER_LEVEL = {
  PENDING: 'PENDING',
  CACHING: 'CACHING',
};

export const NO_GROUPING = 'no_grouping';
export const EDIT_GROUPING_KEY = '0';

export const NOT_AVAILABLE = { label: 'not_available', value: 'N/A' };
export const DASH = '-';

// @flow
import { calendarFiltersApi } from './services/filters';
import filtersReducer from './slices/filters';
import { reducerKey } from './consts';

export default {
  calendarFiltersApi: calendarFiltersApi.reducer,
  [reducerKey]: filtersReducer,
};

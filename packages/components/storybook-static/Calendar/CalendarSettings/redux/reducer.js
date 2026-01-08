// @flow
import { calendarSettingsApi } from './services/settings';
import filtersReducer from './slices/settings';
import { reducerKey } from './consts';

export default {
  calendarSettingsApi: calendarSettingsApi.reducer,
  [reducerKey]: filtersReducer,
};

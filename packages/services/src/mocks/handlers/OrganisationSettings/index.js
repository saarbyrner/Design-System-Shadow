// @flow
import CalendarSettingsHandlers from './CalendarSettings';
import LocationSettingsHandlers from './LocationSettings';
import DynamicCohortsHandlers from './DynamicCohorts';

export default [
  ...CalendarSettingsHandlers,
  ...LocationSettingsHandlers,
  ...DynamicCohortsHandlers,
];

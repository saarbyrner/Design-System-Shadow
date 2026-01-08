// @flow
import { reducerKey } from './consts';

export type WeekStartDay =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export type Settings = {
  weekStartDay: WeekStartDay,
  dayStartingHour: string,
  dayEndingHour: string,
  defaultEventDurationMins: number,
};

export type SettingsState = {
  settings: Settings,
};

export type Store = {
  [typeof reducerKey]: SettingsState,
};

export type SettingsKey = $Keys<Settings>;
export type SettingsValue = $Values<Settings>;

export type SetSettingsActionPayload = {
  key: SettingsKey,
  value: SettingsValue,
};

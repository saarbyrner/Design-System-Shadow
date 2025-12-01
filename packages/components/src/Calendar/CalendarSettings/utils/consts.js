// @flow

import moment from 'moment';

import type { Settings, WeekStartDay } from '../redux/types';

export const calendarSettingsTabHref =
  '/administration/organisation/edit#Calendar';
export const settingsButtonTestId = 'CalendarHeader|SettingsButton';

const defaultDayStartingHour = moment().set({ hour: 8, minute: 0 }).toString();

const defaultDayEndingHour = moment().set({ hour: 18, minute: 0 }).toString();

export const initialSettings: Settings = {
  weekStartDay: 'Monday',
  dayStartingHour: defaultDayStartingHour,
  dayEndingHour: defaultDayEndingHour,
  defaultEventDurationMins: 30,
};

export const weekStartDays: Array<WeekStartDay> = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const weekDayToNumberMap: {
  [key: WeekStartDay]: 1 | 2 | 3 | 4 | 5 | 6 | 7,
} = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
};

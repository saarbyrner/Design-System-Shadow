// @flow

import moment from 'moment';
import { weekStartDays } from './consts';
import type { WeekStartDay } from '../redux/types';

export const checkDefaultEventDurationValidity = (
  defaultEventDuration: number
) => defaultEventDuration > 0;

export const checkWeekStartDayValidity = (weekStartDay: WeekStartDay) =>
  weekStartDays.includes(weekStartDay);

type CheckHoursValidity = {
  dayStartingHour: moment,
  dayEndingHour: moment,
};

export const checkHoursValidity = ({
  dayEndingHour,
  dayStartingHour,
}: CheckHoursValidity) => dayStartingHour.isBefore(dayEndingHour);

// @flow

import { RRule, type Weekday } from 'rrule';
import moment from 'moment-timezone';

import type { Translation } from '@kitman/common/src/types/i18n';
import { getDaysOfWeekTranslated } from './translation-helpers';


export const getDayStringAndRRuleDayEnum = (
  eventDate: typeof moment,
  t: Translation
): { dayString: string, rruleDayEnum: Weekday } => {
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    getDaysOfWeekTranslated(t);
  const dayNum = eventDate.day();
  switch (dayNum) {
    case 0:
      return { dayString: sunday, rruleDayEnum: RRule.SU };
    case 1:
      return { dayString: monday, rruleDayEnum: RRule.MO };
    case 2:
      return { dayString: tuesday, rruleDayEnum: RRule.TU };
    case 3:
      return { dayString: wednesday, rruleDayEnum: RRule.WE };
    case 4:
      return { dayString: thursday, rruleDayEnum: RRule.TH };
    case 5:
      return { dayString: friday, rruleDayEnum: RRule.FR };
    case 6:
      return { dayString: saturday, rruleDayEnum: RRule.SA };
    default:
      return { dayString: '', rruleDayEnum: '' };
  }
};


export const getMonthStringAndNumberOfDays = (
  eventDate: typeof moment,
  t: Translation
): { monthString: string, numberOfDaysInMonth: number } => {
  const monthNumStartsFrom0 = eventDate.month();
  switch (monthNumStartsFrom0) {
    case 0:
      return { monthString: t('January'), numberOfDaysInMonth: 31 };
    case 1:
      return {
        monthString: t('February'),
        numberOfDaysInMonth: eventDate.isLeapYear() ? 29 : 28,
      };
    case 2:
      return { monthString: t('March'), numberOfDaysInMonth: 31 };
    case 3:
      return { monthString: t('April'), numberOfDaysInMonth: 30 };
    case 4:
      return { monthString: t('May'), numberOfDaysInMonth: 31 };
    case 5:
      return { monthString: t('June'), numberOfDaysInMonth: 30 };
    case 6:
      return { monthString: t('July'), numberOfDaysInMonth: 31 };
    case 7:
      return { monthString: t('August'), numberOfDaysInMonth: 31 };
    case 8:
      return { monthString: t('September'), numberOfDaysInMonth: 30 };
    case 9:
      return { monthString: t('October'), numberOfDaysInMonth: 31 };
    case 10:
      return { monthString: t('November'), numberOfDaysInMonth: 30 };
    case 11:
      return { monthString: t('December'), numberOfDaysInMonth: 31 };
    default:
      return { monthString: '', numberOfDaysInMonth: 0 };
  }
};

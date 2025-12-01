// @flow
import { RRule, Frequency, Weekday, Options } from 'rrule';
import moment from 'moment-timezone';
import { isEqual } from 'lodash';

import { type Translation } from '@kitman/common/src/types/i18n';
import {
  getDayStringAndRRuleDayEnum,
  getMonthStringAndNumberOfDays,
} from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/date-helpers';
import { everyWeekdayArray } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/consts';
import { getDaysOfWeekTranslated } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/translation-helpers';

import { dayNumStringToDayStringKeyMap, defaultRepeatOnDays } from './consts';
import {
  type RepeatOnDays,
  type CustomConfig,
  type EndsConfig,
  type RepeatEveryConfig,
} from './types';

export const getDayString = (date: typeof moment): string => {
  const dayNum = date.day();
  return dayNumStringToDayStringKeyMap[dayNum.toString()];
};

export const getDefaultCustomConfig = (
  eventDate: typeof moment
): CustomConfig => {
  const dayString = getDayString(eventDate);
  return {
    repeatEvery: {
      interval: '1',
      frequency: Frequency.WEEKLY,
    },
    repeatOnDays: { ...defaultRepeatOnDays, [dayString]: true },
    ends: {
      never: true,
      on: {
        isSelected: false,
        date: eventDate,
      },
      after: {
        isSelected: false,
        numberOfOccurrences: null,
      },
    },
  };
};

const getRepeatDaysArray = (
  repeatOnDays: RepeatOnDays
): Array<typeof Weekday> => {
  const daysArray: Array<typeof Weekday> = [];
  const { monday, friday, sunday, thursday, wednesday, tuesday, saturday } =
    repeatOnDays;
  if (monday) daysArray.push(RRule.MO);
  if (tuesday) daysArray.push(RRule.TU);
  if (wednesday) daysArray.push(RRule.WE);
  if (thursday) daysArray.push(RRule.TH);
  if (friday) daysArray.push(RRule.FR);
  if (saturday) daysArray.push(RRule.SA);
  if (sunday) daysArray.push(RRule.SU);
  return daysArray;
};

const getCountAndUntil = ({ never, after, on }: EndsConfig) => {
  if (never) {
    return { count: null, until: null };
  }
  if (on.isSelected) {
    return { count: null, until: on.date };
  }
  if (after.isSelected) {
    return { count: after.numberOfOccurrences, until: null };
  }
  return { count: null, until: null };
};

export const createRRuleFromModalConfig = (
  { repeatEvery: { interval, frequency }, repeatOnDays, ends }: CustomConfig,
  eventDate: typeof moment
): RRule => {
  const { count, until } = getCountAndUntil(ends);

  const rruleOptions: typeof Options = {
    freq: frequency,
    interval,
    dtstart: eventDate.toDate(),
    count,
    until,
  };

  if (frequency === Frequency.WEEKLY) {
    // This option is meaningful only with weekly frequency.
    rruleOptions.byweekday = getRepeatDaysArray(repeatOnDays);
  }

  return new RRule(rruleOptions);
};

const createEndsFromRRule = (
  count: number | null,
  until: typeof moment
): EndsConfig => {
  const ends: EndsConfig = {
    never: false,
    on: {
      isSelected: false,
      date: until,
    },
    after: {
      isSelected: false,
      numberOfOccurrences: count,
    },
  };
  if (count && until) {
    throw new Error('count cannot coexist with until');
  }
  if (count) {
    ends.after.isSelected = true;
  } else if (until) {
    ends.on.isSelected = true;
  } else {
    ends.never = true;
  }
  return ends;
};

const weekdayEnumToDayKeyMap: { [key: typeof Weekday]: $Keys<RepeatOnDays> } = {
  [RRule.MO.weekday]: 'monday',
  [RRule.TU.weekday]: 'tuesday',
  [RRule.WE.weekday]: 'wednesday',
  [RRule.TH.weekday]: 'thursday',
  [RRule.FR.weekday]: 'friday',
  [RRule.SA.weekday]: 'saturday',
  [RRule.SU.weekday]: 'sunday',
};

const createRepeatOnDaysFromRRule = (
  selectedWeekDays: Array<typeof Weekday>
): RepeatOnDays => {
  const repeatOnDays = { ...defaultRepeatOnDays };

  if (selectedWeekDays) {
    selectedWeekDays.forEach((dayEnum) => {
      const dayKey = weekdayEnumToDayKeyMap[dayEnum.weekday];
      repeatOnDays[dayKey] = true;
    });
  }
  return repeatOnDays;
};

export const createModalConfigFromRRule = ({
  origOptions,
}: RRule): CustomConfig => {
  const {
    freq,
    interval = '',
    byweekday: selectedWeekDays,
    count,
    until,
  } = origOptions;
  const repeatEvery: RepeatEveryConfig = { interval, frequency: freq };
  const repeatOnDays = createRepeatOnDaysFromRRule(selectedWeekDays);

  const ends = createEndsFromRRule(count, until ? moment(until) : null);

  return { repeatEvery, repeatOnDays, ends };
};

const getDateParts = (date: typeof moment, t: Translation) => {
  const day = date.date();
  const year = date.year();

  const { monthString } = getMonthStringAndNumberOfDays(date, t);
  return { day, year, monthString };
};

export const getDateEnding = (day: number) => {
  const convertedDay = day.toString();
  const lastChar = convertedDay.slice(-1);
  const isBetweenTenAndTwenty = +convertedDay > 10 && +convertedDay < 20;

  if (isBetweenTenAndTwenty) {
    return `${convertedDay}th`;
  }
  switch (+lastChar) {
    case 1:
      return `${convertedDay}st`;
    case 2:
      return `${convertedDay}nd`;
    case 3:
      return `${convertedDay}rd`;
    default:
      return `${convertedDay}th`;
  }
};

type GetWeeklyInterpolatedText = {
  interval: string,
  t: Translation,
  repeatOnDays: RepeatOnDays,
};

const getWeeklyInterpolatedText = ({
  interval,
  t,
  repeatOnDays,
}: GetWeeklyInterpolatedText) => {
  const dayTranslations = getDaysOfWeekTranslated(t);
  const translatedSelectedDays: Array<string> = Object.entries(repeatOnDays)
    .filter(([, isDaySelected]) => isDaySelected)
    .map(([dayKey]) => dayTranslations[dayKey]);
  const repeatOnDaysString = translatedSelectedDays
    .slice(1)
    .reduce(
      (prevText, dayKey) => `${prevText}, ${dayKey}`,
      translatedSelectedDays[0]
    );
  if (Number.parseInt(interval, 10) === 1 || !interval) {
    return t('Every {{repeatOnDaysString}}', {
      repeatOnDaysString, // already translated
    });
  }
  return t('Every {{interval}} weeks on {{repeatOnDaysString}}', {
    repeatOnDaysString, // already translated
    interval, // number
  });
};

const getDailyInterpolatedText = (interval: string, t: Translation) => {
  if (Number.parseInt(interval, 10) === 1 || !interval) {
    return t('Every day');
  }
  return t('Every {{interval}} days', { interval });
};

type TGetMonthlyInterpolatedText = {
  interval: string,
  t: Translation,
  day: number,
  repeatOnDays: RepeatOnDays,
  nthDay: ?number,
};

const getNthDayString = (nthDay: number, t: Translation) => {
  switch (nthDay) {
    case 1:
      return t('Every first');
    case 2:
      return t('Every second');
    case 3:
      return t('Every third');
    case 4:
      return t('Every fourth');
    case -1:
    default:
      return t('Every last');
  }
};

const getMonthlyInterpolatedText = ({
  interval,
  t,
  day,
  repeatOnDays,
  nthDay,
}: TGetMonthlyInterpolatedText) => {
  const dayTranslations = getDaysOfWeekTranslated(t);

  if (nthDay) {
    const nthDayString = getNthDayString(nthDay, t);
    const selectedDay = Object.entries(repeatOnDays)
      .filter(([, isDaySelected]) => isDaySelected)
      .map(([dayKey]) => dayTranslations[dayKey]);

    return t('{{nthDayString}} {{selectedDay}} of the month', {
      nthDayString,
      selectedDay,
    });
  }
  if (Number.parseInt(interval, 10) === 1 || !interval) {
    return t('Every month on the {{day}}', {
      day: getDateEnding(day),
    });
  }
  return t('Every {{interval}} months on the {{day}}', {
    day: getDateEnding(day),
    interval,
  });
};

type TGetYearlyInterpolatedText = {
  interval: string,
  t: Translation,
  eventDate: typeof moment,
};

const getYearlyInterpolatedText = ({
  interval,
  t,
  eventDate,
}: TGetYearlyInterpolatedText) => {
  const { monthString, day } = getDateParts(eventDate, t);
  if (Number.parseInt(interval, 10) === 1 || !interval) {
    return t('Every year on {{monthString}} {{day}}', {
      monthString,
      day: getDateEnding(day),
    });
  }
  return t('Every {{interval}} years on {{monthString}} {{day}}', {
    monthString,
    day: getDateEnding(day),
    interval,
  });
};

type GetInitialInterpolatedText = {
  repeatOnDays: RepeatOnDays,
  repeatEvery: RepeatEveryConfig,
  t: Translation,
  eventDate: typeof moment,
  nthDay: ?number,
};

const getInitialInterpolatedText = ({
  repeatOnDays,
  repeatEvery: { interval, frequency },
  t,
  eventDate,
  nthDay,
}: GetInitialInterpolatedText) => {
  if (frequency === Frequency.WEEKLY) {
    return getWeeklyInterpolatedText({ interval, t, repeatOnDays });
  }
  if (frequency === Frequency.DAILY) {
    return getDailyInterpolatedText(interval, t);
  }
  if (frequency === Frequency.MONTHLY) {
    return getMonthlyInterpolatedText({
      interval,
      t,
      day: eventDate?.date(),
      repeatOnDays,
      nthDay,
    });
  }
  if (frequency === Frequency.YEARLY) {
    return getYearlyInterpolatedText({ interval, t, eventDate });
  }
  return '';
};

const interpolateEndsText = ({ after, on }: EndsConfig, t: Translation) => {
  const { isSelected: isAfterSelected, numberOfOccurrences } = after;
  const { isSelected: isOnSelected, date } = on;

  if (isAfterSelected && numberOfOccurrences) {
    return t('{{numberOfOccurrences}} times', { numberOfOccurrences });
  }

  if (isOnSelected && date) {
    const { day, monthString, year } = getDateParts(date, t);
    return t('until {{day}} {{monthString}}, {{year}}', {
      day: getDateEnding(day),
      monthString,
      year,
    });
  }
  // This return should be never reached.
  return '';
};

export const interpolateRRuleIntoDisplayableText = (
  rrule: RRule,
  t: Translation,
  eventDate: typeof moment
) => {
  const { repeatEvery, repeatOnDays, ends } = createModalConfigFromRRule(rrule);

  const interpolatedEndsText = interpolateEndsText(ends, t);
  const { byweekday: selectedWeekDays } = rrule.origOptions;

  let interpolatedText = getInitialInterpolatedText({
    repeatEvery,
    repeatOnDays,
    t,
    eventDate,
    nthDay: selectedWeekDays?.[0].n,
  });

  if (interpolatedEndsText.length > 0) {
    interpolatedText += `, ${interpolatedEndsText}`; // already translated
  }

  return interpolatedText;
};

type CheckIsRuleCustomWeekly = {
  byweekday: Array<typeof Weekday>,
  eventDate: typeof moment,
  t: Translation,
};

const checkIsRuleCustomWeekly = ({
  byweekday,
  eventDate,
  t,
}: CheckIsRuleCustomWeekly) => {
  if (byweekday.length > 1) {
    if (isEqual(byweekday, everyWeekdayArray)) {
      // equivalent to every weekday, not custom
      return false;
    }
    return true;
  }

  const { rruleDayEnum } = getDayStringAndRRuleDayEnum(eventDate, t);
  const isEventDaySelected = byweekday.includes(rruleDayEnum);
  if (!isEventDaySelected) {
    return true; // there is only one day selected, and it is not the day of the event.
  }
  return false;
};

export const isRRuleCustom = (
  rrule: RRule | string,
  t: Translation,
  eventDate: typeof moment
): boolean => {
  const { origOptions } =
    typeof rrule === 'string' ? RRule.fromString(rrule) : rrule;
  const { until, count, freq, interval, byweekday, dtstart } = origOptions;
  if (until) {
    return true;
  }
  if (count) {
    return true;
  }
  if (interval > 1) {
    return true;
  }
  if (freq === Frequency.WEEKLY) {
    return dtstart
      ? checkIsRuleCustomWeekly({ eventDate, t, byweekday })
      : false;
  }
  return false; // the rrule is equivalent to one of the pre-defined options of the select (besides every weekday)
};

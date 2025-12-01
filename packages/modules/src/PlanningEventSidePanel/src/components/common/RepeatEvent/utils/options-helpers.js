// @flow

import { Frequency, RRule, Weekday } from 'rrule';
import { isEqual } from 'lodash';
import moment from 'moment-timezone';

import { type Option } from '@kitman/components/src/Select';
import { type Translation } from '@kitman/common/src/types/i18n';

import { interpolateRRuleIntoDisplayableText } from '../RepeatEventCustomConfigModal/utils/config-helpers';
import {
  customOptionValue,
  defaultOptionValue,
  everyWeekdayArray,
} from './consts';
import {
  getDayStringAndRRuleDayEnum,
  getMonthStringAndNumberOfDays,
} from './date-helpers';
import { getWeekDayOrdinal } from './translation-helpers';
import { type WeekNum } from './types';

const numberOfDaysInWeek = 7;
const maxNumberOfPossibleWeeksInMonth = 5;

const calculateWeekNum = (dateDayNum: number): WeekNum =>
  ((Math.floor(dateDayNum / numberOfDaysInWeek) + 1: any): WeekNum);

type CalculateIsLastWeekOfMonth = {
  weekNum: number,
  dateDayNum: number,
  numberOfDaysInMonth: number,
};

const calculateIsLastWeekOfMonth = ({
  weekNum,
  dateDayNum,
  numberOfDaysInMonth,
}: CalculateIsLastWeekOfMonth) =>
  weekNum === maxNumberOfPossibleWeeksInMonth ||
  dateDayNum + numberOfDaysInWeek > numberOfDaysInMonth;

export const getDefaultOption = (t: Translation): Option => ({
  label: t("Doesn't repeat"),
  value: defaultOptionValue,
});

const createDailyRule = (eventDate: typeof moment) =>
  new RRule({
    freq: RRule.DAILY,
    dtstart: eventDate.toDate(),
  });

const createSpecificDayWeeklyRule = (
  rruleDayEnum: typeof Weekday,
  eventDate: typeof moment
) =>
  new RRule({
    freq: RRule.WEEKLY,
    byweekday: [rruleDayEnum],
    dtstart: eventDate.toDate(),
  });

type CreateMonthOnWeekdayOnWeekNumRule = {
  rruleDayEnum: typeof Weekday,
  weekNum: WeekNum,
  isLastWeekOfMonth: boolean,
  eventDate: typeof moment,
};

const createMonthOnWeekdayOnWeekNumRule = ({
  rruleDayEnum,
  weekNum,
  isLastWeekOfMonth,
  eventDate,
}: CreateMonthOnWeekdayOnWeekNumRule) =>
  new RRule({
    freq: RRule.MONTHLY,
    byweekday: [rruleDayEnum.nth(isLastWeekOfMonth ? -1 : weekNum)],
    dtstart: eventDate.toDate(),
  });

const createAnnualOnDateRule = (eventDate: typeof moment) =>
  new RRule({ freq: RRule.YEARLY, dtstart: eventDate.toDate() });

const createEveryWeekdayRule = (eventDate: typeof moment) =>
  new RRule({
    freq: RRule.WEEKLY,
    byweekday: everyWeekdayArray,
    dtstart: eventDate.toDate(),
  });

export const getOptions = (
  eventDate: typeof moment,
  t: Translation,
  customConfigRRule?: RRule
): Array<Option> => {
  const { dayString, rruleDayEnum } = getDayStringAndRRuleDayEnum(eventDate, t);

  const { monthString, numberOfDaysInMonth } = getMonthStringAndNumberOfDays(
    eventDate,
    t
  );

  const isWeekday = ![RRule.SA, RRule.SU].includes(rruleDayEnum);

  const dateDayNum = eventDate.date();
  const weekNum = calculateWeekNum(dateDayNum);
  const isLastWeekOfMonth = calculateIsLastWeekOfMonth({
    dateDayNum,
    numberOfDaysInMonth,
    weekNum,
  });

  const weekNumOrdinal = getWeekDayOrdinal({ weekNum, t, isLastWeekOfMonth });

  return [
    getDefaultOption(t),

    { label: t('Daily'), value: createDailyRule(eventDate) },
    {
      label: t('Weekly on {{dayString}}', { dayString }),

      value: createSpecificDayWeeklyRule(rruleDayEnum, eventDate),
    },
    {
      label: t('Monthly on the {{weekNumOrdinal}} {{dayString}}', {
        dayString,
        weekNumOrdinal,
      }),

      value: createMonthOnWeekdayOnWeekNumRule({
        rruleDayEnum,
        weekNum,
        isLastWeekOfMonth,
        eventDate,
      }),
    },
    {
      label: t('Annually on {{monthString}} {{dateDayNum}}', {
        monthString,
        dateDayNum,
      }),

      value: createAnnualOnDateRule(eventDate),
    },
    ...(isWeekday
      ? [
          {
            label: t('Every weekday'),

            value: createEveryWeekdayRule(eventDate),
          },
        ]
      : []),
    ...(customConfigRRule
      ? [
          {
            label: interpolateRRuleIntoDisplayableText(
              customConfigRRule,
              t,
              eventDate
            ),
            value: customConfigRRule,
          },
        ]
      : []),
    {
      label: customConfigRRule ? t('New custom') : t('Custom'),
      value: customOptionValue,
    },
  ];
};

type GetTransformedMonthlyRule = {
  eventDate: typeof moment,
  t: Translation,
  rruleDayEnum: typeof Weekday,
};

const getTransformedMonthlyRule = ({
  eventDate,
  t,
  rruleDayEnum,
}: GetTransformedMonthlyRule) => {
  const { numberOfDaysInMonth } = getMonthStringAndNumberOfDays(eventDate, t);

  const dateDayNum = eventDate.date();
  const weekNum = calculateWeekNum(dateDayNum);
  const isLastWeekOfMonth = calculateIsLastWeekOfMonth({
    weekNum,
    dateDayNum,
    numberOfDaysInMonth,
  });

  return createMonthOnWeekdayOnWeekNumRule({
    eventDate,
    weekNum,
    rruleDayEnum,
    isLastWeekOfMonth,
  });
};

type GetTransformedWeeklyRule = {
  byweekday: Array<Weekday> | void,
  eventDate: typeof moment,
  rruleDayEnum: typeof Weekday,
  rrule: RRule,
};

const getTransformedWeeklyRule = ({
  byweekday,
  eventDate,
  rruleDayEnum,
  rrule,
}: GetTransformedWeeklyRule) => {
  if (isEqual(byweekday, everyWeekdayArray)) {
    return createEveryWeekdayRule(eventDate);
  }
  if (!byweekday || byweekday.length > 1) {
    // shouldn't happen
    throw new Error(`Sent custom config ${rrule.toString()}`);
  }

  return createSpecificDayWeeklyRule(rruleDayEnum, eventDate);
};

export const transformCustomRRuleToItsNonCustomEquivalent = (
  rrule: RRule,
  t: Translation,
  eventDate: typeof moment
) => {
  const { freq, byweekday } = rrule.origOptions;

  const { rruleDayEnum } = getDayStringAndRRuleDayEnum(eventDate, t);
  if (freq === Frequency.MONTHLY) {
    return getTransformedMonthlyRule({ rruleDayEnum, eventDate, t });
  }
  if (freq === Frequency.WEEKLY) {
    return getTransformedWeeklyRule({
      byweekday,
      eventDate,
      rrule,
      rruleDayEnum,
    });
  }

  return new RRule({ dtstart: eventDate.toDate(), freq }); // yearly and daily are defined as such
};

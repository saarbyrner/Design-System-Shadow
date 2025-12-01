// @flow
import { Frequency, RRule, type RRule as RRuleType } from 'rrule';
import moment from 'moment-timezone';

import type { Translation } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/components/src/Select';
import { keyboardkeys } from '@kitman/common/src/variables';
import { POSITIVE_NUMERIC_REGEX } from '@kitman/common/src/consts/regex';
import type { EventFormData } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import { getDaysOfWeekTranslated } from '../../utils/translation-helpers';
import type { Translations, RepeatOnDays } from './types';

export const getRepeatEveryTranslations = (t: Translation) => ({
  repeatEvery: t('Repeat every'),
  days: t('days'),
  day: t('day'),
  weeks: t('weeks'),
  week: t('week'),
  months: t('months'),
  month: t('month'),
  years: t('years'),
  year: t('year'),
});

export const getRepeatOnTranslations = (t: Translation) => ({
  repeatOn: t('Repeat on'),
  ...getDaysOfWeekTranslated(t),
});

export const getEndsTranslations = (t: Translation) => ({
  ends: t('Ends'),
  never: t('Never'),
  on: t('On'),
  after: t('After'),
  times: t('Times'),
});

export const getModalBaseTranslations = (t: Translation) => ({
  title: t('Custom'),
  cancel: t('Cancel'),
  done: t('Done'),
});

export const getAllCustomModalTranslations = (t: Translation) => ({
  ...getModalBaseTranslations(t),
  ...getRepeatEveryTranslations(t),
  ...getRepeatOnTranslations(t),
  ...getEndsTranslations(t),
});

export const getFrequencyToLabelMap = (t: Translation) => {
  const repeatEveryTranslations = getRepeatEveryTranslations(t);
  return {
    [Frequency.DAILY]: {
      singular: repeatEveryTranslations.day,
      plural: repeatEveryTranslations.days,
    },
    [Frequency.WEEKLY]: {
      singular: repeatEveryTranslations.week,
      plural: repeatEveryTranslations.weeks,
    },
    [Frequency.MONTHLY]: {
      singular: repeatEveryTranslations.month,
      plural: repeatEveryTranslations.months,
    },
    [Frequency.YEARLY]: {
      singular: repeatEveryTranslations.year,
      plural: repeatEveryTranslations.years,
    },
  };
};

export const getRepeatEveryOptions = (
  translations: Translations,
  interval: string
): Array<Option> => {
  const mustUsePlural = Number.parseInt(interval, 10) > 1;
  return [
    {
      label: mustUsePlural ? translations.days : translations.day,
      value: Frequency.DAILY,
    },
    {
      label: mustUsePlural ? translations.weeks : translations.week,
      value: Frequency.WEEKLY,
    },
    {
      label: mustUsePlural ? translations.months : translations.month,
      value: Frequency.MONTHLY,
    },
    {
      label: mustUsePlural ? translations.years : translations.year,
      value: Frequency.YEARLY,
    },
  ];
};

export const isInvalidNumberForNumericInput = (num: string | number) => {
  if (typeof num === 'string') {
    return Number.parseInt(num, 10) === 0 || num === '';
  }
  if (typeof num === 'number') {
    return num === 0;
  }
  return false;
};

export const isInvalidRepeatOnConfig = (repeatOnConfig: RepeatOnDays) => {
  return Object.values(repeatOnConfig).every((isDaySelected) => !isDaySelected);
};

export const regenerateRRuleWithUpdatedDateTime = (
  previousRRule: RRuleType,
  startTime: Date
) => {
  const { origOptions } = previousRRule;
  return new RRule({
    ...origOptions,
    // Date needs to be in UTC for RRule to function properly
    // https://github.com/jkbrzt/rrule?tab=readme-ov-file#important-use-utc-dates
    dtstart: moment(startTime).utc().toDate(),
  });
};

export const isValidForPositiveInteger = (key: string) => {
  const validKeyCodes = [
    keyboardkeys.backspace,
    keyboardkeys.delete,
    keyboardkeys.tab,
    keyboardkeys.esc,
    keyboardkeys.enter,
    keyboardkeys.upArrow,
    keyboardkeys.rightArrow,
    keyboardkeys.downArrow,
    keyboardkeys.leftArrow,
  ];
  if (
    validKeyCodes.some((code) => key === code) ||
    POSITIVE_NUMERIC_REGEX.test(key)
  ) {
    return true;
  }

  return false;
};

export const getRemainingDaysInRecurrence = (
  event: EventFormData
): number | null => {
  let remainder = null;
  if (
    event.recurrence &&
    event.recurrence.rule &&
    Array.isArray(event.recurrence.rrule_instances)
  ) {
    event.recurrence.rrule_instances.forEach((instance, index) => {
      if (
        moment(instance).toISOString() ===
        moment(event.start_time).toISOString()
      ) {
        // rrule_instance is an array
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-use]
        remainder = event.recurrence.rrule_instances.length - index;
      }
    });
    return remainder;
  }
  return null;
};

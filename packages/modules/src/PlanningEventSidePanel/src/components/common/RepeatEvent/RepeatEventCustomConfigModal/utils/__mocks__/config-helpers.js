// @flow

import { RRule, Frequency } from 'rrule';
import moment from 'moment-timezone';

import { defaultRepeatOnDays } from '../consts';
import type { CustomConfig } from '../types';
import { everyWeekdayArray } from '../../../utils/consts';

export const eventDate = moment(new Date(2023, 11, 4)); // December 4th, 2023, a Monday

export const expectedDefaultConfig = {
  repeatEvery: {
    interval: '1',
    frequency: Frequency.WEEKLY,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
    monday: true,
  },
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

const every4DaysAfter21OccurrencesInterval = '4';
const every4DaysAfter21OccurrencesNumberOfOccurrences = 21;
const every4DaysAfter21OccurrencesFrequency = Frequency.DAILY;

export const every4DaysAfter21OccurrencesConfig: CustomConfig = {
  repeatEvery: {
    interval: every4DaysAfter21OccurrencesInterval,
    frequency: every4DaysAfter21OccurrencesFrequency,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: {
    never: false,
    on: {
      isSelected: false,
      date: null,
    },
    after: {
      isSelected: true,
      numberOfOccurrences: every4DaysAfter21OccurrencesNumberOfOccurrences,
    },
  },
};

export const every4DaysAfter21OccurrencesRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: every4DaysAfter21OccurrencesFrequency,
  interval: every4DaysAfter21OccurrencesInterval,
  count: every4DaysAfter21OccurrencesNumberOfOccurrences,
  until: null,
});

export const every4DaysAfter21OccurrencesInterpolatedText = `Every ${every4DaysAfter21OccurrencesInterval} days, ${every4DaysAfter21OccurrencesNumberOfOccurrences} times`;

const every3MonthsUntil1June2026Interval = '3';
const firstJune2026Date = moment(new Date(2026, 5, 1)); // June 1st, 2026
const every3MonthsUntil1June2026Frequency = Frequency.MONTHLY;

export const every3MonthsUntil1June2026Config: CustomConfig = {
  repeatEvery: {
    interval: every3MonthsUntil1June2026Interval,
    frequency: every3MonthsUntil1June2026Frequency,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: {
    never: false,
    on: {
      isSelected: true,
      date: firstJune2026Date,
    },
    after: {
      isSelected: false,
      numberOfOccurrences: null,
    },
  },
};

export const every3MonthsUntil1June2026RRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: every3MonthsUntil1June2026Frequency,
  interval: every3MonthsUntil1June2026Interval,
  count: null,
  until: firstJune2026Date,
});

export const every3MonthsUntil1June2026InterpolatedText = `Every ${every3MonthsUntil1June2026Interval} months on the 4th, until 1st June, 2026`;

const every2YearsNeverEndingInterval = '2';
const every2YearsNeverEndingFrequency = Frequency.YEARLY;

export const every2YearsNeverEndingConfig: CustomConfig = {
  repeatEvery: {
    interval: every2YearsNeverEndingInterval,
    frequency: every2YearsNeverEndingFrequency,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: {
    never: true,
    on: {
      isSelected: false,
      date: null,
    },
    after: {
      isSelected: false,
      numberOfOccurrences: null,
    },
  },
};

export const every2YearsNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: every2YearsNeverEndingFrequency,
  interval: every2YearsNeverEndingInterval,
  count: null,
  until: null,
});

export const every2YearsNeverEndingInterpolatedText = `Every ${every2YearsNeverEndingInterval} years on December 4th`;

const everyWeekOnMondayTuesdayThursdayNeverEndingInterval = '1';
const everyWeekOnMondayTuesdayThursdayNeverEndingFrequency = Frequency.WEEKLY;

export const everyWeekOnMondayTuesdayThursdayNeverEndingConfig: CustomConfig = {
  repeatEvery: {
    interval: everyWeekOnMondayTuesdayThursdayNeverEndingInterval,
    frequency: everyWeekOnMondayTuesdayThursdayNeverEndingFrequency,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
    monday: true,
    tuesday: true,
    thursday: true,
  },
  ends: {
    never: true,
    on: {
      isSelected: false,
      date: null,
    },
    after: {
      isSelected: false,
      numberOfOccurrences: null,
    },
  },
};

export const everyWeekOnMondayTuesdayThursdayNeverEndingRRule: RRule =
  new RRule({
    dtstart: eventDate.toDate(),
    byweekday: [RRule.MO, RRule.TU, RRule.TH],
    freq: everyWeekOnMondayTuesdayThursdayNeverEndingFrequency,
    interval: everyWeekOnMondayTuesdayThursdayNeverEndingInterval,
    count: null,
    until: null,
  });

export const everyWeekOnMondayTuesdayThursdayNeverEndingInterpolatedText =
  'Every Monday, Tuesday, Thursday';

export const every2WeeksOnMondayTuesdayThursdayNeverEndingInterval = 2;

export const every2WeeksOnMondayTuesdayThursdayNeverEndingRRule: RRule =
  new RRule({
    dtstart: eventDate.toDate(),
    byweekday: [RRule.MO, RRule.TU, RRule.TH],
    freq: RRule.WEEKLY,
    interval: every2WeeksOnMondayTuesdayThursdayNeverEndingInterval,
    count: null,
    until: null,
  });

export const every2WeeksOnMondayTuesdayThursdayNeverEndingInterpolatedText = `Every ${every2WeeksOnMondayTuesdayThursdayNeverEndingInterval} weeks on Monday, Tuesday, Thursday`;

export const everyDayUntil1June2026Interval = 1;

export const everyDayUntil1June2026RRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.DAILY,
  interval: everyDayUntil1June2026Interval,
  count: null,
  until: firstJune2026Date,
});

export const everyDayUntil1June2026InterpolatedText = `Every day, until 1st June, 2026`;

export const everyYearAfter15OccurrencesInterval = 1;
export const everyYearAfter15OccurrencesNumberOfOccurrences = 15;

export const everyYearAfter15OccurrencesRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.YEARLY,
  interval: everyYearAfter15OccurrencesInterval,
  count: everyYearAfter15OccurrencesNumberOfOccurrences,
  until: null,
});

export const everyYearAfter15OccurrencesInterpolatedText = `Every year on December 4th, ${everyYearAfter15OccurrencesNumberOfOccurrences} times`;

export const everyMonthNeverEndingInterval = 1;

export const everyMonthNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.MONTHLY,
  interval: everyMonthNeverEndingInterval,
  count: null,
  until: null,
});

export const everyMonthNeverEndingInterpolatedText = `Every month on the 4th`;

export const firstDayOfMonthMonthNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.MONTHLY,
  byweekday: [{ ...RRule.MO, n: 1 }],
  interval: everyMonthNeverEndingInterval,
  count: null,
  until: null,
});

export const firstDayOfMonthMonthNeverEndingInterpolatedText = `Every first Monday of the month`;

export const secondDayOfMonthMonthNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.MONTHLY,
  byweekday: [{ ...RRule.MO, n: 2 }],
  interval: everyMonthNeverEndingInterval,
  count: null,
  until: null,
});

export const secondDayOfMonthMonthNeverEndingInterpolatedText = `Every second Monday of the month`;

export const thirdDayOfMonthMonthNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.MONTHLY,
  byweekday: [{ ...RRule.MO, n: 3 }],
  interval: everyMonthNeverEndingInterval,
  count: null,
  until: null,
});

export const thirdDayOfMonthMonthNeverEndingInterpolatedText = `Every third Monday of the month`;

export const fourthDayOfMonthMonthNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.MONTHLY,
  byweekday: [{ ...RRule.MO, n: 4 }],
  interval: everyMonthNeverEndingInterval,
  count: null,
  until: null,
});

export const fourthDayOfMonthMonthNeverEndingInterpolatedText = `Every fourth Monday of the month`;

export const lastDayOfMonthMonthNeverEndingRRule: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: RRule.MONTHLY,
  byweekday: [{ ...RRule.MO, n: -1 }],
  interval: everyMonthNeverEndingInterval,
  count: null,
  until: null,
});

export const lastDayOfMonthMonthNeverEndingInterpolatedText = `Every last Monday of the month`;

export const everyWeekWithoutIntervalWithUntil: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.WEEKLY,
  byweekday: [RRule.MO],
  interval: null,
  count: null,
  until: firstJune2026Date,
});

export const everyWeekWithoutIntervalInterpolatedText =
  'Every Monday, until 1st June, 2026';

export const everyDayWithoutIntervalWithUntil: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.DAILY,
  interval: null,
  count: null,
  until: firstJune2026Date,
});

export const everyDayWithoutIntervalInterpolatedText =
  'Every day, until 1st June, 2026';

export const everyMonthWithoutIntervalWithUntil: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.MONTHLY,
  interval: null,
  count: null,
  until: firstJune2026Date,
});

export const everyMonthWithoutIntervalInterpolatedText =
  'Every month on the 4th, until 1st June, 2026';

export const everyYearWithoutIntervalWithUntil: RRule = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.YEARLY,
  interval: null,
  count: null,
  until: firstJune2026Date,
});

export const everyYearWithoutIntervalInterpolatedText =
  'Every year on December 4th, until 1st June, 2026';

export const customRRuleWithUntil = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.DAILY,
  count: null,
  interval: 1,
  until: firstJune2026Date,
});

export const customRRuleWithCount = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.DAILY,
  count: 4,
  interval: 1,
  until: null,
});

export const customRRuleWithIntervalLargerThan1 = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.DAILY,
  count: null,
  interval: 2,
  until: null,
});

export const customRRuleEveryWeekday = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.WEEKLY,
  byweekday: everyWeekdayArray,
  count: null,
  interval: 1,
  until: null,
});

export const customRRuleWeeklyNotEveryWeekday = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.WEEKLY,
  byweekday: everyWeekdayArray.concat(RRule.SA),
  count: null,
  interval: 1,
  until: null,
});

export const customRRuleWeeklyEventDayNotSelected = new RRule({
  dtstart: eventDate.toDate(),
  freq: Frequency.WEEKLY,
  byweekday: [RRule.TH], // event day is Monday
  count: null,
  interval: 1,
  until: null,
});

export const nonCustomRRuleInStringForm = `DTSTART:20231114T105546Z
RRULE:FREQ=DAILY`;

export const weeklyRuleInStringFormWithoutDtstart = `FREQ=WEEKLY;BYDAY=MO`;

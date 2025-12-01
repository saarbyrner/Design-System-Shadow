// @flow
import { Frequency, RRule } from 'rrule';
import moment from 'moment-timezone';

import type { Option } from '@kitman/components/src/Select';

import { defaultOptionValue } from '../consts';
import { defaultRepeatOnDays } from '../../RepeatEventCustomConfigModal/utils/consts';
import { createRRuleFromModalConfig } from '../../RepeatEventCustomConfigModal/utils/config-helpers';
import type {
  CustomConfig,
  EndsConfig,
} from '../../RepeatEventCustomConfigModal/utils/types';

const defaultOption: Option = {
  label: "Doesn't repeat",
  value: defaultOptionValue,
};

const customOption: Option = {
  label: 'Custom',
  value: 'Custom', // for now
};

const dailyRuleBasic = {
  label: 'Daily',
};

const everyWeekDayBasic = {
  label: 'Every weekday',
};

export const firstThursdayDate = moment(new Date(2023, 10, 2)); // month index starts at 0
export const secondTuesdayDate = moment(new Date(2023, 10, 7));
export const thirdSundayDate = moment(new Date(2023, 10, 19));
export const fourthMondayWithFourMondaysDate = moment(new Date(2023, 10, 27));
export const fourthWednesdayWithFiveWednesdaysDate = moment(
  new Date(2023, 10, 22)
);
export const firstSaturdayDate = moment(new Date(2023, 10, 4));

export const firstThursdayOptions: Array<Option> = [
  { ...defaultOption },
  {
    ...dailyRuleBasic,
    value: new RRule({
      freq: RRule.DAILY,
      dtstart: firstThursdayDate.toDate(),
    }),
  },
  {
    label: 'Weekly on Thursday',
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.TH],
      dtstart: firstThursdayDate.toDate(),
    }),
  },
  {
    label: 'Monthly on the first Thursday',
    value: new RRule({
      freq: RRule.MONTHLY,
      byweekday: [RRule.TH.nth(1)],
      dtstart: firstThursdayDate.toDate(),
    }),
  },
  {
    label: 'Annually on November 2',
    value: new RRule({
      freq: RRule.YEARLY,
      dtstart: firstThursdayDate.toDate(),
    }),
  },
  {
    ...everyWeekDayBasic,
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
      dtstart: firstThursdayDate.toDate(),
    }),
  },
  { ...customOption },
];

export const secondTuesdayOptions: Array<Option> = [
  { ...defaultOption },
  {
    ...dailyRuleBasic,
    value: new RRule({
      freq: RRule.DAILY,
      dtstart: secondTuesdayDate.toDate(),
    }),
  },
  {
    label: 'Weekly on Tuesday',
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.TU],
      dtstart: secondTuesdayDate.toDate(),
    }),
  },
  {
    label: 'Monthly on the second Tuesday',
    value: new RRule({
      freq: RRule.MONTHLY,
      byweekday: [RRule.TU.nth(2)],
      dtstart: secondTuesdayDate.toDate(),
    }),
  },
  {
    label: 'Annually on November 7',
    value: new RRule({
      freq: RRule.YEARLY,
      dtstart: secondTuesdayDate.toDate(),
    }),
  },
  {
    ...everyWeekDayBasic,
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
      dtstart: secondTuesdayDate.toDate(),
    }),
  },
  { ...customOption },
];

export const thirdSundayOptions: Array<Option> = [
  { ...defaultOption },
  {
    ...dailyRuleBasic,
    value: new RRule({ freq: RRule.DAILY, dtstart: thirdSundayDate.toDate() }),
  },
  {
    label: 'Weekly on Sunday',
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.SU],
      dtstart: thirdSundayDate.toDate(),
    }),
  },
  {
    label: 'Monthly on the third Sunday',
    value: new RRule({
      freq: RRule.MONTHLY,
      byweekday: [RRule.SU.nth(3)],
      dtstart: thirdSundayDate.toDate(),
    }),
  },
  {
    label: 'Annually on November 19',
    value: new RRule({ freq: RRule.YEARLY, dtstart: thirdSundayDate.toDate() }),
  },
  { ...customOption },
];

export const fourthMondayWithFourMondaysOptions: Array<Option> = [
  { ...defaultOption },
  {
    ...dailyRuleBasic,
    value: new RRule({
      freq: RRule.DAILY,
      dtstart: fourthMondayWithFourMondaysDate.toDate(),
    }),
  },
  {
    label: 'Weekly on Monday',
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.MO],
      dtstart: fourthMondayWithFourMondaysDate.toDate(),
    }),
  },
  {
    label: 'Monthly on the last Monday',
    value: new RRule({
      freq: RRule.MONTHLY,
      byweekday: [RRule.MO.nth(-1)],
      dtstart: fourthMondayWithFourMondaysDate.toDate(),
    }),
  },
  {
    label: 'Annually on November 27',
    value: new RRule({
      freq: RRule.YEARLY,
      dtstart: fourthMondayWithFourMondaysDate.toDate(),
    }),
  },
  {
    ...everyWeekDayBasic,
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
      dtstart: fourthMondayWithFourMondaysDate.toDate(),
    }),
  },
  { ...customOption },
];

export const fourthWednesdayWithFiveWednesdaysOptions: Array<Option> = [
  { ...defaultOption },
  {
    ...dailyRuleBasic,
    value: new RRule({
      freq: RRule.DAILY,
      dtstart: fourthWednesdayWithFiveWednesdaysDate.toDate(),
    }),
  },
  {
    label: 'Weekly on Wednesday',
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.WE],
      dtstart: fourthWednesdayWithFiveWednesdaysDate.toDate(),
    }),
  },
  {
    label: 'Monthly on the fourth Wednesday',
    value: new RRule({
      freq: RRule.MONTHLY,
      byweekday: [RRule.WE.nth(4)],
      dtstart: fourthWednesdayWithFiveWednesdaysDate.toDate(),
    }),
  },
  {
    label: 'Annually on November 22',
    value: new RRule({
      freq: RRule.YEARLY,
      dtstart: fourthWednesdayWithFiveWednesdaysDate.toDate(),
    }),
  },
  {
    ...everyWeekDayBasic,
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
      dtstart: fourthWednesdayWithFiveWednesdaysDate.toDate(),
    }),
  },
  { ...customOption },
];

export const firstSaturdayOptions: Array<Option> = [
  { ...defaultOption },
  {
    ...dailyRuleBasic,
    value: new RRule({
      freq: RRule.DAILY,
      dtstart: firstSaturdayDate.toDate(),
    }),
  },
  {
    label: 'Weekly on Saturday',
    value: new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.SA],
      dtstart: firstSaturdayDate.toDate(),
    }),
  },
  {
    label: 'Monthly on the first Saturday',
    value: new RRule({
      freq: RRule.MONTHLY,
      byweekday: [RRule.SA.nth(1)],
      dtstart: firstSaturdayDate.toDate(),
    }),
  },
  {
    label: 'Annually on November 4',
    value: new RRule({
      freq: RRule.YEARLY,
      dtstart: firstSaturdayDate.toDate(),
    }),
  },
  { ...customOption },
];

const sundayDate = moment(new Date(2023, 11, 3));
const mondayDate = moment(new Date(2023, 11, 4));
const tuesdayDate = moment(new Date(2023, 11, 5));
const wednesdayDate = moment(new Date(2023, 11, 6));
const thursdayDate = moment(new Date(2023, 11, 7));
const fridayDate = moment(new Date(2023, 11, 8));
const saturdayDate = moment(new Date(2023, 11, 9));

export const getDayStringAndRRuleDayEnumTestCases = [
  {
    eventDate: sundayDate,
    dayString: 'Sunday',
    rruleDayEnum: RRule.SU,
  },
  {
    eventDate: mondayDate,
    dayString: 'Monday',
    rruleDayEnum: RRule.MO,
  },
  {
    eventDate: tuesdayDate,
    dayString: 'Tuesday',
    rruleDayEnum: RRule.TU,
  },
  {
    eventDate: wednesdayDate,
    dayString: 'Wednesday',
    rruleDayEnum: RRule.WE,
  },
  {
    eventDate: thursdayDate,
    dayString: 'Thursday',
    rruleDayEnum: RRule.TH,
  },
  {
    eventDate: fridayDate,
    dayString: 'Friday',
    rruleDayEnum: RRule.FR,
  },
  {
    eventDate: saturdayDate,
    dayString: 'Saturday',
    rruleDayEnum: RRule.SA,
  },
];

const endsConfig: EndsConfig = {
  never: true,
  on: {
    isSelected: false,
    date: null,
  },
  after: {
    isSelected: false,
    numberOfOccurrences: null,
  },
};

export const transformRRuleEventDate = moment(new Date(2023, 11, 4)); // December 4th, 2023, a Monday

const dailyCustomConfig: CustomConfig = {
  repeatEvery: {
    interval: '1',
    frequency: Frequency.DAILY,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: { ...endsConfig },
};

export const dailyCustomRule = createRRuleFromModalConfig(
  dailyCustomConfig,
  transformRRuleEventDate
);

const weeklyCustomConfig: CustomConfig = {
  repeatEvery: {
    interval: '1',
    frequency: Frequency.WEEKLY,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: { ...endsConfig },
};

export const weeklyCustomRule = createRRuleFromModalConfig(
  weeklyCustomConfig,
  transformRRuleEventDate
);

const monthlyCustomConfig: CustomConfig = {
  repeatEvery: {
    interval: '1',
    frequency: Frequency.MONTHLY,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: { ...endsConfig },
};

export const monthlyCustomRule = createRRuleFromModalConfig(
  monthlyCustomConfig,
  transformRRuleEventDate
);

const yearlyCustomConfig: CustomConfig = {
  repeatEvery: {
    interval: '1',
    frequency: Frequency.YEARLY,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
  },
  ends: { ...endsConfig },
};

export const yearlyCustomRule = createRRuleFromModalConfig(
  yearlyCustomConfig,
  transformRRuleEventDate
);

const weekdaysCustomConfig: CustomConfig = {
  repeatEvery: {
    interval: '1',
    frequency: Frequency.WEEKLY,
  },
  repeatOnDays: {
    ...defaultRepeatOnDays,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
  },
  ends: { ...endsConfig },
};

export const weekdaysCustomRule = createRRuleFromModalConfig(
  weekdaysCustomConfig,
  transformRRuleEventDate
);

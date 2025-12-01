// @flow
import { Frequency } from 'rrule';
import moment from 'moment-timezone';

import { type ItemValue } from '@kitman/components/src/CheckboxList';

export type Translations = { [key: string]: string };

export type RepeatEveryConfig = {
  interval: string,
  frequency: typeof Frequency,
};

export type RepeatOnDays = {
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
};

export type EndsConfig = {
  never: boolean,
  on: {
    isSelected: boolean,
    date: typeof moment | null,
  },
  after: {
    isSelected: boolean,
    numberOfOccurrences: number | null,
  },
};

export type CustomConfig = {
  repeatEvery: RepeatEveryConfig,
  repeatOnDays: RepeatOnDays,
  ends: EndsConfig,
};

export type ItemValueArray = Array<ItemValue>;

export const endsOption = {
  Never: 'Never',
  On: 'On',
  After: 'After',
};
export type EndsOption = $Keys<typeof endsOption>;

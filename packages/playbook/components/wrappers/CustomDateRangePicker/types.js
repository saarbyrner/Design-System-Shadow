// @flow

import type { MomentType } from '../DateRangePickerWrapper/types';

export type DateRange = [MomentType | null, MomentType | null];

export type CustomFilter = {
  key: string,
  label: string,
  getDateRange: () => [MomentType, MomentType],
};

export type DateRangeOutput = {
  start_date: string,
  end_date: string,
};

export type CustomDateRangePickerProps = {
  onChange: (range: DateRangeOutput | null) => void,
  disableFuture?: boolean,
  disablePast?: boolean,
  variant?: 'default' | 'menuFilters' | 'muiFilled',
  minDate?: MomentType,
  maxDate?: MomentType,
  customFilters?: Array<CustomFilter>,
  value?: [MomentType, MomentType],
  label?: string,
};

export type MobileStep = 'start' | 'end';

export type CalendarView = 'year' | 'month' | 'day';

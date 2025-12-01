// @flow

import moment from 'moment';

const m = moment(); // helper for type inference
export type MomentType = typeof m;

export type DateRange = {
  startDate: MomentType | null,
  endDate: MomentType | null,
};

// ISO string output
export type DateRangeOutput = {
  start_date: string, // Format: 'YYYY-MM-DD'
  end_date: string, // Format: 'YYYY-MM-DD'
};

// Input format (legacy compatible)
export type DateRangeInput = {
  start_date: string,
  end_date: string,
} | null;

// Component props
export type DateRangePickerWrapperProps = {
  value: DateRangeInput,
  onChange: (value: DateRangeOutput | null) => void,
  minDate?: MomentType,
  maxDate?: MomentType,
  disableFuture?: boolean,
  disablePast?: boolean,
  disabled?: boolean,
  helperText?: string,
};

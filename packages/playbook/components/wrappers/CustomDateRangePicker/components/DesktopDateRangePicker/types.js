// @flow

import type { CustomFilter, DateRange } from '../../types';
import type { MomentType } from '../../../DateRangePickerWrapper/types';

export type DesktopDateRangePickerProps = {
  variant: 'default' | 'menuFilters' | 'muiFilled',
  selectedFilter: string | null,
  handleQuickSelect: (filterKey: string) => void,
  defaultPrimary: string,
  defaultContrastText: string,
  filters: CustomFilter[],
  disableFuture?: boolean,
  disablePast?: boolean,
  minDate?: MomentType,
  maxDate?: MomentType,
  dateRange: DateRange,
  handleStartDateChange: (date: MomentType | null) => void,
  handleEndDateChange: (date: MomentType | null) => void,
  handleClearDates: (e: SyntheticMouseEvent<HTMLElement>) => void,
  closeCalendar: () => void,
};

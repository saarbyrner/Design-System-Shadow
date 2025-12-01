// @flow
import type { MomentType } from '../../../DateRangePickerWrapper/types';
import type {
  CalendarView,
  CustomFilter,
  DateRange,
  MobileStep,
} from '../../types';

export type MobileDateRangePickerProps = {
  mobileStep: MobileStep,
  setMobileStep: (step: MobileStep) => void,
  setCurrentView: (view: CalendarView) => void,
  dateRange: DateRange,
  handleMobileDateChange: (date: MomentType | null) => void,
  disableFuture?: boolean,
  disablePast?: boolean,
  minDate?: MomentType,
  maxDate?: MomentType,
  selectedFilter: string | null,
  handleQuickSelect: (filterKey: string) => void,
  defaultPrimary: string,
  defaultContrastText: string,
  filters: Array<CustomFilter>,
};

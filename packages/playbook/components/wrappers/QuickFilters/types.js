// @flow

import type { CustomFilter } from '../CustomDateRangePicker/types';

export type QuickFiltersProps = {
  selectedFilter: string | null,
  onQuickSelect: (key: string) => void,
  defaultPrimary: string,
  defaultContrastText: string,
  filters: Array<CustomFilter>,
  defaultFilters?: Array<CustomFilter>,
};

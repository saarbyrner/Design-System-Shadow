// @flow
import type {
  SummaryValueDataShape,
  GroupedSummaryValueDataShape,
} from '@kitman/modules/src/analysis/shared/types/charts';
import { type ChartContextType } from './components/Context';

import {
  SERIES_TYPES,
  AGGREGATE_PERIOD,
  AGGREGATE_METHOD,
  AXIS_CONFIG,
  SORT_ORDER,
  CHART_ELEMENT_ERROR,
} from './constants';

export type SeriesType = $Values<typeof SERIES_TYPES>;

export type AggregatePeriod = $Values<typeof AGGREGATE_PERIOD>;

export type AggregateMethod = $Values<typeof AGGREGATE_METHOD>;

export type AxisConfig = $Values<typeof AXIS_CONFIG>;

export type SortOrder = $Values<typeof SORT_ORDER>;

export type SeriesDataType = 'category' | 'time';

export type RenderSeriesType = 'group' | 'stack' | null;

export type ChartElementErrorType = $Values<typeof CHART_ELEMENT_ERROR>;

export type Scroll = {
  startIndex: number,
  endIndex: number,
  isActive: boolean,
};

export type ChartOption = 'hide_zero_values' | 'hide_null_values';

export type ChartOptionTypes = {
  hide_zero_values: boolean,
  hide_null_values: boolean,
};

export type SortConfig = {
  sortBy: string,
  sortOrder: string,
};

export type ValueAccessor = (dataItem: Object) => string | number | null;
export type CategoryAccessor = (dataItem: Object) => string;
export type ValueFormatter = ({
  value: string | number | null,
  addDecorator?: boolean,
}) => string;

export type SeriesContextType = $PropertyType<ChartContextType, 'series'>;

export type ChartConfig = {
  show_labels?: boolean,
  sortConfig?: SortConfig,
  chartOptions?: ChartOptionTypes,
  aggregation_period?: AggregatePeriod,
  invalid_chart_elements?: { [key: string | number]: Array<string> },
};

export type AggregateValues = {
  aggregatePeriod: AggregatePeriod,
  aggregateMethod: AggregateMethod,
};

export type DefaultSortFunction = (
  data: Array<SummaryValueDataShape | GroupedSummaryValueDataShape>
) => Array<SummaryValueDataShape | GroupedSummaryValueDataShape>;

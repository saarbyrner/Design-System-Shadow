// @flow
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import type { TableWidgetSourceSubtypes } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type {
  AggregateMethod,
  AggregatePeriod,
  ChartOptionTypes,
  SortConfig,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type { DataSourceType } from '@kitman/modules/src/analysis/Dashboard/components/types';

export type RegularCalculations =
  | 'sum_absolute'
  | 'sum'
  | 'min_absolute'
  | 'min'
  | 'max_absolute'
  | 'max'
  | 'mean'
  | 'count'
  | 'count_absolute'
  | 'last'
  | 'percentage';

export type ComplexCalculations =
  | 'z_score'
  | 'complex_z_score'
  | 'acute_chronic'
  | 'acute_chronic_ewma'
  | 'training_stress_balance'
  | 'standard_deviation'
  | 'strain'
  | 'monotony'
  | 'average_percentage_change';

export type Calculation = RegularCalculations | ComplexCalculations;
export type GroupedChartType = 'summary_stack';
export type ValueChartType = 'value';
export type SummaryChartType = 'donut' | 'line' | 'bar';
export type ChartType = GroupedChartType | ValueChartType | SummaryChartType;

export type InputParams = {
  type?: string,
  id?: Array<number> | string | number,
  variable?: string,
  source?: string,
  ids?: Array<?number>,
  status?: string,
  participation_level_ids?: Array<?number>,
  subtypes?: TableWidgetSourceSubtypes,
  kinds?: string | Array<string>,
  result?: string,
  position_ids?: Array<number>,
  formation_ids?: Array<number>,
};

export type FilterType =
  | 'time_loss'
  | 'competitions'
  | 'event_types'
  | 'session_type'
  | 'training_session_types'
  | 'match_days';

export type FilterValue = Array<string | number>;

export type ChartElement = {
  id: string | number,
  calculation: Calculation | string,
  data_source_type: DataSourceType | string,
  input_params: InputParams,
  config: Object, // TODO
  population: SquadAthletesSelection,
  time_scope: Object, // TODO define this
  overlays: Object, // TODO define this,
  cached_at: Date,
};

// Response Types
export type ID = string | number;
// For chart_type value
export type ValueDataShape = {
  value: number,
};

// for chart_type donut/line/bar
export type SummaryValueDataShape = {
  id?: ID,
  index?: number,
  label: string,
  value: number,
};

// for chart_type summary_stack
export type GroupedSummaryValueDataShape = {
  id?: ID,
  index?: number,
  label: string,
  values: SummaryValueDataShape[],
};

export type ChartOrientation = 'vertical' | 'horizontal';

export type ChartConfig = {
  orientation: ChartOrientation,
  groupings: Object[],
};

export type WidgetColor =
  | {
      label: string,
      value: string,
    }
  | Object;

export type WidgetColors = {
  grouping: string,
  colors: WidgetColor[] | Object[],
};

export type ChartData = {
  id: number,
  chart: Array<SummaryValueDataShape | GroupedSummaryValueDataShape>,
  metadata: {
    aggregation_method: AggregateMethod,
    unit?: string,
    rounding_places?: number | null,
  },
  config: {
    aggregation_period: AggregatePeriod,
    show_labels?: boolean,
    chartOptions: ChartOptionTypes,
    sortConfig: SortConfig,
    invalid_chart_elements: { [key: string | number]: Array<string> },
  },
  overlays: Object[],
};

export type Grouping = {
  key: string,
  name: string,
  category: string,
  category_name: string,
  order: number,
  category_order: number,
};

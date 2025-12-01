// // @flow
import type { Metric } from '@kitman/common/src/types/Metric';
import {
  TIME_PERIODS,
  POPULATION_TYPES,
  FORMULA_INPUT_IDS,
} from '@kitman/modules/src/analysis/shared/constants';
import type { TimeScopeConfig } from '@kitman/modules/src/analysis/Dashboard/components/types';

export type TimePeriods = $Values<typeof TIME_PERIODS>;
export type PopulationType = $Values<typeof POPULATION_TYPES>;
export type FormulaInputIds = $Values<typeof FORMULA_INPUT_IDS>;

export type TrainingSession = {
  date: string,
  duration: number,
  id: number,
  session_type_name: string,
  game_day_minus: ?number,
  game_day_plus: ?number,
};

export type EventBreakdown = 'SUMMARY' | 'DRILLS';

export type Game = {
  date: string,
  id: number,
  opponent_score: string,
  opponent_team_name: string,
  score: string,
  team_name: string,
  venue_type_name: string,
};

export type PrintPaperSize = 'a_4' | 'us_letter';
export type PrintOrientation = 'portrait' | 'landscape';

export type GraphType =
  | 'line'
  | 'column'
  | 'bar'
  | 'table'
  | 'spider'
  | 'radar'
  | 'donut'
  | 'pie'
  | 'value'
  | 'combination';
export type GraphGroup =
  | 'longitudinal'
  | 'summary'
  | 'summary_bar'
  | 'summary_donut'
  | 'summary_stack_bar'
  | 'value_visualisation';
export type AggregationPeriod = 'day' | 'week' | 'month';

export type WidgetLayout = {
  i: string,
  x: number,
  y: number,
  w: number,
  h: number,
  minH: number,
  maxH: number,
  minW: number,
  maxW: number,
};

export type SavedGraphLayout = {
  graph_id: string,
  x: number,
  y: number,
  w: number,
  h: number,
};

export type Dashboard = {
  id: string,
  name: string,
  layout: {
    graphs: Array<SavedGraphLayout>,
  },
  print_paper_size: PrintPaperSize,
  print_orientation: PrintOrientation,
  squad_id?: number,
};

export type SummaryGraphSortConfig = {
  enabled: boolean,
  order: string,
  metricIndex?: number,
  sortKey?: string,
  secondaryOrder?: string,
  secondarySortKey?: string,
};

export type SummaryGraphData = {
  id: ?number,
  graphType: GraphType,
  graphGroup: 'summary',
  metrics: Array<Metric>,
  series: Array<{
    name: string,
    zScores: Array<number>,
    values: Array<number>,
    event_type_time_period?: ?string,
    selected_training_sessions?: Array<?TrainingSession>,
    selected_games?: Array<?Game>,
    games: Array<?Game>,
    training_sessions: Array<?TrainingSession>,
    event_breakdown: ?EventBreakdown,
    dateRange: {
      startDate: string,
      endDate: string,
    },
    timePeriod: string,
    population_type?: string,
    population_id?: string,
    time_period_length?: ?number,
    time_period_length_offset?: ?number,
  }>,
  illnesses: Array<any>,
  injuries: Array<any>,
  cmpStDevs: Array<number>,
  isLoading: boolean,
  error: boolean,
  errorMessage?: ?boolean,
  forbidden: boolean,
  name: ?string,
};

export type Decorators = {
  injuries: boolean,
  illnesses: boolean,
  data_labels: boolean,
  hide_zeros: boolean,
  hide_nulls: boolean,
};

export type LongitudinalGraphData = {
  id: ?number,
  graphType: GraphType,
  graphGroup: 'longitudinal',
  metrics: Array<Metric>,
  date_range: {
    start_date: string,
    end_date: string,
  },
  time_period: string,
  injuries: Array<{
    has_unavailability: boolean,
    date: string,
    athletes: Array<{
      name: string,
      description: string,
      caused_unavailability: boolean,
      days: number,
      status: string,
    }>,
  }>,
  illnesses: Array<{
    has_unavailability: boolean,
    date: string,
    athletes: Array<{
      name: string,
      description: string,
      caused_unavailability: boolean,
      days: number,
      status: string,
    }>,
  }>,
  decorators: Decorators,
  aggregationPeriod: AggregationPeriod,
  isLoading: boolean,
  error: boolean,
  errorMessage?: ?boolean,
  forbidden: boolean,
  name: ?string,
};

export type SummaryBarGraphData = {
  id: ?number,
  graphType: GraphType,
  graphGroup: 'summary_bar',
  metrics: Array<Metric>,
  date_range: {
    start_date: string,
    end_date: string,
  },
  time_period: string,
  isLoading: boolean,
  error: boolean,
  errorMessage?: ?boolean,
  forbidden: boolean,
  name: ?string,
  decorators: Decorators,
  sorting: SummaryGraphSortConfig,
};

export type SummaryStackBarGraphData = {
  id: ?number,
  graphType: GraphType,
  graphGroup: 'summary_stack_bar',
  metrics: Array<Metric>,
  date_range: {
    start_date: string,
    end_date: string,
  },
  time_period: string,
  isLoading: boolean,
  error: boolean,
  errorMessage?: ?boolean,
  forbidden: boolean,
  name: ?string,
  decorators: Decorators,
  sorting: SummaryGraphSortConfig,
};

export type SummaryDonutGraphData = {
  id: ?number,
  graphType: GraphType,
  graphGroup: 'summary_donut',
  metrics: Array<Metric>,
  date_range: {
    start_date: string,
    end_date: string,
  },
  time_period: string,
  isLoading: boolean,
  error: boolean,
  errorMessage?: ?boolean,
  forbidden: boolean,
  name: ?string,
  sorting: SummaryGraphSortConfig,
};

export type ValueVisualisationData = {
  id: ?number,
  graphType: GraphType,
  graphGroup: 'value_visualisation',
  metrics: Array<Metric>,
  date_range: {
    start_date: string,
    end_date: string,
  },
  time_period: string,
  isLoading: boolean,
  error: boolean,
  forbidden: boolean,
  name: ?string,
};
export type ChartOverlay = {
  id: string,
  color: string,
  type: 'line',
  value: number,
  width: 2,
  dashStyle: 'shortdash',
  yIndex: number,
};

export type Timescope = {
  time_period: ?string,
  start_time?: ?string,
  end_time?: ?string,
  time_period_length?: ?number,
  time_period_length_offset?: ?number,
  config?: TimeScopeConfig,
};

export type FormulaInputConfig = {
  id: string,
  label: string,
  description: string,
  population_config: {
    supported_types: Array<PopulationType>,
    single_type_selection: boolean,
    default_value: PopulationType,
  },
};

export type FormulaDetails = {
  id: number,
  label: string,
  formula_expression: string,
  inputs: Array<FormulaInputConfig>,
};

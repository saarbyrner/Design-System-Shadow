// @flow
import type { Metric } from '@kitman/common/src/types/Metric';
import type { DateRange } from '@kitman/common/src/types';
import type {
  Game,
  TrainingSession,
  EventBreakdown,
  GraphType,
} from '@kitman/modules/src/analysis/shared/types';

export type Drill = {
  id: number,
  name: string,
};

export type AggregationPeriod = 'day' | 'week' | 'month';

export type Population = {
  athletes: string,
  calculation: string,
  timePeriod: string,
  dateRange: DateRange,
  event_type_time_period?: ?string,
  games?: Array<?Game>,
  training_sessions?: Array<?TrainingSession>,
  drills?: Array<?Drill>,
  selected_games?: Array<?number>,
  selected_training_sessions?: Array<?number>,
  event_breakdown?: ?EventBreakdown,
  time_period_length?: ?number,
  last_x_time_period?: 'days' | 'weeks',
  time_period_length_offset?: ?number,
  last_x_time_period_offset?: 'days' | 'weeks',
  filters?: {
    event_types: Array<string>,
    training_session_types: Array<number>,
  },
};

export type LongitudinalGraphState = {
  graphData: {
    series_data: Array<{
      name: string,
      datapoints: Array<{
        name: string,
        y: number,
      }>,
    }>,
  },
  formData: {
    metrics: Array<Metric>,
    time_period: string,
    date_range: {
      start_date: string,
      end_date: string,
    },
  },
};

export type SummaryBarGraphState = {
  graphData: {
    series: Array<Object>,
  },
  formData: {
    metrics: Array<Metric>,
    time_period: string,
    date_range: {
      start_date: string,
      end_date: string,
    },
  },
};

export type SummaryGraphState = {
  graphData: {
    metrics: Array<string>,
    series: Array<{
      name: string,
      data: Array<number>,
    }>,
    illnesses: Array<any>,
    injuries: Array<any>,
  },
  formData: {
    populations: Array<{
      athlete: string,
      calculation: string,
      timePeriod: string,
    }>,
    metrics: Array<string>,
    comparisonGroupIndex: number,
  },
};

export type SummaryDonutGraphState = {
  graphData: {
    series: Array<{
      name: string,
      datapoints: Array<{
        name: string,
        y: number,
      }>,
    }>,
  },
  formData: {
    metrics: Array<Metric>,
    time_period: string,
    date_range: {
      start_date: string,
      end_date: string,
    },
  },
};

export type SummaryStackBarGraphState = {
  graphData: {
    series: Array<{
      name: string,
      datapoints: Array<{
        name: string,
        y: number,
      }>,
    }>,
  },
  formData: {
    metrics: Array<Metric>,
    time_period: string,
    date_range: {
      start_date: string,
      end_date: string,
    },
  },
};

export type ValueVisualisationGraphState = {
  graphData: {
    id: ?string,
    graphType: GraphType,
    metrics: Array<Metric>,
    time_period: string,
    date_range: {
      start_date: string,
      end_date: string,
    },
    graphGroup: 'value_visualisation',
    name: ?string,
  },
  formData: {
    metrics: Array<Metric>,
    time_period: string,
    date_range: {
      start_date: string,
      end_date: string,
    },
  },
};

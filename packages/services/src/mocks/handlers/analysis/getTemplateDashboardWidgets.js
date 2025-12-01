import { rest } from 'msw';

const data = {
  id: 'coaching',
  template_dashboard_name: 'Coaching',
  widgets: [
    {
      id: 1,
      title: 'Session Mins Over Time',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'ParticipationLevel',
      input_params: {
        participation_level_ids: [3865, 3866, 3867],
      },
      chart_type: 'line',
      config: {
        groupings: ['timestamp'],
      },
      overlays: null,
    },
    {
      id: 2,
      title: 'Total Sessions Mins by Athlete',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'ParticipationLevel',
      input_params: {
        participation_level_ids: [3865, 3866, 3867],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 3,
      title: 'Session by Type',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'EventActivityType',
      input_params: null,
      chart_type: 'summary_stack',
      config: {
        groupings: ['session_type', 'squad'],
      },
      overlays: null,
    },
    {
      id: 4,
      title: 'Session by Type by Player',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'EventActivityType',
      input_params: null,
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'session_type'],
      },
      overlays: null,
    },
    {
      id: 5,
      title: 'Number of Games of player',
      tag: 'coaching',
      calculation: 'count_absolute',
      data_source_type: 'ParticipationLevel',
      input_params: {
        participation_level_ids: [3865, 3866, 3867],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 6,
      title: 'Number of Minutes of player',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['position_change'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 7,
      title: 'Training Session RPE over time',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'training_session_rpe',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['timestamp'],
      },
      overlays: null,
    },
    {
      id: 7.1,
      title: 'Game Session RPE over time',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'game_rpe',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['timestamp'],
      },
      overlays: null,
    },
    {
      id: 8,
      title: 'Training Session RPE by player',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'training_session_rpe',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['athlete'],
      },
      overlays: null,
    },
    {
      id: 8.1,
      title: 'Game Session RPE by player',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'game_rpe',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['athlete'],
      },
      overlays: null,
    },
    {
      id: 9,
      title: 'Training Workload (RPE x Duration)',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'rpe_x_duration',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['timestamp'],
      },
      overlays: null,
    },
    {
      id: 9.1,
      title: 'Game Workload (RPE x Duration)',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'game_rpe_x_duration',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['timestamp'],
      },
      overlays: null,
    },
    {
      id: 10,
      title: 'Training Workload (RPE x Duration)',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'rpe_x_duration',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['athlete'],
      },
      overlays: null,
    },
    {
      id: 10.1,
      title: 'Game Workload (RPE x Duration)',
      tag: 'coaching',
      calculation: 'mean',
      data_source_type: 'TableMetric',
      input_params: {
        variable: 'game_rpe_x_duration',
        source: 'kitman',
      },
      chart_type: 'line',
      config: {
        groupings: ['athlete'],
      },
      overlays: null,
    },
    {
      id: 11,
      title: 'Time in position by player',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['position_change'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'position'],
      },
      overlays: null,
    },
    {
      id: 12,
      title: 'Time in position by player',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['position_change'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['squad', 'competition', 'position'],
      },
      overlays: null,
    },
    {
      id: 13,
      title: 'Yellow Cards by player',
      tag: 'coaching',
      calculation: 'count_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['yellow_card'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 14,
      title: 'Red Cards by player',
      tag: 'coaching',
      calculation: 'count_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['red_card'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 15,
      title: 'Goals by player',
      tag: 'coaching',
      calculation: 'count_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['goals'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 16,
      title: 'Assists by player',
      tag: 'coaching',
      calculation: 'count_absolute',
      data_source_type: 'GameActivity',
      input_params: {
        kinds: ['assists'],
      },
      chart_type: 'summary_stack',
      config: {
        groupings: ['athlete', 'squad'],
      },
      overlays: null,
    },
    {
      id: 17,
      title: 'Drill Duration',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'EventActivityDrillLabel',
      input_params: null,
      chart_type: 'donut',
      config: {
        groupings: ['drill'],
      },
      overlays: null,
    },
    {
      id: 18,
      title: 'Drill Duration by Player',
      tag: 'coaching',
      calculation: 'sum_absolute',
      data_source_type: 'EventActivityDrillLabel',
      input_params: null,
      chart_type: 'donut',
      config: {
        groupings: ['player', 'drill_label'],
      },
      overlays: null,
    },
  ],
};

const handler = rest.get(
  '/reporting/template_dashboards/:key',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

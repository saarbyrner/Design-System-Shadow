import { rest } from 'msw';

const data = {
  id: 4,
  chart_id: 19,
  population: {
    applies_to_squad: false,
    all_squads: false,
    athletes: [],
    positions: [],
    position_groups: [],
    squads: [8],
    context_squads: [],
    users: [],
  },
  data_source_type: 'TableMetric',
  input_params: {
    source: 'kitman:athlete',
    variable: 'age_in_years',
  },
  calculation: 'sum_absolute',
  filters: null,
  config: null,
  created_at: '2024-03-07T16:04:17.894+00:00',
  updated_at: '2024-03-07T16:04:17.894+00:00',
  time_scope: {
    id: 230624,
    time_scopeable_type: 'Charts::Private::Models::ChartElement',
    time_scopeable_id: 4,
    time_period: 'this_week',
    start_time: null,
    end_time: null,
    time_period_length: null,
    time_period_length_offset: null,
    config: null,
    created_at: '2024-03-07T16:04:17.000+00:00',
    updated_at: '2024-03-07T16:04:17.000+00:00',
  },
};

const handler = rest.post(
  `/reporting/charts/:chartId/chart_elements`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

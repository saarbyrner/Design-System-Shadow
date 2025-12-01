import { rest } from 'msw';

const data = {
  id: 2,
  column_id: '12182800966478671114',
  name: '% baseline change',
  population: null,
  config: null,
  table_element: {
    id: 441995,
    name: '% baseline change',
    calculation: 'formula',
    config: {
      formula: '(B-A)/A * 100',
    },
    data_source: {
      A: {
        data_source_type: 'TableMetric',
        population: null,
        time_scope: {
          time_period: 'this_season_so_far',
        },
        calculation: 'sum',
        input_params: {
          variable: 'training_session_minutes',
          source: 'kitman',
        },
        element_config: {},
      },
      B: {
        data_source_type: 'TableMetric',
        population: {
          applies_to_squad: false,
          all_squads: false,
          position_groups: [],
          positions: [],
          athletes: [],
          squads: [3510],
          context_squads: [3510],
          users: [],
          labels: [],
          segments: [],
        },
        time_scope: {
          time_period: 'this_season_so_far',
        },
        calculation: 'sum',
        input_params: {
          variable: 'training_session_minutes',
          source: 'kitman',
        },
        element_config: {},
      },
      data_source_type: 'Formula',
    },
  },
  time_scope: {
    time_period: 'this_season_so_far',
    start_time: null,
    end_time: null,
    time_period_length: null,
    time_period_length_offset: null,
  },
  order: 5,
  active: true,
};
const handler = rest.put(
  `/table_containers/:tableContainerId/table_columns/:columnId`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

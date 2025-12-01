// @flow
const relativeContributionData = {
  analytics_metadata: {
    date_range: {
      end_date: '2020-12-17T23:59:59Z',
      start_date: '2020-11-05T00:00:00Z',
    },
    position_group_ids: null,
    exposures: null,
    mechanisms: null,
    body_area_ids: null,
    injuries: null,
    athletes: null,
    severity: [],
  },
  dashboard_header: {
    athlete_name: 'Jon Doe',
    injury_risk: 30,
    injury_risk_variable_name: 'My Risk Metric',
  },
  date_range: {
    end_date: '2020-12-17T23:59:59Z',
    start_date: '2020-11-05T00:00:00Z',
  },
  decorators: {
    data_labels: false,
  },
  graphType: 'column',
  graph_group: 'summary_bar',
  metrics: [
    {
      athlete_ids: [],
      filter_names: null,
      filters: null,
      linked_dashboard_id: null,
      order: 0,
      overlays: [],
      squad_selection: {
        all_squads: false,
        applies_to_squad: true,
        athletes: [],
        position_groups: [],
        positions: [],
        squads: [],
      },
      series: [
        {
          datapoints: [
            { name: 'Nov', y: 0 },
            { name: 'Dec', y: 0 },
          ],
          name: 'No of injuries',
        },
      ],
      status: {
        aggregation_method: '',
        event_breakdown: null,
        event_type_time_period: '',
        grouped_with: [],
        localised_unit: '',
        max: null,
        min: null,
        name: 'No of Injuries',
        operator: null,
        period_length: null,
        period_scope: '',
        raw_name: '',
        second_period_all_time: null,
        second_period_length: null,
        selected_games: [],
        selected_training_sessions: [],
        settings: {},
        source_key: '',
        summary: '',
        time_period_length: null,
        type: '',
        variables: [],
      },
      time_period_length: null,
      type: 'metric',
    },
  ],
  time_period: '',
};

export default relativeContributionData;

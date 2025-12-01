// @flow
const injuryVariablesDummyData = [
  {
    id: '1234',
    name: 'Injury Metric 1',
    date_range: {
      start_date: '2020-06-10T23:00:00Z',
      end_date: '2020-07-23T22:59:59Z',
    },
    filter: {
      position_group_ids: [],
      exposure_types: [],
      mechanisms: [],
      osics_body_area_ids: [],
      severity: [],
    },
    excluded_sources: [],
    excluded_variables: [],
    enabled_for_prediction: true,
    created_by: {
      id: 1,
      fullname: 'User 1',
    },
    created_at: '2020-06-10T23:00:00Z',
    archived: false,
    status: null,
    last_prediction_status: null,
    snapshot: {
      summary: {
        graph_group: 'summary_bar',
      },
      value: {
        graphGroup: 'value_visualisation',
      },
      totalInjuries: 65,
    },
    is_hidden: false,
    medical_data_redacted: false,
    pipeline_arn: 'multivariate_analysis_experimental_state_machine',
  },
  {
    id: '5678',
    name: 'Injury Metric 2',
    date_range: {
      start_date: '2020-06-10T23:00:00Z',
      end_date: '2020-07-23T22:59:59Z',
    },
    filter: {
      position_group_ids: [],
      exposure_types: [],
      mechanisms: [],
      osics_body_area_ids: [],
      severity: [],
    },
    excluded_sources: [],
    excluded_variables: [],
    enabled_for_prediction: true,
    created_by: {
      id: 1,
      fullname: 'User 2',
    },
    created_at: '2020-06-10T23:00:00Z',
    archived: true,
    status: null,
    last_prediction_status: null,
    snapshot: {
      summary: {
        graph_group: 'summary_bar',
      },
      value: {
        graphGroup: 'value_visualisation',
      },
      totalInjuries: 643,
    },
    is_hidden: false,
    medical_data_redacted: false,
    pipeline_arn: 'multivariate_analysis_experimental_state_machine',
  },
  {
    id: '8901',
    name: 'Injury Metric 3',
    date_range: {
      start_date: '2020-06-10T23:00:00Z',
      end_date: '2020-07-23T22:59:59Z',
    },
    filter: {
      position_group_ids: [],
      exposure_types: [],
      mechanisms: [],
      osics_body_area_ids: [],
      severity: [],
    },
    excluded_sources: [],
    excluded_variables: [],
    enabled_for_prediction: true,
    created_by: {
      id: 1,
      fullname: 'User 1',
    },
    created_at: '2020-06-10T23:00:00Z',
    archived: false,
    status: null,
    last_prediction_status: null,
    snapshot: {
      summary: {
        graph_group: 'summary_bar',
      },
      value: {
        graphGroup: 'value_visualisation',
      },
      totalInjuries: 43,
    },
    is_hidden: false,
    medical_data_redacted: false,
    pipeline_arn: 'multivariate_analysis_experimental_state_machine',
  },
];

export default injuryVariablesDummyData;

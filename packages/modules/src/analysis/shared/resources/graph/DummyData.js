import snakeCase from 'lodash/snakeCase';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

const sampleTrainingSessions = [
  {
    date: '2017-10-27',
    id: 1234,
    session_type_name: 'Training Session',
  },
];

const sampleDrills = [
  {
    id: 1234,
    name: 'Drill 1',
  },
  {
    id: 5678,
    name: 'Drill 2',
  },
];

const sampleSelectedTrainingSessions = [sampleTrainingSessions[0].id];
const sampleSelectedDrills = [sampleDrills[0].id];

const buildMetricsOverlaysData = (isEmpty) =>
  isEmpty
    ? []
    : [
        {
          value: 5,
          name: 'Overlay Name',
          timePeriod: TIME_PERIODS.today,
          summary: 'mean',
          dateRange: {},
        },
      ];

const squadSelectionData = {
  athletes: [],
  positions: [71],
  position_groups: [],
  applies_to_squad: false,
};

const buildStatusData = (graphGroup) => {
  const statusData = [
    {
      name: 'Good Mood',
      localised_unit: 'Yes-No',
      source_key: 'kitman:soreness_indication|abdominal',
      summary: 'last',
      type: 'boolean',
      min: null,
      max: null,
      aggregation_method: 'sum',
      grouped_with: [],
    },
    {
      name: 'Sleep Duration',
      localised_unit: 'hr',
      source_key: 'kitman:soreness_indication|abdominal',
      summary: 'mean',
      min: null,
      max: null,
      type: 'sleep_duration',
      aggregation_method: 'sum',
      grouped_with: [],
    },
  ];

  if (graphGroup === 'longitudinal') {
    statusData.forEach((status, index) => {
      // $FlowFixMe
      statusData[index].period_scope = TIME_PERIODS.yesterday;
      statusData[index].second_period_length = null;
      statusData[index].second_period_all_time = null;
    });
  }

  return statusData;
};

const buildMedicalMetricData = (graphGroup) => {
  const metricData = [
    {
      type: 'medical',
      main_category: 'illness',
      category: 'all_illnesses',
      squad_selection: squadSelectionData,
    },
  ];

  if (graphGroup === 'value_visualisation') {
    metricData.forEach((metric, index) => {
      metricData[index].series = [
        {
          value: '32',
          name: 'Forwards',
        },
      ];
    });
  }

  if (graphGroup === 'summaryDonut' || graphGroup === 'summaryStackBar') {
    metricData.forEach((metric, index) => {
      metricData[index].series = [
        {
          name: 'Entire Squad',
          datapoints: [
            {
              name: 'Ankle',
              y: 10,
            },
            {
              name: 'Foot',
              y: 3,
            },
          ],
        },
      ];
    });
  }

  if (graphGroup === 'summaryDonut') {
    metricData.forEach((metric, index) => {
      metricData[index].measurement_type = 'percentage';
    });
  }

  if (graphGroup === 'summaryStackBar') {
    metricData.forEach((metric, index) => {
      metricData[index].category_division = null;
    });
  }

  return metricData;
};

const buildMedicalData = (graphGroup) => ({
  metrics: buildMedicalMetricData(graphGroup),
  date_range: {
    start_date: '2017-10-27',
    end_date: '2017-12-04',
  },
  time_period: TIME_PERIODS.customDateRange,
  graphGroup: snakeCase(graphGroup),
});

const DummySummaryGraphData = {
  metrics: [
    {
      name: 'Fatigue',
      key_name: 'kitman:tv|fatigue',
      series: [],
      status: {
        grouped_with: [],
      },
    },
    {
      name: 'Groin Squeeze',
      key_name: 'kitman:tv|groin_squeeze',
      series: [],
      status: {
        grouped_with: [],
      },
    },
    {
      name: 'Hip Mobility - Left',
      key_name: 'kitman:tv|hip_mobility_left',
      series: [],
      status: {
        grouped_with: [],
      },
    },
  ],
  series: [
    {
      name: 'Entire Squad',
      zScores: [0, 0, 0],
      values: [5.56, 254.94, 45.72],
      dateRange: {},
      timePeriod: TIME_PERIODS.thisSeason,
      selected_training_sessions: [],
      selected_games: [],
    },
    {
      name: 'Goalkeeper',
      zScores: [2.401, 6.864, 5.899],
      values: [12.5, 518.5, 105],
      dateRange: {},
      timePeriod: TIME_PERIODS.lastWeek,
      selected_training_sessions: [],
      selected_games: [],
    },
    {
      name: 'Defender',
      zScores: [-0.042, 0.136, 0.763],
      values: [5.44, 260.17, 53.39],
      dateRange: {},
      timePeriod: TIME_PERIODS.lastWeek,
      selected_training_sessions: [],
      selected_games: [],
    },
  ],
  graphGroup: 'summary',
  illnesses: [],
  injuries: [],
  decorators: [],
  cmpStdDevs: [2.89, 38.4, 10.05],
};

const DummySummaryBarGraphData = (graphGroup) => ({
  metrics: [
    {
      type: 'metric',
      status: buildStatusData(graphGroup)[0],
      squad_selection: squadSelectionData,
      series: [
        {
          name: 'Good Mood',
          datapoints: [
            {
              name: 'Athlete 1',
              y: 6.0,
            },
            {
              name: 'Athlete 2',
              y: 20.0,
            },
            {
              name: 'Athlete 3',
              y: 2.0,
            },
          ],
        },
      ],
      overlays: buildMetricsOverlaysData(),
    },
    {
      type: 'metric',
      status: buildStatusData(graphGroup)[1],
      squad_selection: squadSelectionData,
      series: [
        {
          name: 'Sleep Duration',
          datapoints: [
            {
              name: 'Athlete 1',
              y: 0.0,
            },
            {
              name: 'Athlete 2',
              y: 2.0,
            },
            {
              name: 'Athlete 3',
              y: 4.0,
            },
          ],
        },
      ],
      overlays: buildMetricsOverlaysData(true),
    },
  ],
  date_range: {
    start_date: '2017-10-27',
    end_date: '2017-12-04',
  },
  time_period: TIME_PERIODS.customDateRange,
  decorators: {
    data_labels: false,
  },
});

const DummySummaryDonutGraphData = (graphGroup) => buildMedicalData(graphGroup);
const DummyValueVisualisationData = (graphGroup) =>
  buildMedicalData(graphGroup);

const DummySummaryStackBarGraphData = (graphGroup) => ({
  ...buildMedicalData(graphGroup),
  decorators: {
    data_labels: false,
  },
});

export const DummyLongitudinalGraphData = (graphGroup) => ({
  metrics: [
    {
      type: 'metric',
      status: buildStatusData(graphGroup)[0],
      squad_selection: squadSelectionData,
      series: [
        {
          fullname: 'Anderson Lima',
          datapoints: [
            [1512640002000, 1],
            [1512640003000, 1],
            [1512900000000, 0],
            [1519897602000, 0],
          ],
        },
        {
          fullname: 'Second Row',
          datapoints: [
            [1512640002000, 1],
            [1516268802000, 0],
            [1519292802000, 0],
            [1519897602000, 1],
          ],
        },
      ],
      overlays: buildMetricsOverlaysData(),
    },
    {
      type: 'metric',
      status: buildStatusData(graphGroup)[1],
      squad_selection: squadSelectionData,
      series: [
        {
          fullname: 'Left Wingers',
          datapoints: [
            [1512640002000, 275],
            [1519897602000, 475],
          ],
        },
        {
          fullname: 'John Jones',
          datapoints: [
            [1512640002000, 345],
            [1513288802000, 400],
            [1514292802000, 375],
            [1519897602000, 278],
          ],
        },
      ],
      overlays: buildMetricsOverlaysData(true),
    },
  ],
  date_range: {
    start_date: '2017-10-15 00:00:00',
    end_date: '2017-12-08 00:00:00',
  },
  time_period: TIME_PERIODS.customDateRange,
  injuries: [
    {
      has_unavailability: true,
      date: 1515157604000,
      events: [
        {
          athlete_name: 'David Anderson',
          description: 'Knee Post PCL reconstruction (Center)',
          caused_unavailability: true,
          days: 1,
          status: 'resolved',
        },
        {
          athlete_name: 'Anderson Lima',
          description: 'Loose body ankle joint',
          caused_unavailability: false,
          status: 'ongoing',
          days: 136,
        },
      ],
    },
    {
      has_unavailability: false,
      date: 1514460334000,
      events: [
        {
          athlete_name: 'Anderson Lima',
          description: 'Loose body ankle joint',
          caused_unavailability: false,
          status: 'ongoing',
          days: 136,
        },
      ],
    },
  ],
  illnesses: [
    {
      has_unavailability: true,
      date: 1511436334000,
      events: [
        {
          athlete_name: 'David Anderson',
          description: 'Knee Post PCL reconstruction (Center)',
          caused_unavailability: true,
          days: 1,
          status: 'resolved',
        },
        {
          athlete_name: 'Anderson Lima',
          description: 'Loose body ankle joint',
          caused_unavailability: false,
          status: 'ongoing',
          days: 136,
        },
      ],
    },
    {
      has_unavailability: false,
      date: 1514700000000,
      events: [
        {
          athlete_name: 'Anderson Lima',
          description: 'Loose body ankle joint',
          caused_unavailability: false,
          status: 'ongoing',
          days: 136,
        },
      ],
    },
  ],
  decorators: {
    illnesses: false,
    injuries: false,
  },
});

const DummyLongitudinalEventGraphData = (graphGroup) => {
  const data = DummyLongitudinalGraphData(graphGroup);

  data.categories = ['Drill 1', 'Drill 2'];
  data.metrics.forEach((metric, index) => {
    data.metrics[index].status.event_type_time_period = 'game';
    data.metrics[index].series = [
      {
        datapoints: [
          ['drill 1', 1],
          ['drill 2', 1],
          ['drill 3', 0],
          ['drill 4', 0],
        ],
      },
    ];
  });

  return data;
};

export const getDummyData = (graphGroup) => {
  switch (graphGroup) {
    case 'summary':
      return DummySummaryGraphData;
    case 'summaryBar':
      return DummySummaryBarGraphData(graphGroup);
    case 'longitudinal':
      return DummyLongitudinalGraphData(graphGroup);
    case 'longitudinalEvent':
      return DummyLongitudinalEventGraphData(graphGroup);
    case 'summaryDonut':
      return DummySummaryDonutGraphData(graphGroup);
    case 'summaryStackBar':
      return DummySummaryStackBarGraphData(graphGroup);
    case 'value_visualisation':
      return DummyValueVisualisationData(graphGroup);
    default:
      return null;
  }
};

const buildResponseStatusData = (responseType) => {
  const statusData = {
    source_key: 'combination|bc_-_skinfold_sum_/_body_weight',
    summary: 'last',
    name: 'BC - Skinfold Sum / Body Weight',
    localised_unit: '',
    type: 'number',
    grouped_with: [],
    event_type_time_period: 'drills',
    games: [],
    training_sessions: sampleTrainingSessions,
    drills: sampleDrills,
    selected_games: [],
    selected_training_sessions: sampleSelectedTrainingSessions,
    selected_drills: sampleSelectedDrills,
    event_breakdown: null,
  };

  if (responseType === 'longitudinal') {
    statusData.period_scope = TIME_PERIODS.lastXDays;
    statusData.period_length = 84;
    statusData.second_period_length = null;
    statusData.operator = null;
    statusData.second_period_all_time = null;
    statusData.aggregation_method = 'last';
  }

  return statusData;
};

const buildMedicalResponseMetricData = (graphGroup) => {
  const metricData = [
    {
      type: 'medical',
      main_category: 'illness',
      category: 'body_area',
      squad_selection: squadSelectionData,
    },
  ];

  if (graphGroup === 'value_visualisation') {
    metricData.forEach((metric, index) => {
      metricData[index].series = [
        {
          value: '32',
          name: 'Forwards',
        },
      ];
    });
  }

  if (graphGroup === 'summaryDonut') {
    metricData.forEach((metric, index) => {
      metricData[index].measurement_type = 'percentage';
      metricData[index].series = [
        {
          datapoints: [
            { name: 'Chest', y: 45 },
            { name: 'Ankle', y: 13 },
            { name: 'Leg', y: 32 },
          ],
        },
      ];
    });
  }

  if (graphGroup === 'summaryStackBar') {
    metricData.forEach((metric, index) => {
      metricData[index].category_division = 'pathology';
      metricData[index].series = [
        {
          name: 'Ankle',
          datapoints: [
            {
              name: 'Pathology 1',
              y: 3,
            },
            {
              name: 'Pathology 2',
              y: 5,
            },
          ],
        },
        {
          name: 'Neck',
          datapoints: [
            {
              name: 'Pathology 1',
              y: 4,
            },
            {
              name: 'Pathology 2',
              y: 2,
            },
          ],
        },
      ];
    });
  }

  return metricData;
};

export const DummyLongitudinalChartResponse = (graphGroup, graphType, id) => ({
  id,
  graph_type: graphType,
  graph_group: 'longitudinal',
  time_period: TIME_PERIODS.thisWeek,
  date_range: {},
  metrics: [
    {
      type: 'metric',
      status: buildResponseStatusData(graphGroup),
      squad_selection: squadSelectionData,
      series: [
        {
          fullname: 'Vincent Gutmann',
          datapoints: [
            [1532347199000, 0.0],
            [1532433599000, 2.0],
            [1532519999000, 5.0],
          ],
        },
      ],
    },
  ],
  illnesses: [],
  injuries: [],
});

export const DummySummaryBarChartResponse = (graphGroup, graphType) => ({
  id: 1,
  graph_type: graphType || 'column',
  graph_group: 'summary_bar',
  time_period: TIME_PERIODS.thisWeek,
  date_range: {},
  metrics: [
    {
      type: 'metric',
      status: buildResponseStatusData(graphGroup),
      squad_selection: squadSelectionData,
      series: [
        {
          name: 'BC - Skinfold Sum / Body Weight',
          datapoints: [
            {
              name: 'Athlete 1',
              y: 0.0,
            },
            {
              name: 'Athlete 2',
              y: 2.0,
            },
            {
              name: 'Athlete 3',
              y: 4.0,
            },
          ],
        },
      ],
    },
  ],
  decorators: {
    data_labels: false,
  },
});

export const DummySummaryStackBarChartResponse = (graphGroup, graphType) => ({
  id: 543,
  graph_type: graphType || 'column',
  graph_group: 'summary_stack_bar',
  time_period: TIME_PERIODS.thisWeek,
  date_range: {},
  metrics: buildMedicalResponseMetricData(graphGroup),
  name: 'Chart name',
  decorators: {
    data_labels: false,
  },
});

export const DummySummaryDonutChartResponse = (graphGroup, graphType) => ({
  id: 543,
  graph_type: graphType || 'donut',
  graph_group: 'summary_donut',
  time_period: TIME_PERIODS.thisWeek,
  date_range: {},
  metrics: buildMedicalResponseMetricData(graphGroup),
});

export const DummySummaryChartResponse = (graphGroup, graphType, id) => {
  const populations = [
    {
      squadSelection: squadSelectionData,
      calculation: 'min',
      timePeriod: TIME_PERIODS.yesterday,
      dateRange: {},
      comparisonGroup: true,
      event_type_time_period: 'drills',
      games: [],
      training_sessions: sampleTrainingSessions,
      drills: sampleDrills,
      selected_games: [],
      selected_training_sessions: sampleSelectedTrainingSessions,
      selected_drills: sampleSelectedDrills,
      event_breakdown: null,
    },
    {
      squadSelection: squadSelectionData,
      calculation: 'min',
      timePeriod: TIME_PERIODS.thisWeek,
      dateRange: {},
      comparisonGroup: false,
      event_type_time_period: 'drills',
      games: [],
      training_sessions: sampleTrainingSessions,
      drills: sampleDrills,
      selected_games: [],
      selected_training_sessions: sampleSelectedTrainingSessions,
      selected_drills: sampleSelectedDrills,
      event_breakdown: null,
    },
  ];

  return {
    id: id || 1456,
    graph_group: 'summary',
    graph_type: graphType || 'radar',
    metrics: [
      'kitman:stiffness_indication|abdominal',
      'kitman:ohs|ankle_angle_left',
      'kitman:ohs|ankle_angle_right',
    ],
    populations,
    cmpStdDevs: [null, null, null],
    series: [
      {
        name: 'Entire Squad',
        zScores: [null, null, null],
        values: [null, null, null],
      },
      {
        name: 'Loose-head Prop',
        zScores: [null, null, null],
        values: [null, null, null],
      },
    ],
  };
};

export const DummyValueVisualisationResponse = (graphGroup, graphType) => ({
  id: 543,
  graph_type: graphType || 'value',
  graph_group: 'value_visualisation',
  time_period: TIME_PERIODS.thisWeek,
  date_range: {},
  metrics: buildMedicalResponseMetricData(graphGroup),
  name: 'Chart name',
});

export const getDummyResponseData = (graphGroup, graphType, id) => {
  switch (graphGroup) {
    case 'summary':
      return DummySummaryChartResponse(graphGroup, graphType, id);
    case 'summaryBar':
      return DummySummaryBarChartResponse(graphGroup, graphType);
    case 'longitudinal':
      return DummyLongitudinalChartResponse(graphGroup, graphType, id);
    case 'summaryDonut':
      return DummySummaryDonutChartResponse(graphGroup, graphType);
    case 'summaryStackBar':
      return DummySummaryStackBarChartResponse(graphGroup, graphType);
    case 'value_visualisation':
      return DummyValueVisualisationResponse(graphGroup, graphType);
    default:
      return null;
  }
};

export const DummyVariablesHash = {
  'kitman:stiffness_indication|abdominal': {
    id: 1,
    key: 'msk',
    localised_unit: '1-10',
    name: 'Abdominal',
    source_key: 'kitman:stiffness_indication|abdominal',
    source_name: 'Stiffness',
    type: 'scale',
  },
  'kitman:ohs|ankle_angle_left': {
    id: 2,
    key: 'capture',
    localised_unit: 'degrees',
    name: 'Ankle Angle Left',
    source_key: 'kitman:ohs|ankle_angle_left',
    source_name: 'Overhead Squat',
    type: 'number',
  },
  'kitman:ohs|ankle_angle_right': {
    id: 3,
    key: 'well_being',
    localised_unit: 'degrees',
    name: 'Ankle Angle Right',
    source_key: 'kitman:ohs|ankle_angle_right',
    source_name: 'Right Y Balance',
    type: 'number',
  },
};

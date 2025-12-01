import {
  summaryTableFormatting,
  getOverlayName,
} from '@kitman/modules/src/analysis/shared/utils';
import { getDummyResponseData } from '@kitman/modules/src/analysis/shared/resources/graph/DummyData';
import {
  shouldRequestIncludeDateRange,
  transformGraphResponse,
  transformSummaryResponse,
  transformLoadingGraphResponse,
  buildGraphRequest,
  buildSummaryGraphRequest,
  getIsEditingDashboard,
  getIsEditingGraph,
  getContainerType,
  getCurrentDashboard,
  formatDashboardListForDropdown,
  formatOverlaysForRequest,
  getCategorySelections,
} from '../utils';

const mockURL = (getReturnValue) => {
  global.URL = class URL {
    constructor(url) {
      this.url = url;
      this.searchParams = {
        get: () => getReturnValue,
      };
    }
  };
};

describe('shouldRequestIncludeDateRange', () => {
  it('returns true when the time period is custom_date_range, game, or training_session', () => {
    expect(shouldRequestIncludeDateRange('last_x_days')).toBe(false);
    expect(shouldRequestIncludeDateRange('custom_date_range')).toBe(true);
    expect(shouldRequestIncludeDateRange('game')).toBe(true);
    expect(shouldRequestIncludeDateRange('training_session')).toBe(true);
  });

  it('returns false when the time period is not last_x_days, custom_date_range, game, or training_session', () => {
    expect(shouldRequestIncludeDateRange('today')).toBe(false);
  });
});

describe('transformGraphResponse', () => {
  it('returns the correct transformed data', () => {
    const formattedForReact = transformGraphResponse(
      getDummyResponseData('value_visualisation'),
      'value_visualisation'
    );

    expect(formattedForReact).toStrictEqual({
      graphData: {
        id: 543,
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [{ value: '32', name: 'Forwards' }],
          },
        ],
        graphGroup: 'value_visualisation',
        graphType: 'value',
        time_period: 'this_week',
        date_range: {},
        name: 'Chart name',
      },
      formData: {
        graphGroup: 'value_visualisation',
        metrics: [
          {
            squad_selection: {
              applies_to_squad: false,
              athletes: [],
              position_groups: [],
              positions: [71],
            },
            main_category: 'illness',
            category: 'body_area',
            type: 'medical',
            series: [{ value: '32', name: 'Forwards' }],
          },
        ],
        time_period: 'this_week',
        date_range: {},
      },
    });
  });

  describe('when the graph group is longitudinal', () => {
    it('returns the correct transformed data', () => {
      const formattedForReact = transformGraphResponse(
        getDummyResponseData('longitudinal'),
        'longitudinal'
      );

      expect(formattedForReact).toStrictEqual({
        graphData: {
          id: null,
          metrics: [
            {
              type: 'metric',
              status: {
                source_key: 'combination|bc_-_skinfold_sum_/_body_weight',
                summary: 'last',
                period_scope: 'last_x_days',
                period_length: 84,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                name: 'BC - Skinfold Sum / Body Weight',
                localised_unit: '',
                type: 'number',
                aggregation_method: 'last',
                drills: [
                  {
                    id: 1234,
                    name: 'Drill 1',
                  },
                  {
                    id: 5678,
                    name: 'Drill 2',
                  },
                ],
                event_breakdown: null,
                event_type_time_period: 'drills',
                games: [],
                grouped_with: [],
                selected_drills: [1234],
                selected_games: [],
                selected_training_sessions: [1234],
                training_sessions: [
                  {
                    date: '2017-10-27',
                    id: 1234,
                    session_type_name: 'Training Session',
                  },
                ],
              },
              squad_selection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              series: [
                {
                  fullname: 'Vincent Gutmann',
                  datapoints: [
                    [1532347199000, 0],
                    [1532433599000, 2],
                    [1532519999000, 5],
                  ],
                },
              ],
              overlays: [],
            },
          ],
          graphGroup: 'longitudinal',
          graphType: null,
          time_period: 'this_week',
          date_range: {},
          name: null,
          decorators: {
            data_labels: false,
            injuries: false,
            illnesses: false,
          },
          illnesses: [],
          injuries: [],
          categories: undefined,
          aggregationPeriod: 'day',
        },
        formData: {
          graphGroup: 'longitudinal',
          metrics: [
            {
              type: 'metric',
              status: {
                source_key: 'combination|bc_-_skinfold_sum_/_body_weight',
                summary: 'last',
                period_scope: 'last_x_days',
                period_length: 84,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                name: 'BC - Skinfold Sum / Body Weight',
                localised_unit: '',
                type: 'number',
                aggregation_method: 'last',
                drills: [
                  {
                    id: 1234,
                    name: 'Drill 1',
                  },
                  {
                    id: 5678,
                    name: 'Drill 2',
                  },
                ],
                event_breakdown: null,
                event_type_time_period: 'drills',
                games: [],
                grouped_with: [],
                selected_drills: [1234],
                selected_games: [],
                selected_training_sessions: [1234],
                training_sessions: [
                  {
                    date: '2017-10-27',
                    id: 1234,
                    session_type_name: 'Training Session',
                  },
                ],
              },
              squad_selection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              series: [
                {
                  fullname: 'Vincent Gutmann',
                  datapoints: [
                    [1532347199000, 0],
                    [1532433599000, 2],
                    [1532519999000, 5],
                  ],
                },
              ],
              overlays: [],
            },
          ],
          time_period: 'this_week',
          date_range: {},
        },
      });
    });
  });

  describe('when the graph group is summary bar', () => {
    it('returns the correct transformed data', () => {
      const formattedForReact = transformGraphResponse(
        getDummyResponseData('summaryBar'),
        'summary_bar'
      );

      const expectedMetrics = [
        {
          type: 'metric',
          status: {
            source_key: 'combination|bc_-_skinfold_sum_/_body_weight',
            summary: 'last',
            name: 'BC - Skinfold Sum / Body Weight',
            localised_unit: '',
            type: 'number',
            grouped_with: [],
            drills: [
              {
                id: 1234,
                name: 'Drill 1',
              },
              {
                id: 5678,
                name: 'Drill 2',
              },
            ],
            event_breakdown: null,
            event_type_time_period: 'drills',
            games: [],
            selected_drills: [1234],
            selected_games: [],
            selected_training_sessions: [1234],
            training_sessions: [
              {
                date: '2017-10-27',
                id: 1234,
                session_type_name: 'Training Session',
              },
            ],
          },
          squad_selection: {
            athletes: [],
            positions: [71],
            position_groups: [],
            applies_to_squad: false,
          },
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
          overlays: [],
        },
      ];

      expect(formattedForReact).toStrictEqual({
        graphData: {
          id: 1,
          metrics: expectedMetrics,
          graphGroup: 'summary_bar',
          graphType: 'column',
          time_period: 'this_week',
          date_range: {},
          name: null,
          decorators: {
            data_labels: false,
            hide_nulls: false,
            hide_zeros: false,
          },
        },
        formData: {
          graphGroup: 'summary_bar',
          metrics: [
            {
              status: expectedMetrics[0].status,
              type: expectedMetrics[0].type,
              squad_selection: expectedMetrics[0].squad_selection,
              overlays: expectedMetrics[0].overlays,
              series: expectedMetrics[0].series,
            },
          ],
          time_period: 'this_week',
          date_range: {},
        },
      });
    });
  });

  describe('when the graph group is summary stack bar', () => {
    it('returns the correct transformed data', () => {
      const formattedForReact = transformGraphResponse(
        getDummyResponseData('summaryStackBar'),
        'summary_stack_bar'
      );

      const expectedMetrics = [
        {
          main_category: 'illness',
          category: 'body_area',
          category_division: 'pathology',
          series: [
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
          ],
          squad_selection: {
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [71],
          },
          type: 'medical',
        },
      ];

      expect(formattedForReact).toStrictEqual({
        graphData: {
          date_range: {},
          graphGroup: 'summary_stack_bar',
          graphType: 'column',
          id: 543,
          name: 'Chart name',
          metrics: expectedMetrics,
          time_period: 'this_week',
          decorators: {
            data_labels: false,
            hide_nulls: false,
            hide_zeros: false,
          },
        },
        formData: {
          graphGroup: 'summary_stack_bar',
          metrics: [
            {
              type: 'medical',
              squad_selection: expectedMetrics[0].squad_selection,
              main_category: expectedMetrics[0].main_category,
              category: expectedMetrics[0].category,
              category_division: expectedMetrics[0].category_division,
              series: expectedMetrics[0].series,
            },
          ],
          time_period: 'this_week',
          date_range: {},
        },
      });
    });
  });
});

describe('transformSummaryResponse', () => {
  let response;
  let expectedData;
  const variableHash = {
    'kitman:stiffness_indication|abdominal': {
      source_key: 'kitman:stiffness_indication|abdominal',
      name: 'Abdominal',
    },
    'kitman:soreness_indication|strength': {
      source_key: 'kitman:soreness_indication|strength',
      name: 'Strength',
    },
  };

  beforeEach(() => {
    response = {
      id: 123,
      graph_type: 'radar',
      graphType: 'radar',
      scale_type: 'normalized',
      name: null,
      series: [
        {
          name: 'Bob',
          data: [23, 19, 74],
        },
        {
          name: 'Jim',
          data: [10, 7, 32],
        },
      ],
      cmpStdDevs: [1.4, 2.5, 1.89],
      metrics: [
        {
          source_key: 'kitman:stiffness_indication|abdominal',
        },
        {
          source_key: 'kitman:soreness_indication|strength',
        },
      ],
      populations: [
        {
          squadSelection: {
            athletes: [20],
          },
          calculation: 'mean',
          timePeriod: 'this_in_season',
          event_type_time_period: 'this_in_season',
          time_period_length: null,
          dateRange: {
            startDate: '2018-05-20T23:59:59+01:00',
            endDate: '2018-05-13T00:00:00+01:00',
          },
          comparisonGroup: false,
        },
        {
          squadSelection: {
            position_groups: [1],
          },
          calculation: 'min',
          timePeriod: 'custom_date_range',
          event_type_time_period: 'custom_date_range',
          time_period_length: null,
          dateRange: {
            startDate: '2018-05-20T23:59:59+01:00',
            endDate: '2018-05-13T00:00:00+01:00',
          },
          comparisonGroup: true,
        },
      ],
    };

    expectedData = {
      graphData: {
        id: 123,
        graphType: 'radar',
        scale_type: 'normalized',
        metrics: [
          {
            source_key: 'kitman:stiffness_indication|abdominal',
            name: 'Abdominal',
          },
          {
            name: 'Strength',
            source_key: 'kitman:soreness_indication|strength',
          },
        ],
        name: null,
        series: [
          {
            name: 'Bob',
            data: [23, 19, 74],
            timePeriod: 'this_in_season',
            event_type_time_period: 'this_in_season',
            event_breakdown: null,
            selected_games: [],
            selected_training_sessions: [],
            dateRange: {
              endDate: '2018-05-13T00:00:00+01:00',
              startDate: '2018-05-20T23:59:59+01:00',
            },
            time_period_length: null,
            last_x_time_period: 'days',
            time_period_length_offset: null,
            last_x_time_period_offset: 'days',
          },
          {
            name: 'Jim',
            data: [10, 7, 32],
            timePeriod: 'custom_date_range',
            event_type_time_period: 'custom_date_range',
            event_breakdown: null,
            selected_games: [],
            selected_training_sessions: [],
            dateRange: {
              startDate: '2018-05-20T23:59:59+01:00',
              endDate: '2018-05-13T00:00:00+01:00',
            },
            time_period_length: null,
            last_x_time_period: 'days',
            time_period_length_offset: null,
            last_x_time_period_offset: 'days',
          },
        ],
        cmpStdDevs: [1.4, 2.5, 1.89],
        graphGroup: 'summary',
        illnesses: [],
        injuries: [],
      },
      formData: {
        scale_type: 'normalized',
        population: [
          {
            athletes: 'athlete_20',
            calculation: 'mean',
            timePeriod: 'this_in_season',
            event_type_time_period: 'this_in_season',
            dateRange: {},
            comparisonGroup: false,
            squadSelection: {
              athletes: [20],
            },
            time_period_length: null,
            last_x_time_period: 'days',
            time_period_length_offset: null,
            last_x_time_period_offset: 'days',
          },
          {
            athletes: 'position_group_1',
            calculation: 'min',
            timePeriod: 'custom_date_range',
            event_type_time_period: 'custom_date_range',
            dateRange: {
              start_date: '2018-05-20T23:59:59+01:00',
              end_date: '2018-05-13T00:00:00+01:00',
            },
            comparisonGroup: true,
            squadSelection: {
              position_groups: [1],
            },
            time_period_length: null,
            last_x_time_period: 'days',
            time_period_length_offset: null,
            last_x_time_period_offset: 'days',
          },
        ],
        metrics: [
          { source_key: 'kitman:stiffness_indication|abdominal' },
          { source_key: 'kitman:soreness_indication|strength' },
        ],
        comparisonGroupIndex: 1,
      },
    };
  });

  it('creates the correct react state from the backend response', () => {
    const formattedForReact = transformSummaryResponse(response, variableHash);
    expect(formattedForReact).toStrictEqual(expectedData);
  });

  describe('when the data has selected game or training session', () => {
    let drillResponse;
    let expectedDrillData;

    beforeEach(() => {
      drillResponse = {
        id: 123,
        graph_type: 'radar',
        graphType: 'radar',
        scale_type: 'normalized',
        name: null,
        series: [
          {
            name: 'Bob',
            data: [23, 19, 74],
          },
        ],
        cmpStdDevs: [1.4, 2.5, 1.89],
        metrics: [
          {
            source_key: 'kitman:stiffness_indication|abdominal',
          },
        ],
        populations: [
          {
            squadSelection: {
              athletes: [20],
            },
            calculation: 'mean',
            timePeriod: 'game',
            event_type_time_period: 'game',
            time_period_length: null,
            dateRange: {
              startDate: '2018-05-20T23:59:59+01:00',
              endDate: '2018-05-13T00:00:00+01:00',
            },
            comparisonGroup: false,
            selected_games: [1234],
            selected_training_sessions: [5678],
            event_breakdown: 'drill',
          },
        ],
      };

      expectedDrillData = {
        graphData: {
          id: 123,
          graphType: 'radar',
          scale_type: 'normalized',
          metrics: [
            {
              source_key: 'kitman:stiffness_indication|abdominal',
              name: 'Abdominal',
            },
          ],
          name: null,
          series: [
            {
              name: 'Bob',
              data: [23, 19, 74],
              timePeriod: 'game',
              event_type_time_period: 'game',
              event_breakdown: 'drill',
              selected_games: [1234],
              selected_training_sessions: [5678],
              dateRange: {
                endDate: '2018-05-13T00:00:00+01:00',
                startDate: '2018-05-20T23:59:59+01:00',
              },
              time_period_length: null,
              last_x_time_period: 'days',
              time_period_length_offset: null,
              last_x_time_period_offset: 'days',
            },
          ],
          cmpStdDevs: [1.4, 2.5, 1.89],
          graphGroup: 'summary',
          illnesses: [],
          injuries: [],
        },
        formData: {
          scale_type: 'normalized',
          population: [
            {
              athletes: 'athlete_20',
              calculation: 'mean',
              timePeriod: 'game',
              event_type_time_period: 'game',
              dateRange: {
                start_date: '2018-05-20T23:59:59+01:00',
                end_date: '2018-05-13T00:00:00+01:00',
              },
              comparisonGroup: false,
              squadSelection: {
                athletes: [20],
              },
              time_period_length: null,
              last_x_time_period: 'days',
              time_period_length_offset: null,
              last_x_time_period_offset: 'days',
              event_breakdown: 'drill',
              selected_games: [1234],
              selected_training_sessions: [5678],
            },
          ],
          metrics: [{ source_key: 'kitman:stiffness_indication|abdominal' }],
          comparisonGroupIndex: null,
        },
      };
    });

    it('creates the correct react state from the backend response', () => {
      const formattedForReact = transformSummaryResponse(
        drillResponse,
        variableHash
      );
      expect(formattedForReact).toStrictEqual(expectedDrillData);
    });
  });
});

describe('transformLoadingGraphResponse', () => {
  it('creates the correct react state from the backend response', () => {
    const loadingGraph = {
      id: 1,
      graph_type: 'table',
      graph_group: 'longitudinal',
    };

    expect(transformLoadingGraphResponse(loadingGraph)).toStrictEqual({
      id: 1,
      graphType: 'table',
      graphGroup: 'longitudinal',
      isLoading: true,
      error: false,
      name: null,
    });
  });
});

describe('buildGraphRequest', () => {
  it('creates the correct request data', () => {
    const formData = {
      metrics: [
        {
          type: 'metric',
          status: {
            source_key: 'kitman:tv|ankle_mobility_right',
            summary: 'min',
            period_scope: 'today',
            period_length: null,
            second_period_length: null,
            operator: null,
            second_period_all_time: null,
            name: 'Ankle Mobility - Right',
            localised_unit: 'cm',
            type: 'number',
            variable_max: 60,
            variable_min: 0,
            aggregation_method: 'min',
          },
          squad_selection: {
            athletes: [],
            positions: [],
            position_groups: [],
            applies_to_squad: true,
            all_squads: false,
            squads: [],
          },
          series: [
            {
              fullname: 'Entire Squad',
              datapoints: [],
            },
          ],
        },
      ],
      time_period: 'custom_date_range',
      event_type_time_period: 'custom_date_range',
      date_range: {
        start_date: '2018-07-22T23:00:00Z',
        end_date: '2018-07-23T22:59:59Z',
      },
    };

    const formattedForRequest = buildGraphRequest(
      'longitudinal',
      formData,
      'line'
    );

    expect(formattedForRequest).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: {
            source_key: 'kitman:tv|ankle_mobility_right',
            summary: 'min',
            period_scope: 'today',
            period_length: null,
            second_period_length: null,
            operator: null,
            second_period_all_time: null,
            name: 'Ankle Mobility - Right',
            localised_unit: 'cm',
            type: 'number',
            variable_max: 60,
            variable_min: 0,
            aggregation_method: 'min',
          },
          squad_selection: {
            athletes: [],
            positions: [],
            position_groups: [],
            applies_to_squad: true,
            all_squads: false,
            squads: [],
          },
          series: [
            {
              fullname: 'Entire Squad',
              datapoints: [],
            },
          ],
          metric_style: null,
          overlays: [],
        },
      ],
      date_range: {
        start_date: '2018-07-22T23:00:00Z',
        end_date: '2018-07-23T22:59:59Z',
      },
      time_period: 'custom_date_range',
      graph_type: 'line',
      graph_group: 'longitudinal',
      aggregation_period: 'day',
      decorators: {
        data_labels: false,
      },
    });
  });

  it('clears date_range if the time period is not custom_date_range', () => {
    const formData = {
      metrics: [
        {
          type: 'metric',
          status: {
            source_key: 'kitman:tv|ankle_mobility_right',
          },
          squad_selection: {
            athletes: [],
            positions: [],
            position_groups: [],
            applies_to_squad: true,
          },
          series: [],
        },
      ],
      time_period: 'this_week',
      date_range: {
        start_date: '2018-07-22T23:00:00Z',
        end_date: '2018-07-23T22:59:59Z',
      },
    };

    const formattedForRequest = buildGraphRequest(
      'value_visualisation',
      formData,
      'value'
    );

    expect(formattedForRequest.date_range).toStrictEqual({});
  });

  describe('when the graph group is longitudinal', () => {
    it('creates the correct request data', () => {
      const formData = {
        metrics: [
          {
            type: 'custom',
            status: {
              source_key: 'kitman:tv|ankle_mobility_right',
            },
            squad_selection: {
              athletes: [],
              positions: [],
              position_groups: [],
              applies_to_squad: true,
            },
            series: [],
            metric_style: 'line',
            overlays: [],
          },
        ],
        time_period: 'this_week',
        date_range: {},
      };

      const formattedForRequest = buildGraphRequest(
        'longitudinal',
        formData,
        'combination'
      );

      expect(formattedForRequest).toStrictEqual({
        metrics: [
          {
            type: 'custom',
            status: {
              source_key: 'kitman:tv|ankle_mobility_right',
            },
            squad_selection: {
              athletes: [],
              positions: [],
              position_groups: [],
              applies_to_squad: true,
            },
            series: [],
            metric_style: 'line',
            overlays: [],
          },
        ],
        date_range: {},
        time_period: 'this_week',
        graph_type: 'combination',
        graph_group: 'longitudinal',
        aggregation_period: 'day',
        decorators: {
          data_labels: false,
        },
      });
    });
  });

  describe('when the graph group is summary bar', () => {
    it('creates the correct request data', () => {
      const formData = {
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [{ value: '32', name: 'Forwards' }],
            overlays: [],
          },
        ],
        time_period: 'this_week',
        date_range: {},
      };

      const formattedForRequest = buildGraphRequest(
        'summary_bar',
        formData,
        'bar'
      );

      expect(formattedForRequest).toStrictEqual({
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [{ value: '32', name: 'Forwards' }],
            overlays: [],
          },
        ],
        date_range: {},
        time_period: 'this_week',
        graph_type: 'bar',
        graph_group: 'summary_bar',
        decorators: {
          data_labels: false,
          hide_nulls: false,
          hide_zeros: false,
        },
      });
    });
  });

  describe('when the graph group is summary stack', () => {
    it('creates the correct request data', () => {
      const formData = {
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            category_division: 'pathology',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [{ value: '32', name: 'Forwards' }],
          },
        ],
        time_period: 'this_week',
        date_range: {},
      };

      const formattedForRequest = buildGraphRequest(
        'summary_stack_bar',
        formData,
        'stackedbar'
      );

      expect(formattedForRequest).toStrictEqual({
        metrics: [
          {
            type: 'medical',
            main_category: 'illness',
            category: 'body_area',
            category_division: 'pathology',
            squad_selection: {
              athletes: [],
              positions: [71],
              position_groups: [],
              applies_to_squad: false,
            },
            series: [{ value: '32', name: 'Forwards' }],
          },
        ],
        date_range: {},
        time_period: 'this_week',
        graph_type: 'stackedbar',
        graph_group: 'summary_stack_bar',
        decorators: {
          data_labels: false,
          hide_nulls: false,
          hide_zeros: false,
        },
      });
    });
  });
});

describe('buildSummaryGraphRequest', () => {
  it('creates the correct request data from the react state', () => {
    const reactState = {
      scale_type: 'normalized',
      population: [
        {
          athletes: 'athlete_123',
          calculation: 'mean',
          timePeriod: 'today',
          dateRange: {
            start_date: '2018-05-20T23:59:59+01:00',
            end_date: '2018-05-13T00:00:00+01:00',
          },
          selected_games: [],
          selected_training_sessions: [1234],
          event_breakdown: 'DRILLS',
          event_type_time_period: 'today',
        },
        {
          athletes: 'position_group_76',
          calculation: 'sum',
          timePeriod: 'custom_date_range',
          dateRange: {
            start_date: '2018-05-20T23:59:59+01:00',
            end_date: '2018-05-13T00:00:00+01:00',
          },
          selected_games: [],
          selected_training_sessions: [1234],
          event_breakdown: 'DRILLS',
          event_type_time_period: 'custom_date_range',
        },
      ],
      metrics: [
        { source_key: 'kitman:stiffness_indication|abdominal' },
        { source_key: 'kitman:soreness_indication|strength' },
      ],
      comparisonGroupIndex: 1,
    };

    const formattedForRequest = buildSummaryGraphRequest(reactState, 'radar');

    expect(formattedForRequest).toStrictEqual({
      graph_type: 'radar',
      graph_group: 'summary',
      scale_type: 'normalized',
      metrics: [
        {
          source_key: 'kitman:stiffness_indication|abdominal',
        },
        {
          source_key: 'kitman:soreness_indication|strength',
        },
      ],
      populations: [
        {
          athletes: 'athlete_123',
          calculation: 'mean',
          timePeriod: 'today',
          dateRange: {},
          squadSelection: {
            positions: [],
            position_groups: [],
            athletes: [123],
            applies_to_squad: false,
            all_squads: false,
            squads: [],
          },
          comparisonGroup: false,
          selected_games: [],
          selected_training_sessions: [1234],
          event_breakdown: 'DRILLS',
          event_type_time_period: 'today',
        },
        {
          athletes: 'position_group_76',
          calculation: 'sum',
          timePeriod: 'custom_date_range',
          dateRange: {
            startDate: '2018-05-20T23:59:59+01:00',
            endDate: '2018-05-13T00:00:00+01:00',
          },
          squadSelection: {
            positions: [],
            position_groups: [76],
            athletes: [],
            applies_to_squad: false,
            all_squads: false,
            squads: [],
          },
          comparisonGroup: true,
          selected_games: [],
          selected_training_sessions: [1234],
          event_breakdown: 'DRILLS',
          event_type_time_period: 'custom_date_range',
        },
      ],
    });
  });
});

describe('summaryTableFormatting', () => {
  it('formats the summary graph data for the table', () => {
    const graphData = {
      metrics: [
        {
          name: 'Abdominal',
        },
        {
          name: 'Strength',
        },
        {
          name: 'Game Minutes',
        },
      ],
      series: [
        {
          name: 'Bob',
          zScores: [23, 19, 74],
        },
        {
          name: 'Jim',
          zScores: [10, 7, 32],
        },
      ],
      graphGroup: 'summary',
      illnesses: [],
      injuries: [],
    };

    expect(summaryTableFormatting(graphData)).toStrictEqual({
      metrics: [
        {
          name: 'Abdominal',
          data: [23, 10],
        },
        {
          name: 'Strength',
          data: [19, 7],
        },
        {
          name: 'Game Minutes',
          data: [74, 32],
        },
      ],
      series: ['Bob', 'Jim'],
    });
  });

  it('formats the summary data with raw values when scale type is "denormalized"', () => {
    const graphData = {
      metrics: [
        {
          name: 'Abdominal',
        },
        {
          name: 'Strength',
        },
        {
          name: 'Game Minutes',
        },
      ],
      series: [
        {
          name: 'Bob',
          data: [23, 19, 74],
          zScores: [23, 19, 74],
        },
        {
          name: 'Jim',
          data: [10, 7, 32],
          zScores: [10, 7, 32],
        },
      ],
      scale_type: 'denormalized',
      graphGroup: 'summary',
      illnesses: [],
      injuries: [],
    };

    expect(summaryTableFormatting(graphData)).toStrictEqual({
      metrics: [
        {
          name: 'Abdominal',
          data: [23, 10],
        },
        {
          name: 'Strength',
          data: [19, 7],
        },
        {
          name: 'Game Minutes',
          data: [74, 32],
        },
      ],
      series: ['Bob', 'Jim'],
    });
  });
});

describe('getIsEditingDashboard', () => {
  it('returns true if editing an analytical dashboard', () => {
    mockURL('4');

    expect(getIsEditingDashboard()).toBe(true);
  });

  it('returns true if editing an home dashboard', () => {
    mockURL('4');

    expect(getIsEditingDashboard()).toBe(true);
  });

  it('returns false if not editing an analytical dashboard', () => {
    mockURL(undefined);

    expect(getIsEditingDashboard()).toBe(false);
  });

  it('returns false if not editing a home dashboard', () => {
    mockURL(undefined);

    expect(getIsEditingDashboard()).toBe(false);
  });
});

describe('getContainerType', () => {
  it('returns "HomeDashboard" when home_dashboard_id is defined', () => {
    mockURL('4');
    expect(getContainerType()).toBe('HomeDashboard');
  });

  it('returns "HomeDashboard" when deeplink equals home_dashboard', () => {
    mockURL('home_dashboard');

    expect(getContainerType()).toBe('HomeDashboard');
  });

  it('returns "AnalyticalDashboard" when home_dashboard_id is not defined', () => {
    mockURL(undefined);

    expect(getContainerType()).toBe('AnalyticalDashboard');
  });
});

describe('getCurrentDashboard', () => {
  const dashboardList = [
    { id: 2, name: 'Dashboard 1' },
    { id: 4, name: 'Dashboard 2' },
  ];

  it('returns the current dashboard if editing an analytical dashboard', () => {
    mockURL('4');

    expect(getCurrentDashboard(dashboardList)).toStrictEqual({
      id: 4,
      name: 'Dashboard 2',
    });
  });

  it('returns the current dashboard if editing a home dashboard', () => {
    mockURL('2');

    expect(getCurrentDashboard(dashboardList)).toStrictEqual({
      id: 2,
      name: 'Dashboard 1',
    });
  });

  it('returns null if not edition a dashboard', () => {
    mockURL(undefined);

    expect(getCurrentDashboard(dashboardList)).toBe(null);
  });
});

describe('getIsEditingGraph', () => {
  it('returns true if editing a graph', () => {
    mockURL('4');

    expect(getIsEditingGraph()).toBe(true);
  });

  it('returns false if not editing a graph', () => {
    mockURL(undefined);

    expect(getIsEditingGraph()).toBe(false);
  });
});

describe('formatDashboardListForDropdown', () => {
  it('formats the dashboard list to a Dropdown item array', () => {
    const dashboardListFromServer = [
      {
        id: '4',
        name: 'Dashboard Name',
      },
      {
        id: '5',
        name: 'Other Dashboard Name',
      },
    ];

    const expectedFormatedDashboardList = [
      {
        id: '4',
        title: 'Dashboard Name',
      },
      {
        id: '5',
        title: 'Other Dashboard Name',
      },
    ];

    const formatedDashboardList = formatDashboardListForDropdown(
      dashboardListFromServer
    );

    expect(formatedDashboardList).toStrictEqual(expectedFormatedDashboardList);
  });
});

describe('getOverlayName()', () => {
  describe('when the standard-date-formatting flag is off and the time period is custom_date_range', () => {
    it('returns the overlay name with the start and end date', () => {
      const overlay = {
        value: 6.29,
        name: 'Attacker',
        timePeriod: 'custom_date_range',
        dateRange: {
          start_date: '2017-03-24T00:00:00.000Z',
          end_date: '2018-12-30T23:59:59.000Z',
        },
        population: 'position_group_22',
        summary: 'max',
      };

      expect(getOverlayName(overlay)).toBe(
        'Attacker Max (24 Mar 2017 - 30 Dec 2018)'
      );
    });
  });

  describe('when the standard-date-formatting flag is on and the time period is custom_date_range', () => {
    beforeEach(() => {
      window.setFlag('standard-date-formatting', true);
    });

    afterEach(() => {
      window.setFlag('standard-date-formatting', false);
    });

    it('returns the overlay name with the start and end date', () => {
      const overlay = {
        value: 6.29,
        name: 'Attacker',
        timePeriod: 'custom_date_range',
        dateRange: {
          start_date: '2017-03-24T00:00:00.000Z',
          end_date: '2018-12-30T23:59:59.000Z',
        },
        population: 'position_group_22',
        summary: 'max',
      };

      expect(getOverlayName(overlay)).toBe(
        'Attacker Max (Mar 24, 2017 - Dec 30, 2018)'
      );
    });
  });

  describe('When the time period is not custom_date_range', () => {
    it('returns the overlay name with the correct timeperiod', () => {
      const overlay = {
        value: 2.33,
        name: 'Goaltender',
        timePeriod: 'this_season',
        dateRange: {
          start_date: '2017-03-24T00:00:00.000Z',
          end_date: '2018-12-30T23:59:59.000Z',
        },
        population: 'position_group_20',
        summary: 'mean',
      };

      expect(getOverlayName(overlay)).toBe('Goaltender Mean (This Season)');
    });
  });

  describe('overlays request', () => {
    it('clears date_range if the time period is not custom_date_range', () => {
      const overlay = {
        summary: 'mean',
        population: 'position_group_22',
        timePeriod: 'today',
        dateRange: {
          start_date: '2018-07-22T23:00:00Z',
          end_date: '2018-07-23T22:59:59Z',
        },
      };
      const formattedForOverlayRequest = formatOverlaysForRequest([overlay]);
      expect(formattedForOverlayRequest[0].date_range).toStrictEqual({});
    });

    it('saves date range when time period is custom_date_range', () => {
      const overlay = {
        summary: 'mean',
        population: 'position_group_22',
        timePeriod: 'custom_date_range',
        dateRange: {
          start_date: '2018-07-22T23:00:00Z',
          end_date: '2018-07-23T22:59:59Z',
        },
      };
      const formattedForOverlayRequest = formatOverlaysForRequest([overlay]);
      expect(formattedForOverlayRequest[0].date_range).toStrictEqual({
        start_date: '2018-07-22T23:00:00Z',
        end_date: '2018-07-23T22:59:59Z',
      });
    });

    it('does not save date range when time period is last_x_days', () => {
      const overlay = {
        summary: 'mean',
        population: 'position_group_22',
        timePeriod: 'last_x_days',
        dateRange: {
          start_date: '2018-07-22T23:00:00Z',
          end_date: '2018-07-23T22:59:59Z',
        },
      };
      const formattedForOverlayRequest = formatOverlaysForRequest([overlay]);
      expect(formattedForOverlayRequest[0].date_range).toStrictEqual({});
    });
  });
});

describe('getCategorySelections()', () => {
  const staticData = {
    injuryPathologies: [
      {
        id: 1,
        title: 'Ankle Fracture',
      },
    ],
    illnessPathologies: [
      {
        id: 1,
        title: 'Bronchitis',
      },
    ],
    injuryBodyAreas: [
      {
        id: 1,
        title: 'Ankle',
      },
    ],
    illnessBodyAreas: [
      {
        id: 1,
        title: 'Chest',
      },
    ],
    injuryClassifications: [
      {
        id: 1,
        title: 'Fracture',
      },
    ],
    illnessClassifications: [
      {
        id: 1,
        title: 'Vascular',
      },
    ],
    activities: [
      {
        id: 1,
        title: 'Rugby Game',
      },
    ],
    sessionsTypes: [
      {
        id: 1,
        title: 'Training session',
      },
    ],
    contactTypes: [
      {
        id: 1,
        title: 'Collision',
      },
    ],
    diagnostics: [
      {
        id: 19,
        name: '3D Analysis',
      },
    ],
  };

  it('returns the correct category selections', () => {
    // Injuries
    expect(
      getCategorySelections('injury', 'pathology', staticData)
    ).toStrictEqual(staticData.injuryPathologies);
    expect(
      getCategorySelections('injury', 'body_area', staticData)
    ).toStrictEqual(staticData.injuryBodyAreas);
    expect(
      getCategorySelections('injury', 'classification', staticData)
    ).toStrictEqual(staticData.injuryClassifications);
    expect(
      getCategorySelections('injury', 'activity', staticData)
    ).toStrictEqual(staticData.activities);
    expect(
      getCategorySelections('injury', 'session_type', staticData)
    ).toStrictEqual(staticData.sessionsTypes);
    expect(
      getCategorySelections('injury', 'contact_type', staticData)
    ).toStrictEqual(staticData.contactTypes);
    expect(getCategorySelections('injury', null, staticData)).toStrictEqual([]);

    // Illnesses
    expect(
      getCategorySelections('illness', 'pathology', staticData)
    ).toStrictEqual(staticData.illnessPathologies);
    expect(
      getCategorySelections('illness', 'body_area', staticData)
    ).toStrictEqual(staticData.illnessBodyAreas);
    expect(
      getCategorySelections('illness', 'classification', staticData)
    ).toStrictEqual(staticData.illnessClassifications);
    expect(getCategorySelections('illness', null, staticData)).toStrictEqual(
      []
    );

    // General Medical
    expect(
      getCategorySelections('general_medical', 'diagnostic', staticData)
    ).toStrictEqual(staticData.diagnostics);

    // Other
    expect(getCategorySelections(null, null, staticData)).toStrictEqual([]);
  });
});

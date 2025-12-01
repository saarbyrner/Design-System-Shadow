import GraphData from '../GraphData';

describe('graphComposer - GraphData reducer', () => {
  it('returns correct state on SHOW_DIALOGUE', () => {
    const initialState = {
      metrics: [],
      date_range: null,
      decorators: {
        injuries: false,
        illnesses: false,
      },
      aggregationPeriod: 'day',
    };

    const action = {
      type: 'SHOW_DIALOGUE',
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(initialState);
  });

  it('returns correct state on UPDATE_DECORATORS', () => {
    const initialState = {
      longitudinal: {
        metrics: [],
        date_range: null,
        decorators: {
          injuries: false,
          illnesses: false,
        },
        aggregationPeriod: 'day',
      },
      summary: {},
    };

    const newDecorators = {
      injuries: true,
      illnesses: false,
    };

    const action = {
      type: 'UPDATE_DECORATORS',
      payload: {
        graphGroup: 'longitudinal',
        decorators: newDecorators,
      },
    };

    const expectedState = {
      longitudinal: {
        metrics: [],
        date_range: null,
        decorators: newDecorators,
        aggregationPeriod: 'day',
      },
      summary: {},
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on UPDATE_AGGREGATION_PERIOD', () => {
    const initialState = {
      longitudinal: {
        metrics: [],
        date_range: null,
        decorators: {
          availability: false,
          injuries: false,
          illnesses: false,
        },
        aggregationPeriod: 'day',
      },
      summary: {},
    };

    const newAggregationPeriod = 'week';

    const action = {
      type: 'UPDATE_AGGREGATION_PERIOD',
      payload: {
        aggregationPeriod: newAggregationPeriod,
      },
    };

    const expectedState = {
      longitudinal: {
        metrics: [],
        date_range: null,
        decorators: {
          availability: false,
          injuries: false,
          illnesses: false,
        },
        aggregationPeriod: 'week',
      },
      summary: {},
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formLongitudinal/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {
      longitudinal: {
        id: 123,
        metrics: [],
        date_range: null,
        decorators: {
          injuries: false,
          illnesses: false,
        },
        aggregationPeriod: 'month',
      },
      summary: {},
    };

    const action = {
      type: 'formLongitudinal/COMPOSE_GRAPH_SUCCESS',
      payload: {
        graphData: {
          metrics: [
            {
              status: {
                name: 'First Status',
              },
            },
            {
              status: {
                name: 'Second Status',
              },
            },
          ],
          injuries: [],
          illnesses: [],
          time_period: 'last_x_days',
          date_range: {
            start_date: '2018-02-23 00:00:00',
            end_date: '2018-03-23 23:59:59',
          },
          categories: [],
          decorators: {
            injuries: false,
            illnesses: false,
          },
        },
      },
    };

    const expectedState = {
      longitudinal: {
        id: 123,
        metrics: action.payload.graphData.metrics,
        injuries: action.payload.graphData.injuries,
        illnesses: action.payload.graphData.illnesses,
        time_period: 'last_x_days',
        date_range: {
          start_date: '2018-02-23 00:00:00',
          end_date: '2018-03-23 23:59:59',
        },
        categories: [],
        decorators: {
          injuries: false,
          illnesses: false,
        },
        aggregationPeriod: 'day',
      },
      summary: {},
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {
      longitudinal: {},
      summary: {
        id: 123,
        metrics: [],
        series: [],
        illnesses: [],
        injuries: [],
      },
    };

    const action = {
      type: 'formSummary/COMPOSE_GRAPH_SUCCESS',
      payload: {
        graphData: {
          graphGroup: 'summary',
          metrics: ['Abdominal', 'Strength'],
          series: [
            {
              name: 'Metric 1',
              data: [23, 19, 74],
            },
            {
              name: 'Metric 2',
              data: [10, 7, 32],
            },
          ],
          illnesses: [],
          injuries: [],
          cmpStdDevs: [1.4, 2.1],
          scale_type: 'normalized',
        },
        groupSpecificFormData: {
          populations: [
            {
              athlete: 'athlete_20',
              calculation: 'mean',
              timePeriod: 'this_in_season',
            },
            {
              athlete: 'position_group_1',
              calculation: 'min',
              timePeriod: 'today',
            },
          ],
          metrics: [
            'kitman:stiffness_indication|abdominal',
            'kitman:soreness_indication|strength',
          ],
          comparisonGroupIndex: 1,
          scale_type: 'normalized',
        },
      },
    };

    const expectedState = {
      longitudinal: {},
      summary: {
        id: 123,
        graphGroup: 'summary',
        metrics: ['Abdominal', 'Strength'],
        series: [
          {
            name: 'Metric 1',
            data: [23, 19, 74],
          },
          {
            name: 'Metric 2',
            data: [10, 7, 32],
          },
        ],
        illnesses: [],
        injuries: [],
        cmpStdDevs: [1.4, 2.1],
        scale_type: 'normalized',
      },
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummaryBar/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {
      summaryBar: {
        id: 123,
        metrics: [],
        date_range: null,
        decorators: {
          data_labels: false,
        },
      },
    };

    const action = {
      type: 'formSummaryBar/COMPOSE_GRAPH_SUCCESS',
      payload: {
        graphData: {
          graphGroup: 'summary_bar',
          metrics: [
            {
              status: {
                name: 'First Status',
              },
            },
            {
              status: {
                name: 'Second Status',
              },
            },
          ],
          time_period: 'last_x_days',
          date_range: {
            start_date: '2018-02-23 00:00:00',
            end_date: '2018-03-23 23:59:59',
          },
          decorators: {
            data_labels: false,
          },
        },
      },
    };

    const expectedState = {
      summaryBar: {
        id: 123,
        graphGroup: 'summary_bar',
        metrics: action.payload.graphData.metrics,
        time_period: 'last_x_days',
        date_range: {
          start_date: '2018-02-23 00:00:00',
          end_date: '2018-03-23 23:59:59',
        },
        decorators: {
          data_labels: false,
        },
      },
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummaryStackBar/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {
      summaryStackBar: {
        id: 123,
        metrics: [],
        date_range: null,
      },
    };

    const action = {
      type: 'formSummaryStackBar/COMPOSE_GRAPH_SUCCESS',
      payload: {
        graphData: {
          graphGroup: 'summary_stack_bar',
          metrics: [
            {
              type: 'medical',
            },
          ],
          time_period: 'last_x_days',
          date_range: {
            start_date: '2018-02-23 00:00:00',
            end_date: '2018-03-23 23:59:59',
          },
          decorators: {
            data_labels: false,
          },
        },
      },
    };

    const expectedState = {
      summaryStackBar: {
        id: 123,
        graphGroup: 'summary_stack_bar',
        metrics: action.payload.graphData.metrics,
        time_period: 'last_x_days',
        date_range: {
          start_date: '2018-02-23 00:00:00',
          end_date: '2018-03-23 23:59:59',
        },
        decorators: {
          data_labels: false,
        },
      },
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummaryDonut/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {
      summaryDonut: {
        id: 123,
        metrics: [{}],
        date_range: null,
      },
    };

    const action = {
      type: 'formSummaryDonut/COMPOSE_GRAPH_SUCCESS',
      payload: {
        graphData: {
          graphGroup: 'summary_donut',
          metrics: [
            {
              type: 'medical',
            },
          ],
          time_period: 'last_x_days',
          date_range: {
            start_date: '2018-02-23 00:00:00',
            end_date: '2018-03-23 23:59:59',
          },
        },
      },
    };

    const expectedState = {
      summaryDonut: {
        id: 123,
        graphGroup: 'summary_donut',
        metrics: action.payload.graphData.metrics,
        time_period: 'last_x_days',
        date_range: {
          start_date: '2018-02-23 00:00:00',
          end_date: '2018-03-23 23:59:59',
        },
      },
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formValueVisualisation/COMPOSE_GRAPH_SUCCESS', () => {
    const initialState = {
      valueVisualisation: {
        id: 123,
        metrics: [{}],
        date_range: null,
      },
    };

    const action = {
      type: 'formValueVisualisation/COMPOSE_GRAPH_SUCCESS',
      payload: {
        graphData: {
          graphGroup: 'value_visualisation',
          id: 123,
          metrics: [
            {
              type: 'medical',
            },
          ],
          time_period: 'last_x_days',
          date_range: {
            start_date: '2018-02-23 00:00:00',
            end_date: '2018-03-23 23:59:59',
          },
        },
      },
    };

    const expectedState = {
      valueVisualisation: {
        id: 123,
        graphGroup: 'value_visualisation',
        metrics: action.payload.graphData.metrics,
        time_period: 'last_x_days',
        date_range: {
          start_date: '2018-02-23 00:00:00',
          end_date: '2018-03-23 23:59:59',
        },
      },
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  describe('when the graph group is longitudinal', () => {
    it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
      const initialState = {
        longitudinal: {
          id: '1',
        },
      };

      const action = {
        type: 'CONFIRM_RENAME_GRAPH',
        payload: {
          graphGroup: 'longitudinal',
          newGraphName: 'new graph name',
        },
      };

      const nextState = GraphData(initialState, action);
      expect(nextState).toStrictEqual({
        longitudinal: {
          id: '1',
          name: 'new graph name',
        },
      });
    });
  });

  describe('when the graph group is summary_bar', () => {
    it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
      const initialState = {
        summaryBar: {
          id: '1',
        },
      };

      const action = {
        type: 'CONFIRM_RENAME_GRAPH',
        payload: {
          graphGroup: 'summary_bar',
          newGraphName: 'new graph name',
        },
      };

      const nextState = GraphData(initialState, action);
      expect(nextState).toStrictEqual({
        summaryBar: {
          id: '1',
          name: 'new graph name',
        },
      });
    });
  });

  describe('when the graph group is summary_donut', () => {
    it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
      const initialState = {
        summaryDonut: {
          id: '1',
        },
      };

      const action = {
        type: 'CONFIRM_RENAME_GRAPH',
        payload: {
          graphGroup: 'summary_donut',
          newGraphName: 'new graph name',
        },
      };

      const nextState = GraphData(initialState, action);
      expect(nextState).toStrictEqual({
        summaryDonut: {
          id: '1',
          name: 'new graph name',
        },
      });
    });
  });

  describe('when the graph group is summary_stack_bar', () => {
    it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
      const initialState = {
        summaryStackBar: {
          id: '1',
        },
      };

      const action = {
        type: 'CONFIRM_RENAME_GRAPH',
        payload: {
          graphGroup: 'summary_stack_bar',
          newGraphName: 'new graph name',
        },
      };

      const nextState = GraphData(initialState, action);
      expect(nextState).toStrictEqual({
        summaryStackBar: {
          id: '1',
          name: 'new graph name',
        },
      });
    });
  });

  describe('when the graph group is summary', () => {
    it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
      const initialState = {
        summary: {
          id: '1',
        },
      };

      const action = {
        type: 'CONFIRM_RENAME_GRAPH',
        payload: {
          graphGroup: 'summary',
          newGraphName: 'new graph name',
        },
      };

      const nextState = GraphData(initialState, action);
      expect(nextState).toStrictEqual({
        summary: {
          id: '1',
          name: 'new graph name',
        },
      });
    });
  });

  describe('when the graph group is value_visualisation', () => {
    it('returns correct state on CONFIRM_RENAME_GRAPH', () => {
      const initialState = {
        valueVisualisation: {
          id: '1',
        },
      };

      const action = {
        type: 'CONFIRM_RENAME_GRAPH',
        payload: {
          graphGroup: 'value_visualisation',
          newGraphName: 'new graph name',
        },
      };

      const nextState = GraphData(initialState, action);
      expect(nextState).toStrictEqual({
        valueVisualisation: {
          id: '1',
          name: 'new graph name',
        },
      });
    });
  });

  it('returns correct state on UPDATE_GRAPH_FORM_TYPE when graphGroup is longitudinal and graphType is combination', () => {
    const initialState = {
      longitudinal: {
        metrics: [{}, {}, {}],
      },
    };

    const action = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphGroup: 'longitudinal',
        graphType: 'combination',
      },
    };

    const expectedState = {
      longitudinal: {
        metrics: [
          {
            metric_style: 'column',
          },
          {
            metric_style: 'line',
          },
          {
            metric_style: 'line',
          },
        ],
      },
    };

    const nextState = GraphData(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });
});

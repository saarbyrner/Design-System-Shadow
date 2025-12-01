import { blankStatus } from '@kitman/common/src/utils/status_utils';
import GraphForm from '../GraphForm';

describe('graphComposer - GraphForm reducer', () => {
  it('returns correct state on UPDATE_GRAPH_FORM_TYPE when the graph group is the same', () => {
    const initialState = {
      graphGroup: 'longitudinal',
      metrics: [{}],
    };

    const action = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphGroup: 'longitudinal',
        graphType: 'column',
      },
    };

    const expectedState = {
      graphGroup: 'longitudinal',
      metrics: [{}],
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on UPDATE_GRAPH_FORM_TYPE when the graph group is different', () => {
    const initialState = {
      graphGroup: 'longitudinal',
      metrics: [{}],
    };

    const action = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphGroup: 'summary_bar',
        graphType: 'column',
      },
    };

    const nextState = GraphForm(initialState, action);

    const expectedState = {
      graphGroup: 'summary_bar',
      metrics: [
        {
          squad_selection: {
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [],
          },
          type: 'metric',
          status: {
            ...blankStatus(),
            status_id: nextState.metrics[0].status.status_id,
          },
          overlays: [],
        },
      ],
    };

    expect(nextState).toStrictEqual(expectedState);
  });

  it("returns correct state on UPDATE_GRAPH_FORM_TYPE when graphType is combination and the graph group didn't change", () => {
    const initialState = {
      graphGroup: 'longitudinal',
      metrics: [{}, {}, {}, { metric_style: 'column' }],
    };

    const action = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphGroup: 'longitudinal',
        graphType: 'combination',
      },
    };

    const expectedState = {
      graphGroup: 'longitudinal',
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
        {
          metric_style: 'column',
        },
      ],
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on ADD_METRIC', () => {
    const initialState = {
      metrics: [
        {
          type: 'metric',
          status: {
            ...blankStatus(),
            last_x_time_period: 'days',
            time_period_length: 21,
          },
          squad_selection: {
            applies_to_squad: false,
            position_groups: [2],
            positions: [20, 3],
            athletes: [1],
            all_squads: true,
            squads: [1, 10],
          },
        },
      ],
      time_period: '',
    };

    const action = {
      type: 'ADD_METRIC',
    };

    const nextState = GraphForm(initialState, action);

    expect(nextState.metrics.length).toBe(2);
    expect(nextState.metrics[0]).toStrictEqual(initialState.metrics[0]);
    expect(nextState.time_period).toBe('');

    const newStatus = nextState.metrics[1].status;
    expect(newStatus.status_id).not.toBe(null);
    expect(newStatus.status_id).not.toBe(undefined);
    expect(newStatus.source).toBe('kitman:tv');
    expect(newStatus.description).toBe(null);
    expect(newStatus.localised_unit).toBe(null);
    expect(newStatus.period_scope).toBe(null);
    expect(newStatus.second_period_length).toBe(null);
    expect(newStatus.operator).toBe(null);
    expect(newStatus.second_period_all_time).toBe(null);
    expect(newStatus.summary).toBe(null);
    expect(newStatus.variable).toBe(null);
    expect(nextState.metrics[1].type).toBe('metric');

    const firstStatus = nextState.metrics[0].status;
    expect(newStatus.last_x_time_period).toBe(firstStatus.last_x_time_period);
    expect(newStatus.time_period_length).toBe(firstStatus.time_period_length);

    const newMetric = nextState.metrics[1];
    expect(newMetric.squad_selection).toStrictEqual({
      applies_to_squad: false,
      position_groups: [2],
      positions: [20, 3],
      athletes: [1],
    });
  });

  describe('when the graph is event type', () => {
    it('returns correct state on ADD_METRIC', () => {
      const firstStatus = {
        ...blankStatus(),
        event_type_time_period: 'training_session',
        games: [],
        training_sessions: ['ts1', 'ts2'],
        drills: [],
        selected_games: [],
        selected_training_sessions: ['ts1'],
        event_breakdown: 'session_summary',
      };
      const initialState = {
        metrics: [
          {
            type: 'metric',
            status: firstStatus,
            squad_selection: {},
          },
        ],
        time_period: '',
      };

      const action = {
        type: 'ADD_METRIC',
      };

      const expectedStatus = {
        ...firstStatus,
        event_type_time_period: 'training_session',
        games: [],
        training_sessions: ['ts1', 'ts2'],
        drills: [],
        selected_games: [],
        selected_training_sessions: ['ts1'],
        event_breakdown: 'session_summary',
      };

      const nextState = GraphForm(initialState, action);

      expect(nextState.metrics.length).toBe(2);
      expect(nextState.metrics[0]).toStrictEqual(initialState.metrics[0]);
      expect(nextState.time_period).toBe('');

      const newStatus = nextState.metrics[1].status;
      expect(newStatus.status_id).not.toBe(null);
      expect(newStatus.status_id).not.toBe(undefined);
      expect(newStatus.source).toBe(expectedStatus.source);
      expect(newStatus.description).toBe(expectedStatus.description);
      expect(newStatus.localised_unit).toBe(expectedStatus.localised_unit);
      expect(newStatus.period_scope).toBe(expectedStatus.period_scope);
      expect(newStatus.second_period_length).toBe(
        expectedStatus.second_period_length
      );
      expect(newStatus.operator).toBe(expectedStatus.operator);
      expect(newStatus.second_period_all_time).toBe(
        expectedStatus.second_period_all_time
      );
      expect(newStatus.summary).toBe(expectedStatus.summary);
      expect(newStatus.variable).toBe(expectedStatus.variable);
      expect(newStatus.event_type_time_period).toBe(
        expectedStatus.event_type_time_period
      );
      expect(newStatus.games).toStrictEqual(expectedStatus.games);
      expect(newStatus.training_sessions).toStrictEqual(
        expectedStatus.training_sessions
      );
      expect(newStatus.drills).toStrictEqual(expectedStatus.drills);
      expect(newStatus.selected_games).toStrictEqual(
        expectedStatus.selected_games
      );
      expect(newStatus.selected_training_sessions).toStrictEqual(
        expectedStatus.selected_training_sessions
      );
      expect(newStatus.event_breakdown).toBe(expectedStatus.event_breakdown);
      expect(nextState.metrics[1].type).toBe('metric');
    });

    it('returns correct state on ADD_METRIC with metric type', () => {
      const firstStatus = {
        ...blankStatus(),
      };
      const initialState = {
        metrics: [
          {
            type: 'metric',
            status: firstStatus,
            squad_selection: {},
          },
        ],
        time_period: '',
      };

      const action = {
        type: 'ADD_METRIC',
      };

      const expectedStatus = {
        ...firstStatus,
        last_x_time_period: 'days',
        time_period_length: null,
      };

      const nextState = GraphForm(initialState, action);

      expect(nextState.metrics.length).toBe(2);
      expect(nextState.metrics[0]).toStrictEqual(initialState.metrics[0]);

      const newStatus = nextState.metrics[1].status;
      expect(newStatus.last_x_time_period).toBe(
        expectedStatus.last_x_time_period
      );
      expect(newStatus.time_period_length).toBe(
        expectedStatus.time_period_length
      );
    });

    it('returns correct state on ADD_METRIC when the first metric is medical', () => {
      const initialState = {
        metrics: [
          {
            type: 'medical',
            last_x_time_period: 'weeks',
            time_period_length: '20',
            squad_selection: {
              applies_to_squad: false,
              position_groups: [2],
              positions: [20, 3],
              athletes: [1],
              all_squads: true,
              squads: [1, 10],
            },
          },
        ],
        time_period: 'last_x_days',
      };

      const action = {
        type: 'ADD_METRIC',
      };

      const nextState = GraphForm(initialState, action);

      expect(nextState.metrics.length).toBe(2);
      expect(nextState.metrics[0]).toStrictEqual(initialState.metrics[0]);

      const newStatus = nextState.metrics[1].status;
      expect(newStatus.last_x_time_period).toBe('weeks');
      expect(newStatus.time_period_length).toBe('20');
      expect(newStatus.event_type_time_period).toBe('last_x_days');

      const newMetric = nextState.metrics[1];
      expect(newMetric.squad_selection).toStrictEqual({
        applies_to_squad: false,
        position_groups: [2],
        positions: [20, 3],
        athletes: [1],
      });
    });
  });

  it('returns correct state on DELETE_METRIC', () => {
    const initialState = {
      metrics: [
        {
          type: 'metric',
        },
        {
          type: 'medical',
        },
      ],
    };

    const action = {
      type: 'DELETE_METRIC',
      payload: {
        index: 0,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [initialState.metrics[1]],
    });
  });

  it('returns correct state on UPDATE_DATA_TYPE with metric datatype', () => {
    const initialState = {
      metrics: [
        {
          type: 'medical',
          linked_dashboard_id: '3',
          metric_style: 'line',
        },
        {
          type: 'medical',
          metric_style: 'line',
        },
      ],
      time_period: 'today',
      date_range: null,
      graphGroup: 'longitudinal',
    };

    const action = {
      type: 'UPDATE_DATA_TYPE',
      payload: {
        metricIndex: 0,
        dataType: 'metric',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: {
            ...blankStatus(),
            status_id: nextState.metrics[0].status.status_id,
            event_type_time_period: 'today',
            time_period_length: null,
            last_x_time_period: 'days',
            time_period_length_offset: null,
            last_x_time_period_offset: 'days',
          },
          squad_selection: {
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [],
          },
          linked_dashboard_id: '3',
          metric_style: 'line',
          overlays: [],
        },
        initialState.metrics[1],
      ],
      time_period: 'today',
      date_range: initialState.date_range,
      graphGroup: 'longitudinal',
    });
  });

  it('returns correct state on UPDATE_DATA_TYPE with medical datatype when graphGroup is value_visualisation', () => {
    const initialState = {
      metrics: [
        {
          type: 'metric',
          linked_dashboard_id: '3',
        },
      ],
      graphGroup: 'value_visualisation',
    };

    const action = {
      type: 'UPDATE_DATA_TYPE',
      payload: {
        dataType: 'medical',
        metricIndex: 0,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'medical',
          calculation: 'count',
          linked_dashboard_id: '3',
          squad_selection: {
            all_squads: false,
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [],
            squads: [],
          },
          last_x_time_period: 'days',
          time_period_length: null,
          last_x_time_period_offset: 'days',
          time_period_length_offset: null,
        },
      ],
      graphGroup: 'value_visualisation',
    });
  });

  it('returns correct state on UPDATE_DATA_TYPE with medical datatype', () => {
    const firstStatus = blankStatus();
    const secondStatus = blankStatus();
    const initialState = {
      metrics: [
        {
          type: 'metric',
          status: {
            ...firstStatus,
            last_x_time_period: 'days',
            time_period_length: 2,
          },
          metric_style: 'line',
        },
        {
          status: secondStatus,
          linked_dashboard_id: '3',
        },
      ],
      time_period: '',
      date_range: null,
      graphGroup: 'longitudinal',
    };

    const action = {
      type: 'UPDATE_DATA_TYPE',
      payload: {
        metricIndex: 1,
        dataType: 'medical',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        initialState.metrics[0],
        {
          type: 'medical',
          last_x_time_period: 'days',
          time_period_length: 2,
          last_x_time_period_offset: 'days',
          time_period_length_offset: null,
          squad_selection: {
            applies_to_squad: false,
            athletes: [],
            position_groups: [],
            positions: [],
            all_squads: false,
            squads: [],
          },
          linked_dashboard_id: '3',
          metric_style: null,
        },
      ],
      time_period: '',
      date_range: initialState.date_range,
      graphGroup: 'longitudinal',
    });
  });

  it('returns correct state on UPDATE_SQUAD_SELECTION', () => {
    const initialState = {
      metrics: [
        {
          squad_selection: {
            positions: ['53'],
            position_groups: ['162'],
            applies_to_squad: true,
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_SQUAD_SELECTION',
      payload: {
        squadSelection: {
          positions: ['53'],
          position_groups: ['12'],
          athletes: ['2938'],
          applies_to_squad: false,
        },
        index: 0,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          squad_selection: action.payload.squadSelection,
        },
      ],
    });
  });

  it('returns correct state on UPDATE_STATUS', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
    };
    const seconMetric = {
      type: 'metric',
      status: blankStatus(),
    };
    const updatedStatus = {
      ...seconMetric.status,
      description: 'updated description',
    };

    const initialState = {
      metrics: [firstMetric, seconMetric],
      time_period: '',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_STATUS',
      payload: {
        index: 1,
        status: updatedStatus,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        initialState.metrics[0],
        {
          ...initialState.metrics[1],
          status: updatedStatus,
        },
      ],
      time_period: '',
      date_range: initialState.date_range,
    });
  });

  describe('UPDATE_TIME_PERIOD reducer', () => {
    it('returns correct state on UPDATE_TIME_PERIOD', () => {
      const firstMetric = {
        type: 'metric',
        status: blankStatus(),
      };
      const timePeriod = 'time_period';

      const initialState = {
        metrics: [firstMetric],
        time_period: '',
        date_range: null,
      };

      const action = {
        type: 'UPDATE_TIME_PERIOD',
        payload: {
          timePeriod,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [
          {
            ...firstMetric,
            status: {
              ...firstMetric.status,
              time_period_length: null,
              time_period_length_offset: null,
              event_type_time_period: 'time_period',
            },
          },
        ],
        time_period: timePeriod,
        date_range: {},
      });
    });

    it('keeps the date range if the new time period is still last_x_days', () => {
      const firstMetric = {
        type: 'metric',
        status: blankStatus(),
      };
      const timePeriod = 'last_x_days';

      const initialState = {
        metrics: [firstMetric],
        time_period: 'time_period',
        date_range: {
          end_date: '2018-01-09 00:00:00',
          start_date: '2018-01-31 23:59:59',
        },
      };

      const action = {
        type: 'UPDATE_TIME_PERIOD',
        payload: {
          timePeriod,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [
          {
            ...firstMetric,
            status: {
              ...firstMetric.status,
              time_period_length: null,
              time_period_length_offset: null,
              event_type_time_period: 'last_x_days',
            },
          },
        ],
        time_period: timePeriod,
        date_range: initialState.date_range,
      });
    });

    it('keeps the date range if the new time period is still custom_date_range', () => {
      const firstMetric = {
        type: 'metric',
        status: blankStatus(),
      };
      const timePeriod = 'custom_date_range';

      const initialState = {
        metrics: [firstMetric],
        time_period: 'time_period',
        date_range: {
          end_date: '2018-01-09 00:00:00',
          start_date: '2018-01-31 23:59:59',
        },
      };

      const action = {
        type: 'UPDATE_TIME_PERIOD',
        payload: {
          timePeriod,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [
          {
            ...firstMetric,
            status: {
              ...firstMetric.status,
              time_period_length: null,
              time_period_length_offset: null,
              event_type_time_period: 'custom_date_range',
            },
          },
        ],
        time_period: timePeriod,
        date_range: initialState.date_range,
      });
    });

    it('clears the date range if the new time period is not custom_date_range', () => {
      const firstMetric = {
        type: 'metric',
        status: blankStatus(),
      };
      const timePeriod = 'time_period';

      const initialState = {
        metrics: [firstMetric],
        time_period: 'last_x_days',
        date_range: {
          end_date: '2018-01-09 00:00:00',
          start_date: '2018-01-31 23:59:59',
        },
      };

      const action = {
        type: 'UPDATE_TIME_PERIOD',
        payload: {
          timePeriod,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [
          {
            ...firstMetric,
            status: {
              ...firstMetric.status,
              time_period_length: null,
              time_period_length_offset: null,
              event_type_time_period: 'time_period',
            },
          },
        ],
        time_period: timePeriod,
        date_range: {},
      });
    });
  });

  it('returns correct state on UPDATE_TIME_PERIOD_LENGTH with medical type', () => {
    const firstMetric = {
      type: 'medical',
    };

    const newMetric = {
      ...firstMetric,
      time_period_length: 4,
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_TIME_PERIOD_LENGTH with metric type', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
    };

    const newMetric = {
      ...firstMetric,
      status: {
        ...firstMetric.status,
        time_period_length: 4,
      },
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_LAST_X_TIME_PERIOD with medical type', () => {
    const firstMetric = {
      type: 'medical',
    };

    const newMetric = {
      ...firstMetric,
      last_x_time_period: 'weeks',
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_LAST_X_TIME_PERIOD',
      payload: {
        lastXTimePeriod: 'weeks',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_LAST_X_TIME_PERIOD with metric type', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
    };

    const newMetric = {
      ...firstMetric,
      status: {
        ...firstMetric.status,
        last_x_time_period: 'weeks',
      },
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_LAST_X_TIME_PERIOD',
      payload: {
        lastXTimePeriod: 'weeks',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_TIME_PERIOD_LENGTH_OFFSET with medical type', () => {
    const firstMetric = {
      type: 'medical',
    };

    const newMetric = {
      ...firstMetric,
      time_period_length_offset: 4,
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 4,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_TIME_PERIOD_LENGTH_OFFSET with metric type', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
    };

    const newMetric = {
      ...firstMetric,
      status: {
        ...firstMetric.status,
        time_period_length_offset: 4,
      },
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 4,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_LAST_X_TIME_PERIOD_OFFSET with medical type', () => {
    const firstMetric = {
      type: 'medical',
    };

    const newMetric = {
      ...firstMetric,
      last_x_time_period_offset: 'weeks',
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_LAST_X_TIME_PERIOD_OFFSET',
      payload: {
        lastXTimePeriodOffset: 'weeks',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_LAST_X_TIME_PERIOD_OFFSET with metric type', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
    };

    const newMetric = {
      ...firstMetric,
      status: {
        ...firstMetric.status,
        last_x_time_period_offset: 'weeks',
      },
    };

    const initialState = {
      metrics: [firstMetric],
      time_period: 'last_x_days',
      date_range: null,
    };

    const action = {
      type: 'UPDATE_LAST_X_TIME_PERIOD_OFFSET',
      payload: {
        lastXTimePeriodOffset: 'weeks',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      time_period: initialState.time_period,
      date_range: null,
    });
  });

  it('returns correct state on UPDATE_DATE_RANGE', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
    };

    const newMetric = {
      ...firstMetric,
      status: {
        ...firstMetric.status,
        selected_games: [],
        selected_training_sessions: [],
      },
    };

    const initialState = {
      metrics: [firstMetric],
      date_range: {},
      time_period: 'game',
    };

    const action = {
      type: 'UPDATE_DATE_RANGE',
      payload: {
        dateRange: {
          start_date: '2018-01-09 00:00:00',
          end_date: '2018-01-31 23:59:59',
        },
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [newMetric],
      date_range: {
        start_date: action.payload.dateRange.start_date,
        end_date: action.payload.dateRange.end_date,
      },
      time_period: 'game',
    });
  });

  it('returns correct state on UPDATE_SELECTED_GAMES', () => {
    const status = {
      ...blankStatus(),
      event_type_time_period: 'game',
      games: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
      ],
    };

    const status2 = {
      ...blankStatus(),
      event_type_time_period: 'game',
      games: [],
    };

    const expectedStatus = {
      ...status,

      selected_games: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
      ],
      event_breakdown: 'SUMMARY',
    };

    const expectedStatus2 = {
      ...status2,
      selected_games: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
      ],
    };

    const initialState = {
      metrics: [
        {
          status,
        },
        {
          status: status2,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_SELECTED_GAMES',
      payload: {
        metricIndex: 0,
        gameIds: [1234],
        selectionType: 'SINGLE_SELECT',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          status: expectedStatus,
        },
        {
          status: expectedStatus2,
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_SELECTED_GAMES when more than one games are selected', () => {
    const status = {
      ...blankStatus(),
      event_type_time_period: 'game',
      games: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
        {
          date: '2019-04-24T23:00:00Z',
          id: 5678,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
      ],
    };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_SELECTED_GAMES',
      payload: {
        metricIndex: 0,
        gameIds: [1234, 5678],
        selectionType: 'MULTI_SELECT',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: {
            ...status,
            selected_games: status.games,
            event_breakdown: 'SUMMARY',
          },
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_SELECTED_TRAINING_SESSIONS', () => {
    const status = {
      ...blankStatus(),
      event_type_time_period: 'training_session',
      training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
      ],
    };

    const status2 = {
      ...blankStatus(),
      event_type_time_period: 'game',
      training_sessions: [],
    };

    const expectedStatus = {
      ...status,
      selected_training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
      ],
      event_breakdown: 'SUMMARY',
    };

    const expectedStatus2 = {
      ...status2,
      selected_training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
      ],
    };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
        {
          type: 'metric',
          status: status2,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_SELECTED_TRAINING_SESSIONS',
      payload: {
        metricIndex: 0,
        trainingSessionIds: ['1234'],
        selectionType: 'SINGLE_SELECT',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: expectedStatus,
        },
        {
          type: 'metric',
          status: expectedStatus2,
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_SELECTED_TRAINING_SESSIONS when more than one training sessions are selected', () => {
    const status = {
      ...blankStatus(),
      event_type_time_period: 'training_session',
      training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 5678,
          session_type_name: 'Training',
        },
      ],
    };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_SELECTED_TRAINING_SESSIONS',
      payload: {
        metricIndex: 0,
        trainingSessionIds: [1234, 5678],
        selectionType: 'MULTI_SELECT',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: {
            ...status,
            selected_training_sessions: status.training_sessions,
            event_breakdown: 'SUMMARY',
          },
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_EVENT_BREAKDOWN', () => {
    const status = {
      ...blankStatus(),
      event_type_time_period: 'training_session',
      training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          session_type_name: 'Training',
        },
      ],
      selected_training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          session_type_name: 'Training',
        },
      ],
    };
    const expectedStatus = { ...status, event_breakdown: 'SUMMARY' };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
        {
          type: 'metric',
          status,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_EVENT_BREAKDOWN',
      payload: {
        metricIndex: 0,
        breakdownTypeId: 'SUMMARY',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: expectedStatus,
        },
        {
          type: 'metric',
          status: expectedStatus,
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_TRAINING_SESSION_OPTIONS', () => {
    const status = {
      ...blankStatus(),
      event_type_time_period: 'training_session',
    };
    const expectedStatus = {
      ...status,
      training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          duration: 100,
          id: 1234,
          session_type_name: 'Training',
        },
      ],
    };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_TRAINING_SESSION_OPTIONS',
      payload: {
        metricIndex: 0,
        trainingSessions: [
          {
            date: '2019-04-24T23:00:00Z',
            duration: 100,
            id: 1234,
            session_type_name: 'Training',
          },
        ],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: expectedStatus,
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_GAMES_OPTIONS', () => {
    const status = { ...blankStatus(), event_type_time_period: 'game' };
    const expectedStatus = {
      ...status,
      games: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
      ],
    };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_GAMES_OPTIONS',
      payload: {
        metricIndex: 0,
        games: [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            opponent_score: '12',
            opponent_team_name: 'Opponent Team',
            score: '13',
            team_name: 'Kitman',
            venue_type_name: 'Home',
          },
        ],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: expectedStatus,
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_DRILLS_OPTIONS', () => {
    const status = {
      ...blankStatus(),
      training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          session_type_name: 'Training',
        },
      ],
      selected_training_sessions: [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          session_type_name: 'Training',
        },
      ],
    };
    const expectedStatus = {
      ...status,
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
    };

    const initialState = {
      metrics: [
        {
          type: 'metric',
          status,
        },
      ],
      date_range: {
        start_date: '2018-01-09 00:00:00',
        end_date: '2018-01-31 23:59:59',
      },
    };

    const action = {
      type: 'UPDATE_DRILLS_OPTIONS',
      payload: {
        metricIndex: 0,
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
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'metric',
          status: expectedStatus,
        },
      ],
      date_range: initialState.date_range,
    });
  });

  it('returns correct state on UPDATE_EVENT_TYPE_TIME_PERIOD', () => {
    const status = blankStatus();
    const initialState = {
      graphGroup: 'longitudinal',
      metrics: [
        {
          type: 'metric',
          status,
          overlays: [{ id: 1 }, { id: 2 }],
        },
        {
          type: 'metric',
          status,
          overlays: [{ id: 3 }],
        },
      ],
      date_range: {
        start_date: '2018-02-08 00:00:00',
        end_date: '2018-03-22 23:59:59',
      },
    };

    const expectedStatus = {
      ...status,
      event_type_time_period: 'game',
      games: [],
      training_sessions: [],
      drills: [],
      selected_games: [],
      event_breakdown: null,
      selected_training_sessions: [],
      time_period_length: null,
      time_period_length_offset: null,
    };

    const expectedState = {
      graphGroup: 'longitudinal',
      metrics: [
        {
          type: 'metric',
          status: expectedStatus,
          overlays: [],
        },
        {
          type: 'metric',
          status: expectedStatus,
          overlays: [],
        },
      ],
      date_range: {},
      time_period: 'game',
    };

    const action = {
      type: 'UPDATE_EVENT_TYPE_TIME_PERIOD',
      payload: {
        metricIndex: 0,
        dateRange: {},
        itemKey: 'game',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  describe('UPDATE_CATEGORY reducer', () => {
    it('returns correct state on UPDATE_CATEGORY', () => {
      const firstMetric = {
        type: 'medical',
        category: 'all_injuries',
        main_category: 'injury',
      };

      const initialState = {
        metrics: [firstMetric],
      };

      const action = {
        type: 'UPDATE_CATEGORY',
        payload: {
          metricIndex: 0,
          mainCategory: 'illness',
          category: 'session_type',
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [
          {
            type: 'medical',
            category: 'session_type',
            main_category: 'illness',
          },
        ],
      });
    });

    it('wipes the session type filter when the new main category is illness', () => {
      const firstMetric = {
        type: 'medical',
        category: 'all_injuries',
        main_category: 'injury',
        filters: {
          session_type: ['1', '3'],
        },
      };

      const initialState = {
        metrics: [firstMetric],
      };

      const action = {
        type: 'UPDATE_CATEGORY',
        payload: {
          metricIndex: 0,
          mainCategory: 'illness',
          category: 'session_type',
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [
          {
            type: 'medical',
            category: 'session_type',
            main_category: 'illness',
            filters: {
              session_type: [],
            },
          },
        ],
      });
    });
  });

  it('returns correct state on UPDATE_CATEGORY_DIVISION', () => {
    const metrics = [
      {
        type: 'medical',
        category_division: 'pathology',
      },
    ];

    const initialState = {
      metrics,
    };

    const action = {
      type: 'UPDATE_CATEGORY_DIVISION',
      payload: {
        metricIndex: 0,
        categoryDivision: 'body_area',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          type: 'medical',
          category_division: 'body_area',
        },
      ],
    });
  });

  it('returns correct state on ADD_FILTER when metric is medical', () => {
    const initialState = {
      metrics: [{ type: 'medical' }],
    };

    const action = {
      type: 'ADD_FILTER',
      payload: {
        metricIndex: 0,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            time_loss: [],
            session_type: [],
            competitions: [],
          },
          type: 'medical',
        },
      ],
    });
  });

  it('returns correct state on ADD_FILTER when metric is metric', () => {
    const initialState = {
      metrics: [{ type: 'metric' }],
    };

    const action = {
      type: 'ADD_FILTER',
      payload: {
        metricIndex: 0,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            event_types: [],
            training_session_types: [],
          },
          type: 'metric',
        },
      ],
    });
  });

  it('returns correct state on UPDATE_CATEGORY_SELECTION', () => {
    const metrics = [
      {
        type: 'medical',
        category: 'all_injuries',
        main_category: 'injury',
        category_selection: null,
      },
    ];
    const initialState = {
      metrics,
    };

    const action = {
      type: 'UPDATE_CATEGORY_SELECTION',
      payload: {
        metricIndex: 0,
        categorySelection: 'ankle_fracture',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          ...metrics[0],
          category_selection: 'ankle_fracture',
        },
      ],
    });
  });

  it('returns correct state on REMOVE_FILTER', () => {
    const initialState = {
      metrics: [
        {
          filters: {
            time_loss: ['time_loss'],
          },
        },
      ],
    };

    const action = {
      type: 'REMOVE_FILTER',
      payload: {
        metricIndex: 0,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [{}],
    });
  });

  it('returns correct state on UPDATE_TIME_LOSS_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          filters: {
            time_loss: [],
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_TIME_LOSS_FILTERS',
      payload: {
        metricIndex: 0,
        timeLossFilters: ['time_loss'],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            time_loss: ['time_loss'],
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_SESSION_TYPE_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          filters: {
            time_loss: [],
            session_type: [],
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_SESSION_TYPE_FILTERS',
      payload: {
        metricIndex: 0,
        sessionTypeFilters: ['game'],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            time_loss: [],
            session_type: ['game'],
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_EVENT_TYPE_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          filters: {
            event_types: [],
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_EVENT_TYPE_FILTERS',
      payload: {
        metricIndex: 0,
        eventTypeFilters: ['game'],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            event_types: ['game'],
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_TRAINING_SESSION_TYPE_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          filters: {
            training_session_types: [],
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_TRAINING_SESSION_TYPE_FILTERS',
      payload: {
        metricIndex: 0,
        trainingSessionTypeFilters: [1234],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            training_session_types: [1234],
          },
        },
      ],
    });
  });

  it('returns correct state on UPDATE_COMPETITION_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          filters: {
            time_loss: [],
            session_type: [],
            competitions: [],
          },
        },
      ],
    };

    const action = {
      type: 'UPDATE_COMPETITION_FILTERS',
      payload: {
        metricIndex: 0,
        competitionFilters: ['1'],
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          filters: {
            time_loss: [],
            session_type: [],
            competitions: ['1'],
          },
        },
      ],
    });
  });

  it('returns correct state on ADD_OVERLAY', () => {
    const initialState = {
      metrics: [
        {
          type: 'metric',
          overlays: [],
        },
        {
          type: 'metric',
          overlays: [],
        },
      ],
    };

    const action = {
      type: 'ADD_OVERLAY',
      payload: {
        metricIndex: 1,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        initialState.metrics[0],
        {
          type: 'metric',
          overlays: [{}],
        },
      ],
    });
  });

  it('returns correct state on DELETE_OVERLAY', () => {
    const initialState = {
      metrics: [
        {
          type: 'metric',
          overlays: [],
        },
        {
          type: 'metric',
          overlays: [{ id: 1 }, { id: 2 }],
        },
      ],
    };

    const action = {
      type: 'DELETE_OVERLAY',
      payload: {
        metricIndex: 1,
        overlayIndex: 1,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        initialState.metrics[0],
        {
          type: 'metric',
          overlays: [{ id: 1 }],
        },
      ],
    });
  });

  it('returns correct state on UPDATE_OVERLAY_SUMMARY', () => {
    const firstMetric = {
      overlays: [],
    };

    const secondMetric = {
      overlays: [{ summary: 'min' }, { summary: 'count' }],
    };

    const expectedSecondMetric = {
      overlays: [{ summary: 'max' }, { summary: 'count' }],
    };

    const initialState = {
      metrics: [firstMetric, secondMetric],
    };

    const action = {
      type: 'UPDATE_OVERLAY_SUMMARY',
      payload: {
        metricIndex: 1,
        overlayIndex: 0,
        summary: 'max',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [firstMetric, expectedSecondMetric],
    });
  });

  it('returns correct state on UPDATE_OVERLAY_DATE_RANGE', () => {
    const firstMetric = {
      type: 'metric',
      overlays: [],
    };

    const initialFirstOverlayDateRange = {};
    const newFirstOverlayDateRange = {
      start_date: '2018-02-01T00:00:00+01:00',
      end_date: '2018-04-05T00:00:00+01:00',
    };
    const secondOverlayDateRange = {
      start_date: '2018-10-01T00:00:00+01:00',
      end_date: '2018-10-20T00:00:00+01:00',
    };

    const secondMetric = {
      type: 'metric',
      overlays: [
        { dateRange: initialFirstOverlayDateRange },
        { dateRange: secondOverlayDateRange },
      ],
    };

    const expectedSecondMetric = {
      type: 'metric',
      overlays: [
        {
          dateRange: {
            start_date: newFirstOverlayDateRange.start_date,
            end_date: newFirstOverlayDateRange.end_date,
          },
        },
        {
          dateRange: {
            start_date: secondOverlayDateRange.start_date,
            end_date: secondOverlayDateRange.end_date,
          },
        },
      ],
    };

    const initialState = {
      metrics: [firstMetric, secondMetric],
    };

    const action = {
      type: 'UPDATE_OVERLAY_DATE_RANGE',
      payload: {
        metricIndex: 1,
        overlayIndex: 0,
        dateRange: newFirstOverlayDateRange,
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [firstMetric, expectedSecondMetric],
    });
  });

  it('returns correct state on UPDATE_OVERLAY_POPULATION', () => {
    const firstMetric = {
      type: 'metric',
      overlays: [],
    };

    const secondMetric = {
      type: 'metric',
      overlays: [{ population: 'position_68' }, { population: 'position_10' }],
    };

    const expectedSecondMetric = {
      type: 'metric',
      overlays: [{ population: 'position_20' }, { population: 'position_10' }],
    };

    const initialState = {
      metrics: [firstMetric, secondMetric],
    };

    const action = {
      type: 'UPDATE_OVERLAY_POPULATION',
      payload: {
        metricIndex: 1,
        overlayIndex: 0,
        population: 'position_20',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [firstMetric, expectedSecondMetric],
    });
  });

  describe('UPDATE_OVERLAY_TIME_PERIOD reducer', () => {
    it('returns correct state on UPDATE_OVERLAY_TIME_PERIOD', () => {
      const firstMetric = {
        type: 'metric',
        overlays: [],
      };

      const secondMetric = {
        type: 'metric',
        overlays: [
          { timePeriod: 'tomorrow', dateRange: {} },
          { timePeriod: 'yesterday', dateRange: {} },
        ],
      };

      const expectedSecondMetric = {
        type: 'metric',
        overlays: [
          { timePeriod: 'today', dateRange: {} },
          { timePeriod: 'yesterday', dateRange: {} },
        ],
      };

      const initialState = {
        metrics: [firstMetric, secondMetric],
      };

      const action = {
        type: 'UPDATE_OVERLAY_TIME_PERIOD',
        payload: {
          metricIndex: 1,
          overlayIndex: 0,
          timePeriod: 'today',
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [firstMetric, expectedSecondMetric],
      });
    });

    it('keeps the date range if the new time period is still last_x_days', () => {
      const firstMetric = {
        type: 'metric',
        overlays: [
          {
            timePeriod: 'last_x_days',
            dateRange: {
              end_date: '2018-01-09 00:00:00',
              start_date: '2018-01-31 23:59:59',
            },
          },
        ],
      };

      const expectedFirstMetric = {
        type: 'metric',
        overlays: firstMetric.overlays,
      };

      const initialState = {
        metrics: [firstMetric],
      };

      const action = {
        type: 'UPDATE_OVERLAY_TIME_PERIOD',
        payload: {
          timePeriod: 'last_x_days',
          metricIndex: 0,
          overlayIndex: 0,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [expectedFirstMetric],
      });
    });

    it('keeps the date range if the new time period is still custom_date_range', () => {
      const firstMetric = {
        type: 'metric',
        overlays: [
          {
            timePeriod: 'custom_date_range',
            dateRange: {
              end_date: '2018-01-09 00:00:00',
              start_date: '2018-01-31 23:59:59',
            },
          },
        ],
      };

      const expectedFirstMetric = {
        type: 'metric',
        overlays: firstMetric.overlays,
      };

      const initialState = {
        metrics: [firstMetric],
      };

      const action = {
        type: 'UPDATE_OVERLAY_TIME_PERIOD',
        payload: {
          timePeriod: 'custom_date_range',
          metricIndex: 0,
          overlayIndex: 0,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [expectedFirstMetric],
      });
    });

    it('clears the date range if the new time period is not custom_date_range', () => {
      const firstMetric = {
        type: 'metric',
        overlays: [
          {
            timePeriod: 'last_x_days',
            dateRange: {
              end_date: '2018-01-09 00:00:00',
              start_date: '2018-01-31 23:59:59',
            },
          },
        ],
      };

      const expectedFirstMetric = {
        type: 'metric',
        overlays: [
          {
            timePeriod: 'yesterday',
            dateRange: {},
          },
        ],
      };

      const initialState = {
        metrics: [firstMetric],
      };

      const action = {
        type: 'UPDATE_OVERLAY_TIME_PERIOD',
        payload: {
          timePeriod: 'yesterday',
          metricIndex: 0,
          overlayIndex: 0,
        },
      };

      const nextState = GraphForm(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [expectedFirstMetric],
      });
    });
  });

  it('returns correct state on UPDATE_METRIC_STYLE', () => {
    const initialState = {
      metrics: [{}, {}],
    };

    const action = {
      type: 'UPDATE_METRIC_STYLE',
      payload: {
        metricIndex: 1,
        metricStyle: 'line',
      },
    };

    const expectedState = {
      metrics: [
        {},
        {
          metric_style: 'line',
        },
      ],
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on UPDATE_MEASUREMENT_TYPE', () => {
    const metrics = [
      {
        type: 'medical',
        category: 'all_injuries',
        main_category: 'injury',
        measurement_type: 'raw',
      },
    ];

    const initialState = {
      metrics,
    };

    const action = {
      type: 'UPDATE_MEASUREMENT_TYPE',
      payload: {
        metricIndex: 0,
        measurementType: 'percentage',
      },
    };

    const nextState = GraphForm(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      metrics: [
        {
          ...metrics[0],
          measurement_type: 'percentage',
        },
      ],
    });
  });
});

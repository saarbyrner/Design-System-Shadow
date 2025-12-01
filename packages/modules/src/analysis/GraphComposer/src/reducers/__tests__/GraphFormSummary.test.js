import GraphFormSummary from '../GraphFormSummary';

describe('graphComposer - GraphFormSummary reducer', () => {
  it('returns correct state on formSummary/ADD_POPULATION', () => {
    const firstPopulation = {
      athletes: null,
      calculation: null,
      timePeriod: 'game',
      dateRange: {
        end_date: '2018-01-09 00:00:00',
        start_date: '2018-01-31 23:59:59',
      },
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
      training_sessions: [],
      drills: [],
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
      selected_training_sessions: [],
      event_breakdown: 'SUMMARY',
    };
    const initialState = {
      metrics: [],
      population: [firstPopulation],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/ADD_POPULATION',
    };

    const expectedPopulation = { ...firstPopulation };

    const nextState = GraphFormSummary(initialState, action);

    expect(nextState.population.length).toBe(2);
    expect(nextState.population[0]).toStrictEqual(initialState.population[0]);

    const newPopulation = nextState.population[1];
    expect(newPopulation.event_type_time_period).toBe(
      expectedPopulation.event_type_time_period
    );
    expect(newPopulation.games).toStrictEqual(expectedPopulation.games);
    expect(newPopulation.training_sessions).toStrictEqual(
      expectedPopulation.training_sessions
    );
    expect(newPopulation.drills).toStrictEqual(expectedPopulation.drills);
    expect(newPopulation.selected_games).toStrictEqual(
      expectedPopulation.selected_games
    );
    expect(newPopulation.selected_training_sessions).toStrictEqual(
      expectedPopulation.selected_training_sessions
    );
    expect(newPopulation.event_breakdown).toBe(
      expectedPopulation.event_breakdown
    );
  });

  describe('formSummary/DELETE_POPULATION', () => {
    it('returns correct state on formSummary/DELETE_POPULATION', () => {
      const initialState = {
        metrics: [],
        population: ['population 1', 'population 2'],
        comparisonGroupIndex: 0,
      };

      const action = {
        type: 'formSummary/DELETE_POPULATION',
        payload: {
          index: 0,
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: ['population 2'],
        comparisonGroupIndex: 0,
      });
    });

    it('sets the first population as comparison group if the comparison group is deleted', () => {
      const initialState = {
        metrics: [],
        population: ['population 1', 'population 2', 'population 3'],
        comparisonGroupIndex: 1,
      };

      const action = {
        type: 'formSummary/DELETE_POPULATION',
        payload: {
          index: 1,
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: ['population 1', 'population 3'],
        comparisonGroupIndex: 0,
      });
    });

    it('updates the comparison group index when the user deletes a population before the comparison group in the list', () => {
      const initialState = {
        metrics: [],
        population: ['population 1', 'population 2', 'population 3'],
        comparisonGroupIndex: 2,
      };

      const action = {
        type: 'formSummary/DELETE_POPULATION',
        payload: {
          index: 1,
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: ['population 1', 'population 3'],
        comparisonGroupIndex: 1,
      });
    });
  });

  it('returns correct state on formSummary/ADD_METRICS', () => {
    const initialState = {
      metrics: [
        {
          source_key: 'metric1',
        },
      ],
      population: [],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/ADD_METRICS',
      payload: {
        addedMetrics: ['metric2'],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/REMOVE_METRICS', () => {
    const initialState = {
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/REMOVE_METRICS',
      payload: {
        removedMetrics: ['metric2'],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          source_key: 'metric1',
        },
      ],
      population: [],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/ADD_FILTER', () => {
    const initialState = {
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    };

    const action = {
      type: 'formSummary/ADD_FILTER',
      payload: {
        populationIndex: 0,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
          filters: {
            event_types: [],
            training_session_types: [],
          },
        },
        {
          id: 2,
        },
      ],
    });
  });

  it('returns correct state on formSummary/REMOVE_FILTER', () => {
    const initialState = {
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
          filters: {
            event_types: [],
          },
        },
        {
          id: 2,
        },
      ],
    };

    const action = {
      type: 'formSummary/REMOVE_FILTER',
      payload: {
        populationIndex: 0,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    });
  });

  it('returns correct state on formSummary/UPDATE_EVENT_TYPE_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
          filters: {
            event_types: [],
          },
        },
        {
          id: 2,
        },
      ],
    };

    const action = {
      type: 'formSummary/UPDATE_EVENT_TYPE_FILTERS',
      payload: {
        populationIndex: 0,
        eventTypeFilters: ['game'],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
          filters: {
            event_types: ['game'],
          },
        },
        {
          id: 2,
        },
      ],
    });
  });

  it('returns correct state on formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS', () => {
    const initialState = {
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
          filters: {
            training_session_types: [],
          },
        },
        {
          id: 2,
        },
      ],
    };

    const action = {
      type: 'formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS',
      payload: {
        populationIndex: 0,
        trainingSessionTypeFilters: [1234],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [
        {
          source_key: 'metric1',
        },
        {
          source_key: 'metric2',
        },
      ],
      population: [
        {
          id: 1,
          filters: {
            training_session_types: [1234],
          },
        },
        {
          id: 2,
        },
      ],
    });
  });

  it('returns correct state on formSummary/UPDATE_ATHLETES', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: 'athlete2',
          calculation: null,
          timePeriod: null,
          dateRange: {},
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_ATHLETES',
      payload: {
        populationIndex: 1,
        athletesId: 'athlete1',
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: 'athlete1',
          calculation: null,
          timePeriod: null,
          dateRange: {},
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/UPDATE_CALCULATION', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: 'sum',
          timePeriod: null,
          dateRange: {},
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_CALCULATION',
      payload: {
        populationIndex: 1,
        calculationId: 'average',
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: 'average',
          timePeriod: null,
          dateRange: {},
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  describe('formSummary/UPDATE_TIME_PERIOD reducer', () => {
    it('returns correct state on formSummary/UPDATE_TIME_PERIOD', () => {
      const initialState = {
        metrics: [],
        population: [
          {},
          {
            athletes: null,
            calculation: null,
            timePeriod: 'custom',
            dateRange: {},
          },
        ],
        comparisonGroupIndex: null,
      };

      const action = {
        type: 'formSummary/UPDATE_TIME_PERIOD',
        payload: {
          populationIndex: 1,
          timePeriodId: 'today',
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: [
          {},
          {
            athletes: null,
            calculation: null,
            timePeriod: 'today',
            dateRange: {},
            time_period_length: null,
            time_period_length_offset: null,
          },
        ],
        comparisonGroupIndex: null,
      });
    });

    it('keeps the date range if the new time period is still last_x_days', () => {
      const timePeriodId = 'last_x_days';

      const initialState = {
        metrics: [],
        population: [
          {
            athletes: null,
            calculation: null,
            timePeriod: 'last_x_days',
            dateRange: {
              end_date: '2018-01-09 00:00:00',
              start_date: '2018-01-31 23:59:59',
            },
          },
        ],
        comparisonGroupIndex: null,
      };

      const action = {
        type: 'formSummary/UPDATE_TIME_PERIOD',
        payload: {
          populationIndex: 0,
          timePeriodId,
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: [
          {
            athletes: null,
            calculation: null,
            timePeriod: 'last_x_days',
            dateRange: initialState.population[0].dateRange,
            time_period_length: null,
            time_period_length_offset: null,
          },
        ],
        comparisonGroupIndex: null,
      });
    });

    it('keeps the date range if the new time period is still custom_date_range', () => {
      const timePeriodId = 'custom_date_range';

      const initialState = {
        metrics: [],
        population: [
          {
            athletes: null,
            calculation: null,
            timePeriod: 'custom_date_range',
            dateRange: {
              end_date: '2018-01-09 00:00:00',
              start_date: '2018-01-31 23:59:59',
            },
          },
        ],
        comparisonGroupIndex: null,
      };

      const action = {
        type: 'formSummary/UPDATE_TIME_PERIOD',
        payload: {
          populationIndex: 0,
          timePeriodId,
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: [
          {
            athletes: null,
            calculation: null,
            timePeriod: 'custom_date_range',
            dateRange: initialState.population[0].dateRange,
            time_period_length: null,
            time_period_length_offset: null,
          },
        ],
        comparisonGroupIndex: null,
      });
    });

    it('clears the date range if the new time period is not custom_date_range', () => {
      const timePeriodId = 'time_period';

      const initialState = {
        metrics: [],
        population: [
          {
            athletes: null,
            calculation: null,
            timePeriod: 'last_x_days',
            dateRange: {
              end_date: '2018-01-09 00:00:00',
              start_date: '2018-01-31 23:59:59',
            },
          },
        ],
        comparisonGroupIndex: null,
      };

      const action = {
        type: 'formSummary/UPDATE_TIME_PERIOD',
        payload: {
          populationIndex: 0,
          timePeriodId,
        },
      };

      const nextState = GraphFormSummary(initialState, action);
      expect(nextState).toStrictEqual({
        metrics: [],
        population: [
          {
            athletes: null,
            calculation: null,
            timePeriod: 'time_period',
            time_period_length: null,
            time_period_length_offset: null,
            dateRange: {},
          },
        ],
        comparisonGroupIndex: null,
      });
    });
  });

  it('returns correct state on formSummary/UPDATE_TIME_PERIOD_LENGTH', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
        populationIndex: 1,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
          time_period_length: 4,
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/UPDATE_LAST_X_TIME_PERIOD', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD',
      payload: {
        lastXTimePeriod: 'weeks',
        populationIndex: 1,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
          last_x_time_period: 'weeks',
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 4,
        populationIndex: 1,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
          time_period_length_offset: 4,
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET',
      payload: {
        lastXTimePeriodOffset: 'weeks',
        populationIndex: 1,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
          last_x_time_period_offset: 'weeks',
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/UPDATE_SCALE_TYPE when the new scaleType is denormalized', () => {
    const initialState = {
      metrics: [],
      population: [],
      comparisonGroupIndex: 2,
      scale_type: 'normalized',
    };

    const action = {
      type: 'formSummary/UPDATE_SCALE_TYPE',
      payload: {
        scaleType: 'denormalized',
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      comparisonGroupIndex: null,
      scale_type: 'denormalized',
    });
  });

  it('returns correct state on formSummary/UPDATE_SCALE_TYPE when the new scaleType is normalized', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          calculation: 'max',
        },
        {
          calculation: 'last',
        },
      ],
      comparisonGroupIndex: null,
      scale_type: 'denormalized',
    };

    const action = {
      type: 'formSummary/UPDATE_SCALE_TYPE',
      payload: {
        scaleType: 'normalized',
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      ...initialState,
      comparisonGroupIndex: 0,
      scale_type: 'normalized',
      population: [
        {
          calculation: 'max',
        },
        {
          calculation: null,
        },
      ],
    });
  });

  it('returns correct state on formSummary/UPDATE_DATE_RANGE', () => {
    const initialState = {
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: null,
          selected_games: [],
          selected_training_sessions: [{ id: 1234 }],
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_DATE_RANGE',
      payload: {
        populationIndex: 1,
        dateRange: {
          start_date: '2018-01-09 00:00:00',
          end_date: '2018-01-31 23:59:59',
        },
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [
        {},
        {
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: {
            start_date: action.payload.dateRange.start_date,
            end_date: action.payload.dateRange.end_date,
          },
          selected_games: [],
          selected_training_sessions: [],
        },
      ],
      comparisonGroupIndex: null,
    });
  });

  it('returns correct state on formSummary/UPDATE_COMPARISON_GROUP', () => {
    const initialState = {
      metrics: [],
      population: [],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_COMPARISON_GROUP',
      payload: {
        populationIndex: 2,
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual({
      metrics: [],
      population: [],
      comparisonGroupIndex: 2,
    });
  });

  it('returns correct state on formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          event_type_time_period: null,
          timePeriod: null,
          dateRange: {},
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'game',
          dateRange: {
            start_date: '2018-01-09 00:00:00',
            end_date: '2018-01-31 23:59:59',
          },
          event_type_time_period: 'game',
          games: [],
          training_sessions: [],
          drills: [],
          selected_games: [],
          selected_training_sessions: [],
          event_breakdown: null,
          time_period_length: null,
          time_period_length_offset: null,
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD',
      payload: {
        populationIndex: 0,
        dateRange: {
          start_date: '2018-01-09 00:00:00',
          end_date: '2018-01-31 23:59:59',
        },
        itemKey: 'game',
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/UPDATE_GAMES_OPTIONS', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'game',
          dateRange: {},
          games: [],
          event_type_time_period: 'game',
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'game',
          dateRange: {},
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
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_GAMES_OPTIONS',
      payload: {
        populationIndex: 0,
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

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/UPDATE_TRAINING_SESSION_OPTIONS', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [],
          event_type_time_period: 'training_session',
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          event_type_time_period: 'training_session',
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_TRAINING_SESSION_OPTIONS',
      payload: {
        populationIndex: 0,
        trainingSessions: [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            session_type_name: 'Training',
          },
        ],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/UPDATE_DRILLS_OPTIONS', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_type_time_period: 'training_session',
          selected_training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          drills: [],
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_type_time_period: 'training_session',
          selected_training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
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
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_DRILLS_OPTIONS',
      payload: {
        populationIndex: 0,
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

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/UPDATE_EVENT_BREAKDOWN', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_type_time_period: 'training_session',
          selected_training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_breakdown: null,
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_type_time_period: 'training_session',
          selected_training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_breakdown: 'SUMMARY',
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_EVENT_BREAKDOWN',
      payload: {
        populationIndex: 0,
        breakdownTypeId: 'SUMMARY',
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/UPDATE_SELECTED_GAMES', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'game',
          dateRange: {},
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
          event_type_time_period: 'game',
          selected_games: [],
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'game',
          dateRange: {},
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
          event_type_time_period: 'game',
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
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_SELECTED_GAMES',
      payload: {
        populationIndex: 0,
        gameIds: [1234],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });

  it('returns correct state on formSummary/UPDATE_SELECTED_TRAINING_SESSIONS', () => {
    const initialState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_type_time_period: 'training_session',
          selected_training_sessions: [],
        },
      ],
      comparisonGroupIndex: null,
    };

    const expectedState = {
      metrics: [],
      population: [
        {
          athletes: null,
          calculation: null,
          timePeriod: 'training_session',
          dateRange: {},
          training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_type_time_period: 'training_session',
          selected_training_sessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
          event_breakdown: 'SUMMARY',
        },
      ],
      comparisonGroupIndex: null,
    };

    const action = {
      type: 'formSummary/UPDATE_SELECTED_TRAINING_SESSIONS',
      payload: {
        populationIndex: 0,
        trainingSessionIds: [1234],
      },
    };

    const nextState = GraphFormSummary(initialState, action);
    expect(nextState).toStrictEqual(expectedState);
  });
});

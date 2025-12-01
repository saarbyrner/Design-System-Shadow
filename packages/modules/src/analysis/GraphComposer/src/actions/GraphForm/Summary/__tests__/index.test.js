import {
  addPopulation,
  deletePopulation,
  addMetrics,
  removeMetrics,
  updateAthletes,
  updateScaleType,
  updateCalculation,
  updateTimePeriod,
  updateDateRange,
  updateComparisonGroup,
  updateEventTypeTimePeriod,
  updateGamesOptions,
  populateGames,
  updateTrainingSessionOptions,
  populateTrainingSessions,
  updateDrillsOptions,
  populateDrills,
  updateEventBreakdown,
  updateSelectedGames,
  updateSelectedTrainingSessions,
  updateTimePeriodLength,
  updateLastXTimePeriod,
  updateTimePeriodLengthOffset,
  updateLastXTimePeriodOffset,
  addFilter,
  removeFilter,
  updateEventTypeFilters,
  updateTrainingSessionTypeFilters,
} from '..';
import { eventTypeRequest } from '../../../index';

describe('Graph Composer - Graph Form - Summary Actions', () => {
  it('has the correct action formSummary/ADD_POPULATION', () => {
    const expectedAction = {
      type: 'formSummary/ADD_POPULATION',
    };

    expect(addPopulation()).toEqual(expectedAction);
  });

  it('has the correct action formSummary/DELETE_POPULATION', () => {
    const expectedAction = {
      type: 'formSummary/DELETE_POPULATION',
      payload: {
        index: 0,
      },
    };

    expect(deletePopulation(0)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/ADD_METRICS', () => {
    const expectedAction = {
      type: 'formSummary/ADD_METRICS',
      payload: {
        addedMetrics: ['metric1', 'metric2'],
      },
    };

    expect(addMetrics(['metric1', 'metric2'])).toEqual(expectedAction);
  });

  it('has the correct action formSummary/REMOVE_METRICS', () => {
    const expectedAction = {
      type: 'formSummary/REMOVE_METRICS',
      payload: {
        removedMetrics: ['metric1', 'metric2'],
      },
    };

    expect(removeMetrics(['metric1', 'metric2'])).toEqual(expectedAction);
  });

  it('has the correct action formSummary/ADD_FILTER', () => {
    const expectedAction = {
      type: 'formSummary/ADD_FILTER',
      payload: {
        populationIndex: 0,
      },
    };

    expect(addFilter(0)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/REMOVE_FILTER', () => {
    const expectedAction = {
      type: 'formSummary/REMOVE_FILTER',
      payload: {
        populationIndex: 0,
      },
    };

    expect(removeFilter(0)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_EVENT_TYPE_FILTERS', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_EVENT_TYPE_FILTERS',
      payload: {
        populationIndex: 0,
        eventTypeFilters: ['game'],
      },
    };

    expect(updateEventTypeFilters(0, ['game'])).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS', () => {
    const trainingSessionTypeFilters = [123, 456];

    const expectedAction = {
      type: 'formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS',
      payload: {
        populationIndex: 0,
        trainingSessionTypeFilters,
      },
    };

    expect(
      updateTrainingSessionTypeFilters(0, trainingSessionTypeFilters)
    ).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_ATHLETES', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_ATHLETES',
      payload: {
        populationIndex: 2,
        athletesId: 'athlete1',
      },
    };

    expect(updateAthletes(2, 'athlete1')).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_SCALE_TYPE', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_SCALE_TYPE',
      payload: {
        scaleType: 'normalized',
      },
    };

    expect(updateScaleType('normalized')).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_CALCULATION', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_CALCULATION',
      payload: {
        populationIndex: 2,
        calculationId: 'sum',
      },
    };

    expect(updateCalculation(2, 'sum')).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_TIME_PERIOD',
      payload: {
        populationIndex: 2,
        timePeriodId: 'today',
      },
    };

    expect(updateTimePeriod(2, 'today')).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_TIME_PERIOD_LENGTH', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
        populationIndex: 2,
      },
    };

    expect(updateTimePeriodLength(4, 2)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_LAST_X_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD',
      payload: {
        lastXTimePeriod: 'weeks',
        populationIndex: 2,
      },
    };

    expect(updateLastXTimePeriod('weeks', 2)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 4,
        populationIndex: 2,
      },
    };

    expect(updateTimePeriodLengthOffset(4, 2)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET',
      payload: {
        lastXTimePeriodOffset: 'weeks',
        populationIndex: 2,
      },
    };

    expect(updateLastXTimePeriodOffset('weeks', 2)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_DATE_RANGE', () => {
    const newDateRange = {
      start_date: 'today',
      end_date: 'tomorrow',
    };

    const expectedAction = {
      type: 'formSummary/UPDATE_DATE_RANGE',
      payload: {
        populationIndex: 2,
        dateRange: newDateRange,
      },
    };

    expect(updateDateRange(2, newDateRange)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_COMPARISON_GROUP', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_COMPARISON_GROUP',
      payload: {
        populationIndex: 2,
      },
    };

    expect(updateComparisonGroup(2)).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD',
      payload: {
        populationIndex: 1,
        dateRange: {},
        itemKey: 'game',
      },
    };

    expect(updateEventTypeTimePeriod(1, 'game', {})).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_GAMES_OPTIONS', () => {
    const expectedAction = {
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

    expect(
      updateGamesOptions(0, [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          opponent_score: '12',
          opponent_team_name: 'Opponent Team',
          score: '13',
          team_name: 'Kitman',
          venue_type_name: 'Home',
        },
      ])
    ).toEqual(expectedAction);
  });

  // Mock XMLHttpRequest for thunk tests
  let mockXHR;
  beforeEach(() => {
    mockXHR = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      getAllResponseHeaders: jest.fn(() => ''),
      getResponseHeader: jest.fn(() => ''),
      addEventListener: jest.fn((event, callback) => {
        if (event === 'load') {
          mockXHR.onload = callback;
        }
      }),
      status: 200,
      responseText: '[]',
      readyState: 4,
    };
    global.XMLHttpRequest = jest.fn(() => mockXHR);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('populateGames action', () => {
    describe('when the server request is successful', () => {
      it('calls the action formSummary/UPDATE_GAMES_OPTIONS', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const state = {
          population: [
            {
              squadSelection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              calculation: 'min',
              timePeriod: 'yesterday',
              date_range: {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
              },
              comparisonGroup: true,
              eventTypeTimePeriod: 'game',
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
          metrics: [],
          comparisonGroupIndex: 0,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock successful response
        mockXHR.status = 200;
        mockXHR.responseText = '[]';

        const thunk = populateGames(0, dateRange);
        thunk(dispatch, getState);

        // Trigger the success callback
        if (mockXHR.onload) {
          mockXHR.onload();
        }

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: 'formSummary/UPDATE_GAMES_OPTIONS',
          payload: {
            populationIndex: 0,
            games: '[]',
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const state = {
          population: [
            {
              squadSelection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              calculation: 'min',
              timePeriod: 'yesterday',
              date_range: {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
              },
              comparisonGroup: true,
              eventTypeTimePeriod: 'game',
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
          metrics: [],
          comparisonGroupIndex: 0,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock error response
        mockXHR.status = 422;
        mockXHR.responseText = 'ERROR';

        const thunk = populateGames(0, dateRange);
        thunk(dispatch, getState);

        // Trigger the error callback
        if (mockXHR.onload) {
          mockXHR.onload();
        }

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  it('has the correct action formSummary/UPDATE_TRAINING_SESSION_OPTIONS', () => {
    const expectedAction = {
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

    expect(
      updateTrainingSessionOptions(0, [
        {
          date: '2019-04-24T23:00:00Z',
          id: 1234,
          session_type_name: 'Training',
        },
      ])
    ).toEqual(expectedAction);
  });

  describe('populateTrainingSessions action', () => {
    describe('when the server request is successful', () => {
      it('calls the action formSummary/UPDATE_TRAINING_SESSION_OPTIONS', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const state = {
          population: [
            {
              squadSelection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              calculation: 'min',
              timePeriod: 'yesterday',
              date_range: {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
              },
              comparisonGroup: true,
              eventTypeTimePeriod: 'training_session',
              trainingSessions: [
                {
                  date: '2017-10-27',
                  id: 1234,
                  session_type_name: 'Training Session',
                },
              ],
            },
          ],
          metrics: [],
          comparisonGroupIndex: 0,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock successful response
        mockXHR.status = 200;
        mockXHR.responseText = '[]';

        const thunk = populateTrainingSessions(0, dateRange);
        thunk(dispatch, getState);

        // Trigger the success callback
        if (mockXHR.onload) {
          mockXHR.onload();
        }

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: 'formSummary/UPDATE_TRAINING_SESSION_OPTIONS',
          payload: {
            populationIndex: 0,
            trainingSessions: '[]',
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const state = {
          population: [
            {
              squadSelection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              calculation: 'min',
              timePeriod: 'yesterday',
              date_range: {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
              },
              comparisonGroup: true,
              eventTypeTimePeriod: 'training_session',
              trainingSessions: [
                {
                  date: '2017-10-27',
                  id: 1234,
                  session_type_name: 'Training Session',
                },
              ],
            },
          ],
          metrics: [],
          comparisonGroupIndex: 0,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock error response
        mockXHR.status = 422;
        mockXHR.responseText = 'ERROR';

        const thunk = populateTrainingSessions(0, dateRange);
        thunk(dispatch, getState);

        // Trigger the error callback
        if (mockXHR.onload) {
          mockXHR.onload();
        }

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  it('has the correct action formSummary/UPDATE_DRILLS_OPTIONS', () => {
    const expectedAction = {
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

    expect(
      updateDrillsOptions(0, [
        {
          id: 1234,
          name: 'Drill 1',
        },
        {
          id: 5678,
          name: 'Drill 2',
        },
      ])
    ).toEqual(expectedAction);
  });

  describe('populateDrills action', () => {
    describe('when the server request is successful', () => {
      it('calls the action formSummary/UPDATE_DRILLS_OPTIONS', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const trainingSessions = [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            session_type_name: 'Training',
          },
        ];

        const state = {
          population: [
            {
              squadSelection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              calculation: 'min',
              timePeriod: 'yesterday',
              date_range: {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
              },
              comparisonGroup: true,
              eventTypeTimePeriod: 'training_session',
              trainingSessions,
            },
          ],
          metrics: [],
          comparisonGroupIndex: 0,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock successful response
        mockXHR.status = 200;
        mockXHR.responseText = '[]';

        const thunk = populateDrills(0, dateRange);
        thunk(dispatch, getState);

        // Trigger the success callback
        if (mockXHR.onload) {
          mockXHR.onload();
        }

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: 'formSummary/UPDATE_DRILLS_OPTIONS',
          payload: {
            populationIndex: 0,
            drills: '[]',
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const trainingSessions = [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            session_type_name: 'Training',
          },
        ];

        const state = {
          population: [
            {
              squadSelection: {
                athletes: [],
                positions: [71],
                position_groups: [],
                applies_to_squad: false,
              },
              calculation: 'min',
              timePeriod: 'yesterday',
              date_range: {
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
              },
              comparisonGroup: true,
              eventTypeTimePeriod: 'training_session',
              trainingSessions,
            },
          ],
          metrics: [],
          comparisonGroupIndex: 0,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock error response
        mockXHR.status = 422;
        mockXHR.responseText = 'ERROR';

        const thunk = populateDrills(0, dateRange);
        thunk(dispatch, getState);

        // Trigger the error callback
        if (mockXHR.onload) {
          mockXHR.onload();
        }

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  it('has the correct action formSummary/UPDATE_EVENT_BREAKDOWN', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_EVENT_BREAKDOWN',
      payload: {
        populationIndex: 0,
        breakdownTypeId: 'SUMMARY',
      },
    };

    expect(updateEventBreakdown(0, 'SUMMARY')).toEqual(expectedAction);
  });

  it('has the correct action formSummary/UPDATE_SELECTED_GAMES', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_SELECTED_GAMES',
      payload: {
        populationIndex: 0,
        gameIds: 123456,
        selectionType: 'MULTI_SELECT',
      },
    };

    expect(updateSelectedGames(0, 123456, 'MULTI_SELECT')).toEqual(
      expectedAction
    );
  });

  it('has the correct action formSummary/UPDATE_SELECTED_TRAINING_SESSIONS', () => {
    const expectedAction = {
      type: 'formSummary/UPDATE_SELECTED_TRAINING_SESSIONS',
      payload: {
        populationIndex: 0,
        trainingSessionIds: 123456,
        selectionType: 'MULTI_SELECT',
      },
    };

    expect(updateSelectedTrainingSessions(0, 123456, 'MULTI_SELECT')).toEqual(
      expectedAction
    );
  });
});

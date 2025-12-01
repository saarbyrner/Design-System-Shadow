import $ from 'jquery';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import {
  updateSquadSelection,
  updateStatus,
  updateDrillsOptions,
  updateTrainingSessionOptions,
  updateGamesOptions,
  updateEventTypeTimePeriod,
  updateTimePeriod,
  updateTimePeriodLength,
  updateLastXTimePeriod,
  updateTimePeriodLengthOffset,
  updateLastXTimePeriodOffset,
  updateDateRange,
  updateSelectedGames,
  updateSelectedTrainingSessions,
  updateEventBreakdown,
  updateCategory,
  updateCategoryDivision,
  updateCategorySelection,
  addFilter,
  removeFilter,
  updateTimeLossFilters,
  updateSessionTypeFilters,
  updateEventTypeFilters,
  updateTrainingSessionTypeFilters,
  updateCompetitionFilters,
  deleteOverlay,
  addOverlay,
  updateOverlaySummary,
  updateOverlayPopulation,
  updateOverlayTimePeriod,
  updateOverlayDateRange,
  updateMetricStyle,
  updateMeasurementType,
  populateTrainingSessions,
  populateGames,
  populateDrills,
} from '..';
import { eventTypeRequest } from '../../index';

// Mock jQuery at the module level
jest.mock('jquery', () => ({
  ajax: jest.fn(),
}));

describe('Graph Composer - Graph Form Actions', () => {
  it('has the correct action UPDATE_SQUAD_SELECTION', () => {
    const squadSelection = {
      positions: ['53'],
      position_groups: ['12'],
      athletes: ['2938'],
      applies_to_squad: false,
    };
    const expectedAction = {
      type: 'UPDATE_SQUAD_SELECTION',
      payload: {
        index: 0,
        squadSelection,
      },
    };

    expect(updateSquadSelection(0, squadSelection)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_STATUS', () => {
    const originalStatus = blankStatus();
    const status = Object.assign({}, originalStatus, {
      description: 'new description',
    });
    const expectedAction = {
      type: 'UPDATE_STATUS',
      payload: {
        index: 0,
        status,
      },
    };

    expect(updateStatus(0, status)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_DRILLS_OPTIONS', () => {
    const expectedAction = {
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

  it('has the correct action UPDATE_TRAINING_SESSION_OPTIONS', () => {
    const expectedAction = {
      type: 'UPDATE_TRAINING_SESSION_OPTIONS',
      payload: {
        metricIndex: 0,
        trainingSessions: [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            session_type_name: 'Training',
          },
          {
            date: '2019-04-25T23:00:00Z',
            id: 5678,
            session_type_name: 'Conditioning',
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
        {
          date: '2019-04-25T23:00:00Z',
          id: 5678,
          session_type_name: 'Conditioning',
        },
      ])
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_GAMES_OPTIONS', () => {
    const expectedAction = {
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

  it('has the correct action UPDATE_EVENT_TYPE_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'UPDATE_EVENT_TYPE_TIME_PERIOD',
      payload: {
        metricIndex: 0,
        dateRange: {},
        itemKey: 'game',
      },
    };

    expect(updateEventTypeTimePeriod(0, 'game', {})).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TIME_PERIOD', () => {
    const timePeriod = 'time_period';
    const expectedAction = {
      type: 'UPDATE_TIME_PERIOD',
      payload: {
        timePeriod,
      },
    };

    expect(updateTimePeriod(timePeriod)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TIME_PERIOD_LENGTH', () => {
    const expectedAction = {
      type: 'UPDATE_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
      },
    };

    expect(updateTimePeriodLength(4)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_LAST_X_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'UPDATE_LAST_X_TIME_PERIOD',
      payload: {
        lastXTimePeriod: 'weeks',
      },
    };

    expect(updateLastXTimePeriod('weeks')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TIME_PERIOD_LENGTH_OFFSET', () => {
    const expectedAction = {
      type: 'UPDATE_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 4,
      },
    };

    expect(updateTimePeriodLengthOffset(4)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_LAST_X_TIME_PERIOD_OFFSET', () => {
    const expectedAction = {
      type: 'UPDATE_LAST_X_TIME_PERIOD_OFFSET',
      payload: {
        lastXTimePeriodOffset: 'weeks',
      },
    };

    expect(updateLastXTimePeriodOffset('weeks')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_DATE_RANGE', () => {
    const dateRange = {
      start_date: '10/06/2018',
      en_date: '20/08/2018',
    };
    const expectedAction = {
      type: 'UPDATE_DATE_RANGE',
      payload: {
        dateRange,
      },
    };

    expect(updateDateRange(dateRange)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_SELECTED_GAMES', () => {
    const expectedAction = {
      type: 'UPDATE_SELECTED_GAMES',
      payload: {
        metricIndex: 0,
        gameIds: 123456,
        selectionType: 'MULTI_SELECT',
      },
    };

    expect(updateSelectedGames(0, 123456, 'MULTI_SELECT')).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_SELECTED_TRAINING_SESSIONS', () => {
    const expectedAction = {
      type: 'UPDATE_SELECTED_TRAINING_SESSIONS',
      payload: {
        metricIndex: 0,
        trainingSessionIds: 123456,
        selectionType: 'MULTI_SELECT',
      },
    };

    expect(updateSelectedTrainingSessions(0, 123456, 'MULTI_SELECT')).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_EVENT_BREAKDOWN', () => {
    const expectedAction = {
      type: 'UPDATE_EVENT_BREAKDOWN',
      payload: {
        metricIndex: 0,
        breakdownTypeId: 'SUMMARY',
      },
    };

    expect(updateEventBreakdown(0, 'SUMMARY')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_CATEGORY', () => {
    const metricIndex = 1;
    const category = 'all_injuries';
    const mainCategory = 'injury';

    const expectedAction = {
      type: 'UPDATE_CATEGORY',
      payload: {
        metricIndex,
        category,
        mainCategory,
      },
    };

    expect(updateCategory(metricIndex, category, mainCategory)).toEqual(
      expectedAction
    );
  });

  it('has the correct action ADD_FILTER', () => {
    const metricIndex = 1;

    const expectedAction = {
      type: 'ADD_FILTER',
      payload: {
        metricIndex,
      },
    };

    expect(addFilter(metricIndex)).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_FILTER', () => {
    const metricIndex = 1;

    const expectedAction = {
      type: 'REMOVE_FILTER',
      payload: {
        metricIndex,
      },
    };

    expect(removeFilter(metricIndex)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_TIME_LOSS_FILTERS', () => {
    const metricIndex = 1;
    const timeLossFilters = ['time_loss', 'non_time_loss'];

    const expectedAction = {
      type: 'UPDATE_TIME_LOSS_FILTERS',
      payload: {
        metricIndex,
        timeLossFilters,
      },
    };

    expect(updateTimeLossFilters(metricIndex, timeLossFilters)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_SESSION_TYPE_FILTERS', () => {
    const metricIndex = 1;
    const sessionTypeFilters = ['rugby_game', 'other'];

    const expectedAction = {
      type: 'UPDATE_SESSION_TYPE_FILTERS',
      payload: {
        metricIndex,
        sessionTypeFilters,
      },
    };

    expect(updateSessionTypeFilters(metricIndex, sessionTypeFilters)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_EVENT_TYPE_FILTERS', () => {
    const metricIndex = 1;
    const eventTypeFilters = ['game', 'training_session'];

    const expectedAction = {
      type: 'UPDATE_EVENT_TYPE_FILTERS',
      payload: {
        metricIndex,
        eventTypeFilters,
      },
    };

    expect(updateEventTypeFilters(metricIndex, eventTypeFilters)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_TRAINING_SESSION_TYPE_FILTERS', () => {
    const metricIndex = 1;
    const trainingSessionTypeFilters = [123, 456];

    const expectedAction = {
      type: 'UPDATE_TRAINING_SESSION_TYPE_FILTERS',
      payload: {
        metricIndex,
        trainingSessionTypeFilters,
      },
    };

    expect(
      updateTrainingSessionTypeFilters(metricIndex, trainingSessionTypeFilters)
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_COMPETITION_FILTERS', () => {
    const metricIndex = 1;
    const competitionFilters = ['1', '2'];

    const expectedAction = {
      type: 'UPDATE_COMPETITION_FILTERS',
      payload: {
        metricIndex,
        competitionFilters,
      },
    };

    expect(updateCompetitionFilters(metricIndex, competitionFilters)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_CATEGORY_DIVISION', () => {
    const metricIndex = 1;
    const categoryDivision = 'body_area';

    const expectedAction = {
      type: 'UPDATE_CATEGORY_DIVISION',
      payload: {
        metricIndex,
        categoryDivision,
      },
    };

    expect(updateCategoryDivision(metricIndex, categoryDivision)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_CATEGORY_SELECTION', () => {
    const metricIndex = 1;
    const categorySelection = 'ankle_fracture';

    const expectedAction = {
      type: 'UPDATE_CATEGORY_SELECTION',
      payload: {
        metricIndex,
        categorySelection,
      },
    };

    expect(updateCategorySelection(metricIndex, categorySelection)).toEqual(
      expectedAction
    );
  });

  it('has the correct action ADD_OVERLAY', () => {
    const expectedAction = {
      type: 'ADD_OVERLAY',
      payload: {
        metricIndex: 1,
      },
    };

    expect(addOverlay(1)).toEqual(expectedAction);
  });

  it('has the correct action DELETE_OVERLAY', () => {
    const expectedAction = {
      type: 'DELETE_OVERLAY',
      payload: {
        metricIndex: 0,
        overlayIndex: 1,
      },
    };

    expect(deleteOverlay(0, 1)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OVERLAY_SUMMARY', () => {
    const summary = 'min';
    const metricIndex = 1;
    const overlayIndex = 2;

    const expectedAction = {
      type: 'UPDATE_OVERLAY_SUMMARY',
      payload: {
        summary,
        metricIndex,
        overlayIndex,
      },
    };

    expect(updateOverlaySummary(metricIndex, overlayIndex, summary)).toEqual(
      expectedAction
    );
  });

  it('has the correct action UPDATE_OVERLAY_POPULATION', () => {
    const population = 'position_68';
    const metricIndex = 1;
    const overlayIndex = 2;

    const expectedAction = {
      type: 'UPDATE_OVERLAY_POPULATION',
      payload: {
        population,
        metricIndex,
        overlayIndex,
      },
    };

    expect(
      updateOverlayPopulation(metricIndex, overlayIndex, population)
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OVERLAY_TIME_PERIOD', () => {
    const timePeriod = 'yesterday';
    const metricIndex = 1;
    const overlayIndex = 2;

    const expectedAction = {
      type: 'UPDATE_OVERLAY_TIME_PERIOD',
      payload: {
        timePeriod,
        metricIndex,
        overlayIndex,
      },
    };

    expect(
      updateOverlayTimePeriod(metricIndex, overlayIndex, timePeriod)
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_OVERLAY_DATE_RANGE', () => {
    const dateRange = { start_date: '', end_date: '' };
    const metricIndex = 1;
    const overlayIndex = 2;

    const expectedAction = {
      type: 'UPDATE_OVERLAY_DATE_RANGE',
      payload: {
        dateRange,
        metricIndex,
        overlayIndex,
      },
    };

    expect(
      updateOverlayDateRange(metricIndex, overlayIndex, dateRange)
    ).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_METRIC_STYLE', () => {
    const expectedAction = {
      type: 'UPDATE_METRIC_STYLE',
      payload: {
        metricIndex: 0,
        metricStyle: 'column',
      },
    };

    expect(updateMetricStyle(0, 'column')).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_MEASUREMENT_TYPE', () => {
    const measurementType = 'raw';
    const expectedAction = {
      type: 'UPDATE_MEASUREMENT_TYPE',
      payload: {
        metricIndex: 0,
        measurementType,
      },
    };

    expect(updateMeasurementType(0, measurementType)).toEqual(expectedAction);
  });

  describe('populateTrainingSessions action', () => {
    beforeEach(() => {
      // Clear mock calls before each test
      $.ajax.mockClear();
    });

    describe('when the server request is successful', () => {
      it('calls the action UPDATE_TRAINING_SESSION_OPTIONS', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const state = {
          metrics: [
            {
              status: {
                status_id: '1234',
                description: null,
                localised_unit: null,
                period_scope: null,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                source: 'kitman:tv',
                summary: null,
                variable: null,
                name: '',
                is_custom_name: false,
                variables: [],
                settings: {},
              },
              type: 'metric',
              overlays: [],
            },
          ],
          eventTypeTimePeriod: 'training_session',
          date_range: {
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
          },
          trainingSessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock the ajax call to immediately call success
        $.ajax.mockImplementation(({ success }) => {
          success('[]');
        });

        const thunk = populateTrainingSessions(0, dateRange);
        thunk(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: 'UPDATE_TRAINING_SESSION_OPTIONS',
          payload: {
            metricIndex: 0,
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
          metrics: [
            {
              status: {
                status_id: '1234',
                description: null,
                localised_unit: null,
                period_scope: null,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                source: 'kitman:tv',
                summary: null,
                variable: null,
                name: '',
                is_custom_name: false,
                variables: [],
                settings: {},
              },
              type: 'metric',
              overlays: [],
            },
          ],
          eventTypeTimePeriod: 'training_session',
          date_range: {
            start_date: '2019-02-01T00:00:00Z',
            end_date: '2019-07-03T23:59:59+01:00',
          },
          trainingSessions: [
            {
              date: '2019-04-24T23:00:00Z',
              id: 1234,
              session_type_name: 'Training',
            },
          ],
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock the ajax call to immediately call error
        $.ajax.mockImplementation(({ error }) => {
          error();
        });

        const thunk = populateTrainingSessions(0, dateRange);
        thunk(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  describe('populateGames action', () => {
    beforeEach(() => {
      // Clear mock calls before each test
      $.ajax.mockClear();
    });

    describe('when the server request is successful', () => {
      it('calls the action UPDATE_GAMES_OPTIONS', () => {
        const dateRange = {
          start_date: '2019-02-01T00:00:00Z',
          end_date: '2019-07-03T23:59:59+01:00',
        };

        const state = {
          metrics: [
            {
              status: {
                status_id: '1234',
                description: null,
                localised_unit: null,
                period_scope: null,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                source: 'kitman:tv',
                summary: null,
                variable: null,
                name: '',
                is_custom_name: false,
                variables: [],
                settings: {},
              },
              type: 'metric',
              overlays: [],
            },
          ],
          eventTypeTimePeriod: 'training_session',
          date_range: {
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
          },
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

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock the ajax call to immediately call success
        $.ajax.mockImplementation(({ success }) => {
          success('[]');
        });

        const thunk = populateGames(0, dateRange);
        thunk(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: 'UPDATE_GAMES_OPTIONS',
          payload: {
            metricIndex: 0,
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
          metrics: [
            {
              status: {
                status_id: '1234',
                description: null,
                localised_unit: null,
                period_scope: null,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                source: 'kitman:tv',
                summary: null,
                variable: null,
                name: '',
                is_custom_name: false,
                variables: [],
                settings: {},
              },
              type: 'metric',
              overlays: [],
            },
          ],
          eventTypeTimePeriod: 'training_session',
          date_range: {
            start_date: '2019-02-01T00:00:00Z',
            end_date: '2019-07-03T23:59:59+01:00',
          },
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

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock the ajax call to immediately call error
        $.ajax.mockImplementation(({ error }) => {
          error();
        });

        const thunk = populateGames(0, dateRange);
        thunk(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });

  describe('populateDrills action', () => {
    beforeEach(() => {
      // Clear mock calls before each test
      $.ajax.mockClear();
    });

    describe('when the server request is successful', () => {
      it('calls the action UPDATE_DRILLS_OPTIONS', () => {
        const trainingSessions = [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            session_type_name: 'Training',
          },
        ];

        const state = {
          metrics: [
            {
              status: {
                status_id: '1234',
                description: null,
                localised_unit: null,
                period_scope: null,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                source: 'kitman:tv',
                summary: null,
                variable: null,
                name: '',
                is_custom_name: false,
                variables: [],
                settings: {},
              },
              type: 'metric',
              overlays: [],
            },
          ],
          eventTypeTimePeriod: 'training_session',
          selectedTrainingSessions: trainingSessions[0].id,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock the ajax call to immediately call success
        $.ajax.mockImplementation(({ success }) => {
          success('[]');
        });

        const thunk = populateDrills(0, [trainingSessions[0].id]);
        thunk(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: 'UPDATE_DRILLS_OPTIONS',
          payload: {
            metricIndex: 0,
            drills: '[]',
          },
        });
      });
    });

    describe('when the server request is unsuccessful', () => {
      it('calls the action SERVER_REQUEST_ERROR', () => {
        const trainingSessions = [
          {
            date: '2019-04-24T23:00:00Z',
            id: 1234,
            session_type_name: 'Training',
          },
        ];

        const state = {
          metrics: [
            {
              status: {
                status_id: '1234',
                description: null,
                localised_unit: null,
                period_scope: null,
                second_period_length: null,
                operator: null,
                second_period_all_time: null,
                source: 'kitman:tv',
                summary: null,
                variable: null,
                name: '',
                is_custom_name: false,
                variables: [],
                settings: {},
              },
              type: 'metric',
              overlays: [],
            },
          ],
          eventTypeTimePeriod: 'training_session',
          selectedTrainingSessions: trainingSessions[0].id,
        };

        const getState = jest.fn(() => state);
        const dispatch = jest.fn();

        // Mock the ajax call to immediately call error
        $.ajax.mockImplementation(({ error }) => {
          error();
        });

        const thunk = populateDrills(0, [trainingSessions[0].id]);
        thunk(dispatch, getState);

        expect(dispatch).toHaveBeenNthCalledWith(1, eventTypeRequest());
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: 'SERVER_REQUEST_ERROR',
        });
      });
    });
  });
});

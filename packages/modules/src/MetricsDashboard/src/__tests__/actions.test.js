import { server, rest } from '@kitman/services/src/mocks/server';
import { waitFor } from '@testing-library/react';
import uuid from 'uuid';

import {
  saveAlarmDefinitions,
  saveAlarmDefinitionsRequest,
  saveAlarmDefinitionsSuccess,
  saveAlarmDefinitionsFailure,
  setAlarmDefinitionsForStatus,
  addAlarmDefinitionForStatus,
  deleteAlarmDefinitionForStatus,
  setAlarmCondition,
  setAlarmValue,
  showConfirmFeedbackMessage,
  closeFeedbackMessage,
  alarmSquadSearch,
  setAlarmColour,
  getLatestData,
  hideCurrentModal,
  toggleDashboardFilters,
  updateFilterOptions,
  updateSort,
  updateShowAlarmOnMobile,
  toggleSelectAllForMobile,
  setAlarmCalculation,
  setAlarmType,
  setAlarmPercentage,
  setAlarmPeriodScope,
  setAlarmPeriodLength,
  deleteAllAlarmDefinitionsForStatus,
  confirmDeleteAllAlarmDefinitionsForStatus,
} from '../actions';

describe('getLatestData action', () => {
  test('calls failure handler when unsuccessful', async () => {
    // Mock the AJAX call to fail
    server.use(
      rest.get('/dashboards/show.json', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        );
      })
    );

    const fakePostUpdateAction = {};
    const failureHandler = jest.fn();
    const thunk = getLatestData(fakePostUpdateAction, failureHandler);
    const dispatcher = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue({
      dashboards: { currentId: 10 },
    });

    thunk(dispatcher, getState);

    // Need to wait for the async AJAX call to complete and fail
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(failureHandler).toHaveBeenCalled();
  });
});

describe('saveAlarmsDefinition action', () => {
  const statusId = uuid.v4();

  // not full alarm, just for test
  const alarmDefinitions = [
    {
      alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
      applies_to_squad: false,
      athletes: [99],
    },
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('calls the server with the correct parameters', async () => {
    const expectedRequestBody = {
      status_id: statusId,
      alarms: [
        {
          alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
          applies_to_squad: false,
          athletes: [99],
        },
      ],
    };

    let requestBody;
    server.use(
      rest.put('/settings/alarms', async (req, res, ctx) => {
        requestBody = await req.json();
        return res(ctx.status(200), ctx.text('OK'));
      })
    );

    const thunk = saveAlarmDefinitions(statusId, alarmDefinitions);
    thunk(jest.fn());

    // Wait for the request to be processed
    await waitFor(() => {
      expect(requestBody).toEqual(expectedRequestBody);
    });
  });

  describe('When the user edits an alarm', () => {
    // When editing an alarm, the data shape is different
    const editedAlarmDefinitions = [
      {
        alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
        applies_to_squad: false,
        athletes: [
          {
            id: 1,
            firstname: 'Mark',
            lastname: 'Hill',
            on_dashboard: true,
          },
          {
            id: 5,
            firstname: 'John',
            lastname: 'Do',
            on_dashboard: false,
          },
        ],
      },
    ];

    test('calls the server with the correct parameters', async () => {
      const expectedRequestBody = {
        status_id: statusId,
        alarms: [
          {
            alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
            applies_to_squad: false,
            athletes: [1, 5],
          },
        ],
      };

      let requestBody;
      server.use(
        rest.put('/settings/alarms', async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200), ctx.text('OK'));
        })
      );

      const thunk = saveAlarmDefinitions(statusId, editedAlarmDefinitions);
      thunk(jest.fn());

      // Wait for the request to be processed
      await waitFor(() => {
        expect(requestBody).toEqual(expectedRequestBody);
      });
    });
  });

  test('gets updated data and updates the state when successful', async () => {
    server.use(
      rest.put('/settings/alarms', (req, res, ctx) => {
        return res(ctx.status(200), ctx.text('OK'));
      }),
      rest.get('/dashboards/show.json', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}));
      })
    );

    // call saveAlarmDefinitions and check it sends the request action
    const thunk = saveAlarmDefinitions(statusId, alarmDefinitions, jest.fn());
    const dispatcher = jest.fn();
    thunk(dispatcher);

    // Wait for the first dispatch to occur
    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith(saveAlarmDefinitionsRequest());
    });

    // trigger the getLatestData call
    const getLatestDispatcher = jest.fn();
    const updateThunk = dispatcher.mock.calls[1][0];
    updateThunk(getLatestDispatcher);

    // the postUpdateAction we setup is the last dispatched action after
    // getLatestData finished
    await waitFor(() => {
      expect(getLatestDispatcher.mock.calls.length).toBeGreaterThan(0);
    });

    const postUpdateAction =
      getLatestDispatcher.mock.calls[
        getLatestDispatcher.mock.calls.length - 1
      ][0];
    // call it to trigger the dispatch (these will be on the first dispatcher)
    postUpdateAction();

    // advance time to simulate the setTimeout firing
    jest.advanceTimersByTime(1001);

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith(saveAlarmDefinitionsSuccess());
      expect(dispatcher).toHaveBeenCalledWith(hideCurrentModal());
    });
  });

  test("doesn't update the state when unsuccessful", async () => {
    server.use(
      rest.put('/settings/alarms', (req, res, ctx) => {
        return res(ctx.status(422), ctx.text('Unprocesseable Entity'));
      })
    );

    const thunk = saveAlarmDefinitions(statusId, alarmDefinitions);
    const dispatcher = jest.fn();
    thunk(dispatcher);

    await waitFor(() => {
      expect(dispatcher).toHaveBeenCalledWith(saveAlarmDefinitionsFailure());
    });
  });

  test('should create an action to set alarm definitions for the status', () => {
    const alarms = [
      {
        alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
      },
    ];

    const expectedAction = {
      type: 'SET_ALARM_DEFINITIONS_FOR_STATUS',
      payload: {
        alarms,
      },
    };

    expect(setAlarmDefinitionsForStatus(alarms)).toEqual(expectedAction);
  });

  test('should create an action to add an alarm', () => {
    const alarmId = uuid.v4();
    const expectedAction = {
      type: 'ADD_ALARM_DEFINITION_FOR_STATUS',
      payload: {
        alarmId,
      },
    };

    expect(addAlarmDefinitionForStatus(alarmId)).toEqual(expectedAction);
  });

  test('should create an action to delete an alarm', () => {
    const index = 0;
    const expectedAction = {
      type: 'DELETE_ALARM_DEFINITION_FOR_STATUS',
      payload: {
        index,
      },
    };

    expect(deleteAlarmDefinitionForStatus(index)).toEqual(expectedAction);
  });

  test('should create an action to confirm to delete all alarms', () => {
    const expectedAction = {
      type: 'CONFIRM_DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
    };

    expect(confirmDeleteAllAlarmDefinitionsForStatus()).toEqual(expectedAction);
  });

  test('should create an action to delete all alarms', () => {
    const expectedAction = {
      type: 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
    };

    expect(deleteAllAlarmDefinitionsForStatus()).toEqual(expectedAction);
  });

  test('should create an action to set an alarm condition', () => {
    const index = 0;
    const condition = 'greater_than';

    const expectedAction = {
      type: 'SET_ALARM_CONDITION',
      payload: {
        condition,
        index,
      },
    };

    expect(setAlarmCondition(condition, index)).toEqual(expectedAction);
  });

  test('should create an action to set an alarm period scope', () => {
    const index = 0;
    const periodScope = 'last_x_days';

    const expectedAction = {
      type: 'SET_ALARM_PERIOD_SCOPE',
      payload: {
        periodScope,
        index,
      },
    };

    expect(setAlarmPeriodScope(periodScope, index)).toEqual(expectedAction);
  });

  test('should create an action to set an alarm period length', () => {
    const index = 0;
    const periodLength = 7;

    const expectedAction = {
      type: 'SET_ALARM_PERIOD_LENGTH',
      payload: {
        periodLength,
        index,
      },
    };

    expect(setAlarmPeriodLength(periodLength, index)).toEqual(expectedAction);
  });

  test('should create an action to set an alarm type', () => {
    const index = 0;
    const alarmType = 'numeric';

    const expectedAction = {
      type: 'SET_ALARM_TYPE',
      payload: {
        alarmType,
        index,
      },
    };

    expect(setAlarmType(alarmType, index)).toEqual(expectedAction);
  });

  test('should create an action to set an alarm calculation', () => {
    const index = 0;
    const calculation = 'mean';

    const expectedAction = {
      type: 'SET_ALARM_CALCULATION',
      payload: {
        calculation,
        index,
      },
    };

    expect(setAlarmCalculation(calculation, index)).toEqual(expectedAction);
  });

  test('should create an action to set an alarm percentage', () => {
    const index = 0;
    const percentage = '44';

    const expectedAction = {
      type: 'SET_ALARM_PERCENTAGE',
      payload: {
        percentage,
        index,
      },
    };

    expect(setAlarmPercentage(percentage, index)).toEqual(expectedAction);
  });

  test('should create an action to set an alarm value', () => {
    const index = 0;
    const value = 3;

    const expectedAction = {
      type: 'SET_ALARM_VALUE',
      payload: {
        value,
        index,
      },
    };

    expect(setAlarmValue(value, index)).toEqual(expectedAction);
  });

  test('should create an action to show the confirm feedback message', () => {
    const expectedAction = {
      type: 'SHOW_CONFIRM_FEEDBACK_MESSAGE',
    };

    expect(showConfirmFeedbackMessage()).toEqual(expectedAction);
  });

  test('should create an action to show the close feedback message', () => {
    const expectedAction = {
      type: 'CLOSE_FEEDBACK_MESSAGE',
    };

    expect(closeFeedbackMessage()).toEqual(expectedAction);
  });

  test('creates an action to set the alarm colour', () => {
    const colour = 'colour';
    const index = 0;

    const expectedAction = {
      type: 'SET_ALARM_COLOUR',
      payload: {
        colour,
        index,
      },
    };

    expect(setAlarmColour(colour, index)).toEqual(expectedAction);
  });

  test('creates an action to update show alarm on mobile', () => {
    const alarmPosition = 1;
    const showOnMobile = true;

    const expectedAction = {
      type: 'UPDATE_SHOW_ALARM_ON_MOBILE',
      payload: {
        index: alarmPosition,
        showOnMobile,
      },
    };

    expect(updateShowAlarmOnMobile(alarmPosition, showOnMobile)).toEqual(
      expectedAction
    );
  });

  test('creates an action to toggle select all alarms on mobile', () => {
    const alarmIdsWithShowOnMobile = ['123', '456'];

    const expectedAction = {
      type: 'TOGGLE_SELECT_ALL_FOR_MOBILE',
      payload: {
        alarmIdsWithShowOnMobile,
      },
    };

    expect(toggleSelectAllForMobile(alarmIdsWithShowOnMobile)).toEqual(
      expectedAction
    );
  });

  test('creates an action to search squad', () => {
    const searchTerm = 'test';
    const alarmId = uuid.v4();

    const expectedAction = {
      type: 'ALARM_SEARCH_APPLIES_TO',
      payload: {
        searchTerm,
        alarmId,
      },
    };

    expect(alarmSquadSearch(searchTerm, alarmId)).toEqual(expectedAction);
  });
});

describe('Toggle Dashboard Filters Actions', () => {
  test('has the correct action TOGGLE_DASHBOARD_FILTERS', () => {
    const expectedAction = {
      type: 'TOGGLE_DASHBOARD_FILTERS',
      payload: {
        isFilterShown: true,
      },
    };

    expect(toggleDashboardFilters(true)).toEqual(expectedAction);
  });
});

describe('Update Dashboard Filters Actions', () => {
  test('has the correct action UPDATE_FILTER_OPTIONS', () => {
    const expectedAction = {
      type: 'UPDATE_FILTER_OPTIONS',
      payload: {
        groupBy: 'position',
        alarmFilters: ['inAlarm', 'noAlarms'],
        athleteFilters: ['Test Athlete', 'Wing', 'Forward'],
        availabilityFilters: [],
      },
    };

    expect(
      updateFilterOptions(
        'position',
        ['inAlarm', 'noAlarms'],
        ['Test Athlete', 'Wing', 'Forward'],
        []
      )
    ).toEqual(expectedAction);
  });
});

describe('Update Sort Order Actions', () => {
  test('has the correct action UPDATE_SORT', () => {
    const expectedAction = {
      type: 'UPDATE_SORT',
      payload: {
        sortOrder: 'high_to_low',
        statusId: 'status_1234',
        statusKey: 'kitman:tv|sleep_duration',
      },
    };

    expect(
      updateSort('high_to_low', 'status_1234', 'kitman:tv|sleep_duration')
    ).toEqual(expectedAction);
  });
});

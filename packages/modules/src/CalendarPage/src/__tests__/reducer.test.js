import { calendarPage, appStatus, eventsPanel, eventTooltip } from '../reducer';

describe('Calendar Page reducer', () => {
  const sampleEvent = {
    backgroundColor: '#843b32',
    borderColor: '#843b32',
    id: '413272',
    start: '2020-09-08T00:00:00+01:00',
    title: 'Fitbit - Monitoring',
    type: 'TRAINING_SESSION',
    url: '/workloads/training_sessions/413272',
  };

  const sampleEventList = [
    { ...sampleEvent },
    { ...sampleEvent, id: '123' },
    { ...sampleEvent, id: '567' },
  ];

  const defaultState = {
    events: [],
    calendarDates: {
      startDate: '2020-10-26T00:00:00+00:00',
      endDate: '2020-12-07T00:00:00+00:00',
    },
    calendarFilters: {
      squadSessionsFilter: true,
      individualSessionsFilter: true,
      gamesFilter: true,
      treatmentsFilter: true,
      rehabFilter: true,
      customEventsFilter: true,
    },
    gameModal: {
      isOpen: false,
    },
    sessionModal: {
      isOpen: false,
    },
    customEventModal: {
      isOpen: false,
    },
  };

  it('returns correct state on UPDATE_CALENDAR_EVENTS', () => {
    const action = {
      type: 'UPDATE_CALENDAR_EVENTS',
      payload: { events: sampleEventList },
    };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.events).toEqual(sampleEventList);
  });

  it('returns correct state on UPDATE_CALENDAR_EVENTS when there is `theme.name` in an event', () => {
    const mapWithTheme = (events) =>
      events.map((event) => ({
        ...event,
        theme: { name: 'theme_name' },
      }));

    const initialState = {
      ...defaultState,
    };

    const action = {
      type: 'UPDATE_CALENDAR_EVENTS',
      payload: {
        events: mapWithTheme(sampleEventList),
      },
    };

    const nextState = calendarPage(initialState, action);

    expect(nextState).toEqual({
      ...initialState,
      events: mapWithTheme(sampleEventList),
    });
  });

  it('returns correct state on ADD_CALENDAR_EVENT', () => {
    const eventNew = { ...sampleEvent, id: '999' };
    const action = { type: 'ADD_CALENDAR_EVENT', payload: { event: eventNew } };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.events).toEqual([eventNew]);
  });

  it('returns correct state on ADD_CALENDAR_EVENT when there is `theme.name` in an event', () => {
    const eventA = {
      ...sampleEvent,
      id: 1,
      incompleteEvent: false,
    };

    const initialState = {
      ...defaultState,
      events: [eventA],
    };

    const eventNew = {
      ...sampleEvent,
      id: '999',
      theme: {
        name: 'theme name',
      },
    };

    const expectedState = {
      ...defaultState,
      events: [eventA, eventNew],
    };

    const action = {
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        event: eventNew,
      },
    };

    const nextState = calendarPage(initialState, action);

    expect(nextState).toEqual(expectedState);
  });

  it('returns correct state on REMOVE_INCOMPLETE_EVENTS', () => {
    const incompleteEvent = {
      ...sampleEvent,
      id: '999',
      incompleteEvent: true,
    };
    const completeEvent = { ...sampleEvent, id: '1' };
    const initialState = {
      ...defaultState,
      events: [incompleteEvent, completeEvent],
    };
    const action = { type: 'REMOVE_INCOMPLETE_EVENTS' };
    const nextState = calendarPage(initialState, action);
    expect(nextState.events).toEqual([completeEvent]);
  });

  it('returns correct state on UPDATE_CALENDAR_FILTERS', () => {
    const action = {
      type: 'UPDATE_CALENDAR_FILTERS',
      payload: { checkbox: { id: 'squadSessionsFilter', checked: false } },
    };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.calendarFilters.squadSessionsFilter).toBe(false);
  });

  it('returns correct state on ON_DATES_RENDER', () => {
    const action = {
      type: 'ON_DATES_RENDER',
      payload: {
        viewInfo: {
          view: {
            activeStart: '2020-11-30T00:00:00.000Z',
            activeEnd: '2021-01-11T00:00:00.000Z',
          },
        },
      },
    };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.calendarDates.startDate).toBe('2020-11-30T00:00:00+00:00');
    expect(nextState.calendarDates.endDate).toBe('2021-01-11T00:00:00+00:00');
  });

  it('returns correct state on ON_VIEW_CHANGE', () => {
    const action = {
      type: 'ON_VIEW_CHANGE',
      payload: { viewInfo: { view: { type: 'dayGridMonth' } } },
    };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.currentView).toBe('dayGridMonth');
  });

  it('returns correct state on OPEN_GAME_MODAL', () => {
    const action = { type: 'OPEN_GAME_MODAL' };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.gameModal.isOpen).toBe(true);
  });

  it('returns correct state on CLOSE_GAME_MODAL', () => {
    const initialState = { ...defaultState, gameModal: { isOpen: true } };
    const action = { type: 'CLOSE_GAME_MODAL' };
    const nextState = calendarPage(initialState, action);
    expect(nextState.gameModal.isOpen).toBe(false);
  });

  it('returns correct state on OPEN_SESSION_MODAL', () => {
    const action = { type: 'OPEN_SESSION_MODAL' };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.sessionModal.isOpen).toBe(true);
  });

  it('returns correct state on CLOSE_SESSION_MODAL', () => {
    const initialState = { ...defaultState, sessionModal: { isOpen: true } };
    const action = { type: 'CLOSE_SESSION_MODAL' };
    const nextState = calendarPage(initialState, action);
    expect(nextState.sessionModal.isOpen).toBe(false);
  });

  it('returns correct state on OPEN_CUSTOM_EVENT_MODAL', () => {
    const action = { type: 'OPEN_CUSTOM_EVENT_MODAL' };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.customEventModal.isOpen).toBe(true);
  });

  it('returns correct state on CLOSE_CUSTOM_EVENT_MODAL', () => {
    const initialState = {
      ...defaultState,
      customEventModal: { isOpen: true },
    };
    const action = { type: 'CLOSE_CUSTOM_EVENT_MODAL' };
    const nextState = calendarPage(initialState, action);
    expect(nextState.customEventModal.isOpen).toBe(false);
  });

  it('returns correct state on UPDATE_SQUAD_SELECTION', () => {
    const squadSelection = { athletes: ['33196'] };
    const action = {
      type: 'UPDATE_SQUAD_SELECTION',
      payload: { squadSelection },
    };
    const nextState = calendarPage(defaultState, action);
    expect(nextState.squadSelection).toEqual({
      ...squadSelection,
      applies_to_squad: false,
    });
  });
});

describe('Calendar - appStatus reducer', () => {
  const initialState = { status: null, message: null };

  it('returns correct state on SET_CALENDAR_LOADING', () => {
    const action = {
      type: 'SET_CALENDAR_LOADING',
      payload: { isLoading: true },
    };
    expect(appStatus(initialState, action)).toEqual({ status: 'loading' });
  });

  it('returns correct state on SERVER_REQUEST', () => {
    const action = { type: 'SERVER_REQUEST' };
    expect(appStatus(initialState, action)).toEqual({ status: 'loading' });
  });

  it('returns correct state on SERVER_REQUEST_ERROR', () => {
    const action = { type: 'SERVER_REQUEST_ERROR' };
    expect(appStatus(initialState, action)).toEqual({ status: 'error' });
  });

  it('returns correct state on SERVER_REQUEST_SUCCESS', () => {
    const action = { type: 'SERVER_REQUEST_SUCCESS' };
    expect(appStatus(initialState, action)).toEqual({ status: 'success' });
  });

  it('returns correct state on CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS', () => {
    const action = { type: 'CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS' };
    expect(appStatus(initialState, action)).toEqual({ status: 'success' });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const action = { type: 'HIDE_APP_STATUS' };
    expect(appStatus(initialState, action)).toEqual({
      status: null,
      message: null,
    });
  });

  it('returns correct state on CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN', () => {
    const action = { type: 'CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN' };
    expect(appStatus(initialState, action)).toEqual({
      status: 'loading',
      message: 'Saving',
    });
  });

  it('returns correct state on CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE', () => {
    const action = { type: 'CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE' };
    expect(appStatus(initialState, action)).toEqual({
      status: 'error',
      message: null,
    });
  });

  it('returns correct state on FETCH_EVENT_LOADING', () => {
    const action = { type: 'FETCH_EVENT_LOADING' };
    expect(appStatus(initialState, action)).toEqual({
      status: 'loading',
      message: 'Loading...',
    });
  });

  it('returns correct state on FETCH_EVENT_ERROR', () => {
    const action = { type: 'FETCH_EVENT_ERROR' };
    expect(appStatus(initialState, action)).toEqual({
      status: 'error',
      message: null,
    });
  });

  it('returns correct state on FETCH_EVENT_SUCCESS', () => {
    const action = { type: 'FETCH_EVENT_SUCCESS' };
    expect(appStatus(initialState, action)).toEqual({
      status: null,
      message: null,
    });
  });
});

describe('Calendar - eventsPanel reducer', () => {
  const defaultState = { isOpen: false, mode: 'VIEW_TEMPLATES', event: null };

  it('returns correct state on OPEN_CALENDAR_EVENTS_PANEL', () => {
    const action = { type: 'OPEN_CALENDAR_EVENTS_PANEL' };
    expect(eventsPanel(defaultState, action)).toEqual({
      ...defaultState,
      isOpen: true,
    });
  });

  it('returns correct state on CLOSE_CALENDAR_EVENTS_PANEL', () => {
    const initialState = { ...defaultState, isOpen: true };
    const action = { type: 'CLOSE_CALENDAR_EVENTS_PANEL' };
    expect(eventsPanel(initialState, action)).toEqual({
      ...defaultState,
      isOpen: false,
    });
  });

  it('returns correct state on EDIT_CALENDAR_EVENT_DETAILS with CREATE mode', () => {
    const event = { type: 'game_event', title: 'Test Event' };
    const action = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: { event, mode: 'CREATE' },
    };
    expect(eventsPanel(defaultState, action)).toEqual({
      ...defaultState,
      isOpen: true,
      mode: 'CREATE',
      event,
    });
  });

  it('returns correct state on EDIT_CALENDAR_EVENT_DETAILS with DUPLICATE mode', () => {
    const event = { type: 'session_event', title: 'Test Event' };
    const action = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: { event, mode: 'DUPLICATE' },
    };
    expect(eventsPanel(defaultState, action)).toEqual({
      ...defaultState,
      isOpen: true,
      mode: 'DUPLICATE',
      event,
    });
  });

  it('returns correct state on EDIT_CALENDAR_EVENT_DETAILS with EDIT mode', () => {
    const event = { type: 'custom_event', title: 'Test Event' };
    const action = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: { event, mode: 'EDIT' },
    };
    expect(eventsPanel(defaultState, action)).toEqual({
      ...defaultState,
      isOpen: true,
      mode: 'EDIT',
      event,
    });
  });
});

describe('Calendar - eventTooltip reducer', () => {
  const defaultState = { active: true, calendarEvent: null, element: null };

  it('returns correct state on DISPLAY_EVENT_TOOLTIP', () => {
    const calendarEvent = { id: 1 };
    const element = { id: 'el' };
    const action = {
      type: 'DISPLAY_EVENT_TOOLTIP',
      payload: { calendarEvent, element },
    };
    expect(eventTooltip(defaultState, action)).toEqual({
      ...defaultState,
      active: true,
      calendarEvent,
      element,
    });
  });

  it('returns correct state on HIDE_EVENT_TOOLTIP', () => {
    const initialState = { active: true, calendarEvent: {}, element: {} };
    const action = { type: 'HIDE_EVENT_TOOLTIP' };
    expect(eventTooltip(initialState, action)).toEqual({
      active: false,
      calendarEvent: null,
      element: null,
    });
  });
});

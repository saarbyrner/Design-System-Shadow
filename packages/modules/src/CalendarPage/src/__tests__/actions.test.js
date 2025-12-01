import $ from 'jquery';
import moment from 'moment-timezone';
import { mockData as ipEventsMock } from '@kitman/services/src/mocks/handlers/getEvents';
import { mockData as tsoEventsMock } from '@kitman/services/src/mocks/handlers/getTSOEvents';
import { rest, server } from '@kitman/services/src/mocks/server';
import getEvents from '@kitman/services/src/services/getEvents';
import getTSOEvents from '@kitman/services/src/services/getTSOEvents';
import { waitFor } from '@testing-library/react';
import { data as eventData } from '@kitman/services/src/mocks/handlers/planningHub/getEvent';
import { axios } from '@kitman/common/src/utils/services';
import {
  updateCalendarEvents,
  fetchCalendarEvents,
  setCalendarLoading,
  updateCalendarFilters,
  onViewChange,
  openGameModal,
  closeGameModal,
  openSessionModal,
  closeSessionModal,
  onDatesRender,
  hideAppStatus,
  updateSquadSelection,
  editEventDetails,
  handleEventReceive,
  handleEventResize,
  handleEventDrop,
  handleEventSelect,
  handleEventClick,
  createOrUpdateEventRequestBegin,
  createOrUpdateEventRequestSuccess,
  createOrUpdateEventRequestFailure,
  addCalendarEvent,
  removeIncompleteEvents,
  fetchEventError,
  fetchEventSuccess,
  fetchEventLoading,
  openCustomEventModal,
  closeCustomEventModal,
  deleteEventDetails,
  deleteEvent,
  fetchEvent,
} from '../actions';
import {
  hideEventTooltip,
  displayEventTooltip,
} from '../components/EventTooltip/actions';
import { emptyRecurrence } from '../utils/eventUtils';

jest.mock('@kitman/services/src/services/getEvents');
jest.mock('@kitman/services/src/services/getTSOEvents');

describe('Calendar Page Actions', () => {
  const sampleEvent = {
    backgroundColor: '#843b32',
    borderColor: '#843b32',
    id: 413272,
    start: '2020-09-08T00:00:00+01:00',
    title: 'Fitbit - Monitoring',
    type: 'TRAINING_SESSION',
    url: '/workloads/training_sessions/413272',
  };

  const sampleEventList = [
    { ...sampleEvent },
    { ...sampleEvent, id: 123 },
    { ...sampleEvent, id: 567 },
  ];

  it('has the correct action UPDATE_CALENDAR_EVENTS', () => {
    const expectedAction = {
      type: 'UPDATE_CALENDAR_EVENTS',
      payload: {
        events: [...sampleEventList],
      },
    };

    expect(updateCalendarEvents([...sampleEventList])).toEqual(expectedAction);
  });

  it('has the correct action ADD_CALENDAR_EVENT', () => {
    const event = { ...sampleEvent, id: 123 };
    const expectedAction = {
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        event,
      },
    };

    expect(addCalendarEvent(event)).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_INCOMPLETE_EVENTS', () => {
    const expectedAction = {
      type: 'REMOVE_INCOMPLETE_EVENTS',
    };

    expect(removeIncompleteEvents()).toEqual(expectedAction);
  });

  it('has the correct action SET_CALENDAR_LOADING', () => {
    const expectedAction = {
      type: 'SET_CALENDAR_LOADING',
      payload: {
        isLoading: true,
      },
    };

    expect(setCalendarLoading(true)).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_CALENDAR_FILTERS', () => {
    const expectedAction = {
      type: 'UPDATE_CALENDAR_FILTERS',
      payload: {
        checkbox: { checked: true, id: 'squadSessionsFilter' },
      },
    };

    expect(
      updateCalendarFilters({ checked: true, id: 'squadSessionsFilter' })
    ).toEqual(expectedAction);
  });

  it('has the correct action ON_VIEW_CHANGE', () => {
    const expectedAction = {
      type: 'ON_VIEW_CHANGE',
      payload: {
        viewInfo: { view: { type: 'dayGridView' } },
      },
    };

    expect(onViewChange({ view: { type: 'dayGridView' } })).toEqual(
      expectedAction
    );
  });

  it('has the correct action ON_DATES_RENDER', () => {
    const expectedAction = {
      type: 'ON_DATES_RENDER',
      payload: {
        viewInfo: {
          view: {
            activeStart: '2020-10-26T00:00:00+00:00',
            activeEnd: '2020-12-07T00:00:00+00:00',
          },
        },
      },
    };

    expect(
      onDatesRender({
        view: {
          activeStart: '2020-10-26T00:00:00+00:00',
          activeEnd: '2020-12-07T00:00:00+00:00',
        },
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action OPEN_GAME_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_GAME_MODAL',
    };

    expect(openGameModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_GAME_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_GAME_MODAL',
    };

    expect(closeGameModal()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_SESSION_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_SESSION_MODAL',
    };

    expect(openSessionModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_SESSION_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_SESSION_MODAL',
    };

    expect(closeSessionModal()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_CUSTOM_EVENT_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_CUSTOM_EVENT_MODAL',
    };

    expect(openCustomEventModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_CUSTOM_EVENT_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_CUSTOM_EVENT_MODAL',
    };

    expect(closeCustomEventModal()).toEqual(expectedAction);
  });

  it('has the correct action DELETE_EVENT_DETAILS', () => {
    const expectedAction = {
      type: 'DELETE_EVENT_DETAILS',
      payload: {
        event: undefined,
      },
    };

    expect(deleteEventDetails()).toEqual(expectedAction);
  });

  it('has the correct action UPDATE_SQUAD_SELECTION', () => {
    const expectedAction = {
      type: 'UPDATE_SQUAD_SELECTION',
      payload: {
        squadSelection: {
          applies_to_squad: false,
          position_groups: [],
          positions: [],
          athletes: ['33196', '33197', '15642'],
          all_squads: false,
          squads: [],
        },
      },
    };

    expect(
      updateSquadSelection({
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: ['33196', '33197', '15642'],
        all_squads: false,
        squads: [],
      })
    ).toEqual(expectedAction);
  });

  describe('when fetching events', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the request is successful', () => {
      it('calls the action FETCH_CALENDAR_EVENTS_SUCCESS', async () => {
        const state = {
          calendarPage: {
            events: [],
            calendarFilters: {
              squadSessionsFilter: true,
              individualSessionsFilter: true,
              gamesFilter: true,
              treatmentsFilter: true,
              rehabFilter: true,
            },
          },
        };

        const getState = jest.fn();
        getState.mockReturnValue(state);

        await getEvents.mockResolvedValue(ipEventsMock);
        await getTSOEvents.mockResolvedValue(tsoEventsMock);

        const thunk = fetchCalendarEvents(
          'abcd',
          '2020-09-07T23:00:00Z',
          '2020-10-20T22:59:59Z'
        );
        const dispatcher = jest.fn();
        thunk(dispatcher, getState);

        await waitFor(() => {
          expect(dispatcher).toHaveBeenNthCalledWith(3, {
            type: 'FETCH_CALENDAR_EVENTS_SUCCESS',
          });
        });
      });
    });

    describe('when NOT ALL requests are unsuccessful', () => {
      it('calls the action FETCH_CALENDAR_EVENTS_SUCCESS', async () => {
        const state = {
          calendarPage: {
            events: [],
            calendarFilters: {
              squadSessionsFilter: true,
              individualSessionsFilter: true,
              gamesFilter: true,
              treatmentsFilter: true,
              rehabFilter: true,
            },
          },
        };

        const getState = jest.fn();
        getState.mockReturnValue(state);

        getTSOEvents.mockRejectedValue('whoops');

        const thunk = fetchCalendarEvents(
          'abcd',
          '2020-09-07T23:00:00Z',
          '2020-10-20T22:59:59Z'
        );
        const dispatcher = jest.fn();
        thunk(dispatcher, getState);

        await waitFor(() => {
          expect(dispatcher).toHaveBeenNthCalledWith(3, {
            type: 'FETCH_CALENDAR_EVENTS_SUCCESS',
          });
        });
      });
    });

    describe('when ALL requests are unsuccessful', () => {
      it('calls the action FETCH_CALENDAR_EVENTS_ERROR', async () => {
        const state = {
          calendarPage: {
            events: [],
            calendarFilters: {
              squadSessionsFilter: true,
              individualSessionsFilter: true,
              gamesFilter: true,
              treatmentsFilter: true,
              rehabFilter: true,
            },
          },
        };

        const getState = jest.fn();
        getState.mockReturnValue(state);

        getEvents.mockRejectedValue('whoops');
        getTSOEvents.mockRejectedValue('whoops');

        const thunk = fetchCalendarEvents(
          'abcd',
          '2020-09-07T23:00:00Z',
          '2020-10-20T22:59:59Z'
        );
        const dispatcher = jest.fn();
        thunk(dispatcher, getState);

        await waitFor(() => {
          expect(dispatcher).toHaveBeenNthCalledWith(2, {
            type: 'FETCH_CALENDAR_EVENTS_ERROR',
          });
        });
      });
    });
  });

  describe('when deleting an event', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      window.featureFlags = {};
    });

    it('calls endpoint without recurrence parameters, if event is non-recurring', async () => {
      const spy = jest.spyOn(axios, 'delete');

      const state = {
        calendarPage: {
          events: [],
          calendarFilters: {
            squadSessionsFilter: true,
            individualSessionsFilter: true,
            gamesFilter: true,
            treatmentsFilter: true,
            rehabFilter: true,
          },
          calendarDates: {
            startData: null,
          },
        },
      };

      const getState = jest.fn();
      getState.mockReturnValue(state);

      const thunk = deleteEvent(ipEventsMock[0], 'next');
      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(
          `/planning_hub/events/${ipEventsMock[0].id}`,
          { params: undefined }
        );
      });
    });

    it(
      'calls endpoint with recurrence parameters, if event is recurring and' +
        ' ‘custom-events’ and ‘repeat-events’ feature flags are on',
      async () => {
        window.featureFlags['custom-events'] = true;
        window.featureFlags['repeat-events'] = true;
        const spy = jest.spyOn(axios, 'delete');
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';

        const mockRepeatEvent = {
          ...ipEventsMock[0],
          recurrence: {
            rule,
            recurring_event_id: 1,
            original_start_time: '2024-03-19T08:00:00Z',
          },
          type: 'custom_event',
        };

        const scope = 'next';

        const state = {
          calendarPage: {
            events: [],
            calendarFilters: {
              squadSessionsFilter: true,
              individualSessionsFilter: true,
              gamesFilter: true,
              treatmentsFilter: true,
              rehabFilter: true,
            },
            calendarDates: {
              startData: null,
            },
          },
        };

        const getState = jest.fn();
        getState.mockReturnValue(state);

        const thunk = deleteEvent(mockRepeatEvent, scope);
        const dispatcher = jest.fn();
        thunk(dispatcher, getState);

        await waitFor(() => {
          expect(spy).toHaveBeenCalledWith(
            `/planning_hub/events/${mockRepeatEvent.id}`,
            {
              params: {
                recurring_event_id:
                  mockRepeatEvent.recurrence.recurring_event_id,
                original_start_time: '2024-03-19T08:00:00Z',
                scope,
              },
            }
          );
        });
      }
    );

    it(
      'calls endpoint without recurrence parameters, if event is non-recurring and' +
        ' ‘custom-events’ and ‘repeat-events’ feature flags are off',
      async () => {
        const spy = jest.spyOn(axios, 'delete');
        const rule = 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY';

        const mockRepeatEvent = {
          ...ipEventsMock[0],
          recurrence: {
            rule,
            recurring_event_id: 1,
            original_start_time: '2024-03-19T08:00:00Z',
          },
          type: 'custom_event',
        };

        const scope = 'next';

        const state = {
          calendarPage: {
            events: [],
            calendarFilters: {
              squadSessionsFilter: true,
              individualSessionsFilter: true,
              gamesFilter: true,
              treatmentsFilter: true,
              rehabFilter: true,
            },
            calendarDates: {
              startData: null,
            },
          },
        };

        const getState = jest.fn();
        getState.mockReturnValue(state);

        const thunk = deleteEvent(mockRepeatEvent, scope);
        const dispatcher = jest.fn();
        thunk(dispatcher, getState);

        await waitFor(() => {
          expect(spy).toHaveBeenCalledWith(
            `/planning_hub/events/${mockRepeatEvent.id}`,
            { params: undefined }
          );
        });
      }
    );
  });

  describe('fetchEvent', () => {
    const gameEvent = {
      ...eventData.event,
      id: 1,
      type: 'game_event',
    };

    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/1', (req, res, ctx) =>
          res(ctx.json({ event: gameEvent }))
        )
      );
    });

    it('retrieves the event periods related to a game event on success', async () => {
      const ajaxSpy = jest.spyOn($, 'ajax');

      const state = {
        calendarPage: {
          events: [],
        },
      };

      const getState = jest.fn();
      getState.mockReturnValue(state);

      const thunk = fetchEvent({
        calendarEventId: gameEvent.id,
        isDuplicate: false,
        shouldOpenEditEventSidePanel: true,
        startTime: 0,
      });

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      await waitFor(() => {
        expect(ajaxSpy).toHaveBeenCalledWith({
          contentType: 'application/json',
          dataType: 'json',
          method: 'GET',
          url: '/planning_hub/events/1',
        });
      });

      await waitFor(() => {
        expect(ajaxSpy).toHaveBeenCalledWith({
          contentType: 'application/json',
          method: 'GET',
          url: '/ui/planning_hub/events/1/game_periods',
        });
      });

      await waitFor(() => {
        expect(dispatcher).toHaveBeenCalledWith({
          type: 'eventPeriods/setSavedEventPeriods',
          payload: [
            {
              id: 1,
              absolute_duration_start: 0,
              absolute_duration_end: 90,
              duration: 90,
            },
          ],
        });
      });
    });

    it('should dispatch the correct recurrence object when isDuplicate is true', async () => {
      const state = {
        calendarPage: {
          events: [],
        },
      };

      const getState = jest.fn();
      getState.mockReturnValue(state);

      const thunk = fetchEvent({
        calendarEventId: gameEvent.id,
        isDuplicate: true,
        shouldOpenEditEventSidePanel: true,
        startTime: 0,
      });

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      await waitFor(() => {
        expect(dispatcher).toHaveBeenNthCalledWith(5, {
          type: 'EDIT_CALENDAR_EVENT_DETAILS',
          payload: {
            event: expect.objectContaining({
              recurrence: emptyRecurrence,
            }),
            mode: 'DUPLICATE',
          },
        });
      });
    });
  });
});

describe('Calendar EventTooltip Actions', () => {
  it('has the correct action hideEventTooltip', () => {
    const expectedAction = {
      type: 'HIDE_EVENT_TOOLTIP',
    };

    expect(hideEventTooltip()).toEqual(expectedAction);
  });

  it('has the correct action DISPLAY_EVENT_TOOLTIP', () => {
    const expectedAction = {
      type: 'DISPLAY_EVENT_TOOLTIP',
      payload: {
        calendarEvent: { testing: 1 },
        element: { testing: 2 },
      },
    };

    expect(displayEventTooltip({ testing: 1 }, { testing: 2 })).toEqual(
      expectedAction
    );
  });
});

describe('Calendar Interaction Actions', () => {
  beforeEach(() => {
    const fakeTime = new Date('2022-06-10T09:12:00Z'); // UTC FORMAT
    jest.useFakeTimers(fakeTime.getTime());
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.restoreAllMocks();
  });

  it('has the correct action FETCH_EVENT_SUCCESS', () => {
    const expectedAction = {
      type: 'FETCH_EVENT_SUCCESS',
    };

    expect(fetchEventSuccess()).toEqual(expectedAction);
  });

  it('has the correct action FETCH_EVENT_ERROR', () => {
    const expectedAction = {
      type: 'FETCH_EVENT_ERROR',
    };

    expect(fetchEventError()).toEqual(expectedAction);
  });

  it('has the correct action FETCH_EVENT_LOADING', () => {
    const expectedAction = {
      type: 'FETCH_EVENT_LOADING',
    };

    expect(fetchEventLoading()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_CALENDAR_EVENT_DETAILS with mode', () => {
    const event = {
      allDay: false,
      type: 'UNKNOWN',
      templateId: 'template_01',
      title: 'Test event',
    };

    const expectedAction = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: {
        event,
        mode: 'EDIT',
      },
    };

    expect(editEventDetails(event, 'EDIT')).toEqual(expectedAction);
  });

  it('has the correct action EDIT_CALENDAR_EVENT_DETAILS', () => {
    const event = {
      allDay: false,
      type: 'UNKNOWN',
      templateId: 'template_01',
      name: 'Test event',
    };

    const expectedAction = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: {
        event,
        mode: undefined,
      },
    };

    expect(editEventDetails(event)).toEqual(expectedAction);
  });

  it('calls the correct actions including EDIT_CALENDAR_EVENT_DETAILS on handleEventReceive', () => {
    const fullCalEvent = {
      allDay: false,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 30,
      },
      start: '2021-07-12T10:00:16.000Z',
      end: '2021-07-12T10:30:16.000Z',
      setProp: jest.fn(),
      remove: jest.fn(),
    };

    const expectedEventPayload = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: {
        event: {
          allDay: false,
          templateId: 'template_01',
          defaultStartTime: '09:30:00',
          defaultDurationMins: 30,
          background_color: 'rgba(182, 201, 212, 0.3)',
          border_color: '#afb7c4',
          calendarEventId: undefined,
          duration: 30,
          start_date: '2021-07-12T10:00:16+00:00',
          local_timezone: 'Europe/Dublin',
          name: 'Test event',
          text_color: '#5f7089',
          type: 'game_event',
        },
        mode: 'CREATE',
      },
    };

    const state = {
      calendarPage: {
        currentView: 'timeGridWeek',
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);
    const thunk = handleEventReceive({ event: fullCalEvent }, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);

    expect(fullCalEvent.setProp).toHaveBeenCalled();
    expect(fullCalEvent.remove).toHaveBeenCalled();
    expect(dispatcher).toHaveBeenNthCalledWith(1, {
      type: 'REMOVE_INCOMPLETE_EVENTS',
    });
    expect(dispatcher).toHaveBeenNthCalledWith(2, {
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        event: {
          backgroundColor: 'rgba(182, 201, 212, 0.3)',
          borderColor: '#afb7c4',
          textColor: '#5f7089',
          id: undefined,
          start: '2021-07-12T10:00:16.000Z',
          end: '2021-07-12T10:30:16.000Z',
          title: 'Test event',
          url: '',
          type: 'GAME',
          incompleteEvent: true,
          editable: true,
          description: null,
          recurrence: { ...emptyRecurrence },
        },
      },
    });
    expect(dispatcher).toHaveBeenCalledWith(expectedEventPayload);
  });

  it('calls the correct actions including EDIT_CALENDAR_EVENT_DETAILS on handleEventReceive when on month view', () => {
    const fullCalEvent = {
      allDay: false,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 30,
      },
      start: '2021-07-12T10:00:16.000Z',
      end: '2021-07-12T10:30:16.000Z',
      setProp: jest.fn(),
      remove: jest.fn(),
    };

    const state = {
      calendarPage: {
        currentView: 'dayGridMonth',
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);
    const thunk = handleEventReceive({ event: fullCalEvent }, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);

    expect(fullCalEvent.setProp).toHaveBeenCalled();
    expect(fullCalEvent.remove).toHaveBeenCalled();
    expect(dispatcher).toHaveBeenNthCalledWith(1, {
      type: 'REMOVE_INCOMPLETE_EVENTS',
    });
    expect(dispatcher.mock.calls[1][0].type).toEqual('ADD_CALENDAR_EVENT');
    expect(dispatcher.mock.calls[2][0].type).toEqual(
      'EDIT_CALENDAR_EVENT_DETAILS'
    );
  });

  it('calls the correct actions including EDIT_CALENDAR_EVENT_DETAILS on handleEventDrop', () => {
    const fullCalEvent = {
      allDay: false,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 30,
      },
      start: '2021-07-12T10:00:16.000Z',
      end: '2021-07-12T10:30:16.000Z',
    };

    const expectedEventPayload = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: {
        event: {
          allDay: false,
          duration: 30,
          start_date: '2021-07-12T10:00:16+00:00',
        },
        mode: undefined,
      },
    };

    const state = {
      eventsPanel: {
        event: {},
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);
    const thunk = handleEventDrop({ event: fullCalEvent }, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);
    expect(dispatcher).toHaveBeenCalledWith(expectedEventPayload);
  });

  it('calls the correct actions including DISPLAY_EVENT_TOOLTIP on handleEventClick', async () => {
    const event = {
      extendedProps: {
        type: 'UNKNOWN',
      },
    };

    const thunk = handleEventClick({ event });
    const dispatcher = jest.fn();
    thunk(dispatcher);

    await waitFor(() => {
      expect(dispatcher.mock.calls[0][0].type).toEqual('DISPLAY_EVENT_TOOLTIP');
    });
  });

  it('calls the correct actions including EDIT_CALENDAR_EVENT_DETAILS on handleEventResize', () => {
    const fullCalEvent = {
      allDay: false,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 30,
      },
      start: '2021-07-12T10:00:16.000Z',
      end: '2021-07-12T10:30:16.000Z',
    };

    const expectedEventPayload = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: {
        event: {
          allDay: false,
          duration: 30,
          start_date: '2021-07-12T10:00:16+00:00',
        },
        mode: undefined,
      },
    };

    const state = {
      eventsPanel: {
        event: {},
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);

    const thunk = handleEventResize({ event: fullCalEvent }, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);
    expect(dispatcher).toHaveBeenCalledWith(expectedEventPayload);
  });

  it('calls the correct actions including ADD_CALENDAR_EVENT on handleEventSelect for a new event', () => {
    const start = new Date('2021-07-12T09:00:00+00:00');
    const end = new Date('2021-07-12T10:00:00+00:00');

    const selectionInfo = {
      start,
      end,
      startStr: moment(start).toISOString(),
      endStr: moment(end).toISOString(),
      allDay: false,
    };

    const state = {
      eventsPanel: {
        event: null,
      },
      eventTooltip: {
        active: false,
        calendarEvent: null,
        element: null,
      },
      calendarPage: {
        currentView: 'timeGridWeek',
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);

    const thunk = handleEventSelect(selectionInfo, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);

    expect(dispatcher).toHaveBeenNthCalledWith(1, {
      type: 'REMOVE_INCOMPLETE_EVENTS',
    });
    expect(dispatcher).toHaveBeenNthCalledWith(2, {
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        event: {
          backgroundColor: 'rgba(182, 201, 212, 0.3)',
          borderColor: '#afb7c4',
          textColor: '#5f7089',
          id: undefined,
          start: '2021-07-12T09:00:00.000Z',
          end: '2021-07-12T10:00:00.000Z',
          title: 'New event',
          url: '',
          type: 'UNKNOWN',
          incompleteEvent: true,
          editable: true,
          description: null,
          recurrence: { ...emptyRecurrence },
        },
      },
    });
  });

  it('calls the correct actions including ADD_CALENDAR_EVENT on handleEventSelect for a new event when on month view', () => {
    const start = new Date('2021-07-12T09:00:00+00:00');
    const end = new Date('2021-07-12T10:00:00+00:00');

    const selectionInfo = {
      start,
      end,
      startStr: moment(start).toISOString(),
      endStr: moment(end).toISOString(),
      allDay: false,
    };

    const state = {
      eventsPanel: {
        event: null,
      },
      eventTooltip: {
        active: false,
        calendarEvent: null,
        element: null,
      },
      calendarPage: {
        currentView: 'dayGridMonth',
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);

    const thunk = handleEventSelect(selectionInfo, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);

    expect(dispatcher).toHaveBeenNthCalledWith(1, {
      type: 'REMOVE_INCOMPLETE_EVENTS',
    });
    expect(dispatcher.mock.calls[1][0].type).toEqual('ADD_CALENDAR_EVENT');
  });

  it('calls the correct actions including ADD_CALENDAR_EVENT and EDIT_CALENDAR_EVENT_DETAILS on handleEventSelect for existing event', () => {
    const start = new Date('2021-07-12T09:00:00+00:00');
    const end = new Date('2021-07-12T10:00:00+00:00');

    const selectionInfo = {
      start,
      end,
      startStr: moment(start).toISOString(),
      endStr: moment(end).toISOString(),
      allDay: false,
    };

    const expectedEventPayload = {
      type: 'EDIT_CALENDAR_EVENT_DETAILS',
      payload: {
        event: {
          allDay: false,
          backgroundColor: 'rgba(182, 201, 212, 0.3)',
          borderColor: '#afb7c4',
          calendarEventId: '-1',
          duration: 60,
          start_date: '2021-07-12T09:00:00+00:00',
          textColor: '#5f7089',
          timeZone: 'Europe/Dublin',
          title: 'New event',
        },
        mode: undefined,
      },
    };

    const state = {
      eventsPanel: {
        event: {
          allDay: false,
          backgroundColor: 'rgba(182, 201, 212, 0.3)',
          borderColor: '#afb7c4',
          calendarEventId: '-1',
          duration: 100,
          start_date: '2020-07-10T07:00:00+00:00',
          textColor: '#5f7089',
          timeZone: 'Europe/Dublin',
          title: 'New event',
        },
        mode: 'EDIT',
      },
      eventTooltip: {
        active: false,
        calendarEvent: null,
        element: null,
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);

    const thunk = handleEventSelect(selectionInfo, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);

    expect(dispatcher).toHaveBeenNthCalledWith(2, {
      type: 'ADD_CALENDAR_EVENT',
      payload: {
        event: {
          backgroundColor: 'rgba(182, 201, 212, 0.3)',
          borderColor: '#afb7c4',
          textColor: '#5f7089',
          id: undefined,
          start: '2021-07-12T09:00:00.000Z',
          end: '2021-07-12T10:00:00.000Z',
          title: '',
          url: '',
          type: 'UNKNOWN',
          incompleteEvent: true,
          editable: true,
          description: null,
          recurrence: { ...emptyRecurrence },
        },
      },
    });
    expect(dispatcher).toHaveBeenNthCalledWith(3, expectedEventPayload);
  });

  it('calls the correct actions including HIDE_EVENT_TOOLTIP on handleEventSelect when tooltip active', () => {
    const start = new Date('2021-07-12T09:00:00+00:00');
    const end = new Date('2021-07-12T10:00:00+00:00');

    const selectionInfo = {
      start,
      end,
      startStr: moment(start).toISOString(),
      endStr: moment(end).toISOString(),
      allDay: false,
    };

    const state = {
      eventsPanel: {
        event: null,
      },
      eventTooltip: {
        active: true,
        calendarEvent: null,
        element: null,
      },
    };

    const getState = jest.fn();
    getState.mockReturnValue(state);

    const thunk = handleEventSelect(selectionInfo, 'Europe/Dublin');
    const dispatcher = jest.fn();
    thunk(dispatcher, getState);

    expect(dispatcher).toHaveBeenCalledWith({ type: 'HIDE_EVENT_TOOLTIP' });
  });

  it('has the correct action CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN', () => {
    const expectedAction = {
      type: 'CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN',
    };

    expect(createOrUpdateEventRequestBegin()).toEqual(expectedAction);
  });

  it('has the correct action CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS', () => {
    const expectedAction = {
      type: 'CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS',
    };

    expect(createOrUpdateEventRequestSuccess()).toEqual(expectedAction);
  });

  it('has the correct action CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE', () => {
    const expectedAction = {
      type: 'CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE',
    };

    expect(createOrUpdateEventRequestFailure()).toEqual(expectedAction);
  });
});

describe('Calendar AppStatus Actions', () => {
  it('has the correct action HIDE_APP_STATUS', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };

    expect(hideAppStatus()).toEqual(expectedAction);
  });
});

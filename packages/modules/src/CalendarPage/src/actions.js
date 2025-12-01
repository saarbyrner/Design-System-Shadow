// @flow
import $ from 'jquery';

import getTSOEvents from '@kitman/services/src/services/getTSOEvents';
import getIPEvents from '@kitman/services/src/services/getEvents';
import type {
  CalendarEventBeforeFullCalendar,
  CalendarEventTypeEnumLike,
} from '@kitman/components/src/Calendar/utils/types';
import type { Event } from '@kitman/common/src/types/Event';
import type {
  CheckboxItem,
  SquadAthletesSelection,
} from '@kitman/components/src/types';
import type { RecurrenceChangeScope } from '@kitman/modules/src/PlanningEventSidePanel/src/types';
import { getEventPeriods } from '@kitman/modules/src/PlanningEvent/src/services/eventPeriods';
import { setSavedEventPeriods } from '@kitman/modules/src/PlanningEvent/src/redux/slices/eventPeriodsSlice';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';
import deleteEventService from '@kitman/modules/src/PlanningHub/src/services/deleteEvent';
import { createPlanningEventUrl } from '@kitman/modules/src/CalendarPage/src/components/EventTooltip/utils/helpers';
import { emptyRecurrence } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';

import type { Action as EventTooltipAction } from './components/EventTooltip/types';
import type { Action, ThunkAction, SelectionInfo } from './types';
import type {
  Action as CalendarEventsPanelAction,
  CalendarBaseEvent,
} from './components/CalendarEventsPanel/types';
import {
  convertFullCalEvent,
  convertPlanningEventToCalendarEvent,
  convertTSOEventsToCalendarEvents,
  defaultBackgroundColor,
  defaultBorderColor,
  defaultTextColor,
  getDateWithCurrentTime,
  transformBeRecurrenceToFitFe,
  addEventRecurrencesForRepeatingEvents,
} from './utils/eventUtils';
import {
  displayEventTooltip,
  hideEventTooltip,
} from './components/EventTooltip/actions';

export const addCalendarEvent = (
  event: CalendarEventBeforeFullCalendar
): Action => ({
  type: 'ADD_CALENDAR_EVENT',
  payload: {
    event,
  },
});

export const updateCalendarEvents = (
  events: Array<CalendarEventBeforeFullCalendar>
): Action => ({
  type: 'UPDATE_CALENDAR_EVENTS',
  payload: {
    events,
  },
});

export const setCalendarLoading = (isLoading: boolean): Action => ({
  type: 'SET_CALENDAR_LOADING',
  payload: {
    isLoading,
  },
});

export const updateCalendarFilters = (checkbox: CheckboxItem): Action => ({
  type: 'UPDATE_CALENDAR_FILTERS',
  payload: {
    checkbox,
  },
});

export const editEventDetails = (
  event: Event | CalendarBaseEvent,
  mode?: 'EDIT' | 'CREATE' | 'DUPLICATE'
): Action => ({
  type: 'EDIT_CALENDAR_EVENT_DETAILS',
  payload: {
    event,
    mode,
  },
});

export const deleteEventDetails = (event: Event): Action => ({
  type: 'DELETE_EVENT_DETAILS',
  payload: {
    event,
  },
});

export const onViewChange = (viewInfo: Object): Action => ({
  type: 'ON_VIEW_CHANGE',
  payload: {
    viewInfo,
  },
});

export const onDatesRender = (viewInfo: Object): Action => ({
  type: 'ON_DATES_RENDER',
  payload: {
    viewInfo,
  },
});

export const openGameModal = (): Action => ({
  type: 'OPEN_GAME_MODAL',
});

export const closeGameModal = (): Action => ({
  type: 'CLOSE_GAME_MODAL',
});

export const openSessionModal = (): Action => ({
  type: 'OPEN_SESSION_MODAL',
});

export const closeSessionModal = (): Action => ({
  type: 'CLOSE_SESSION_MODAL',
});

export const openCustomEventModal = (): Action => ({
  type: 'OPEN_CUSTOM_EVENT_MODAL',
});

export const closeCustomEventModal = (): Action => ({
  type: 'CLOSE_CUSTOM_EVENT_MODAL',
});

export const fetchCalendarEventsError = (): Action => ({
  type: 'FETCH_CALENDAR_EVENTS_ERROR',
});

export const fetchCalendarEventsSuccess = (): Action => ({
  type: 'FETCH_CALENDAR_EVENTS_SUCCESS',
});

export const fetchCalendarEventsLoading = (): Action => ({
  type: 'FETCH_CALENDAR_EVENTS_LOADING',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const createOrUpdateEventRequestBegin = (): Action => ({
  type: 'CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN',
});

export const createOrUpdateEventRequestSuccess = (): Action => ({
  type: 'CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS',
});

export const createOrUpdateEventRequestFailure = (): Action => ({
  type: 'CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE',
});

export const fetchEventError = (): Action => ({
  type: 'FETCH_EVENT_ERROR',
});

export const fetchEventSuccess = (): Action => ({
  type: 'FETCH_EVENT_SUCCESS',
});

export const fetchEventLoading = (): Action => ({
  type: 'FETCH_EVENT_LOADING',
});

export const serverRequestError = (): Action => ({
  type: 'SERVER_REQUEST_ERROR',
});

/**
 * Called when a calendar event creation flow closed. So unsaved (incomplete) events removed from local calendar
 * @returns Action
 */
export const removeIncompleteEvents = (): Action => ({
  type: 'REMOVE_INCOMPLETE_EVENTS',
});

let ipEventsRequestController = null;
let tsoEventsRequestController = null;

export const fetchCalendarEvents =
  (token: string, startDate: string, endDate: string): ThunkAction =>
  async (dispatch: (action: Action) => Action, getState: Function) => {
    if (!startDate || !endDate) {
      return;
    }

    dispatch(fetchCalendarEventsLoading());

    // Abort requests if there is already an ongoing one
    if (ipEventsRequestController || tsoEventsRequestController) {
      if (ipEventsRequestController) ipEventsRequestController.abort();
      if (tsoEventsRequestController) tsoEventsRequestController.abort();
    }

    ipEventsRequestController = new AbortController();
    tsoEventsRequestController = new AbortController();

    Promise.allSettled([
      getIPEvents(
        getState(),
        startDate,
        endDate,
        ipEventsRequestController?.signal
      ),
      getTSOEvents(startDate, endDate, tsoEventsRequestController?.signal),
    ])
      .then((eventsResponse) => {
        const ipEventsResponse = eventsResponse[0];
        const tsoEventsResponse = eventsResponse[1];
        if (
          eventsResponse.every(
            (eventResponse) => eventResponse.status === 'rejected'
          )
        ) {
          dispatch(fetchCalendarEventsError());
        } else {
          const ipEvents =
            ipEventsResponse.status === 'fulfilled'
              ? addEventRecurrencesForRepeatingEvents(ipEventsResponse.value)
              : [];
          const mappedTSOEvents =
            tsoEventsResponse.status === 'fulfilled'
              ? convertTSOEventsToCalendarEvents(tsoEventsResponse.value)
              : [];

          dispatch(updateCalendarEvents([...ipEvents, ...mappedTSOEvents]));
          dispatch(fetchCalendarEventsSuccess());
          setTimeout(() => {
            dispatch(hideAppStatus());
          }, 1000);
        }
      })
      // Fallback for if promises don't settle for any reasons
      .catch(() => {
        dispatch(fetchCalendarEventsError());
      });
  };

/**
 * Called when a calendar event is clicked on
 * @param  {Object} eventObj
 */
export const handleEventClick =
  (eventObj: Object) =>
  (dispatch: (action: Action | EventTooltipAction) => Action) => {
    if (
      !eventObj.event.extendedProps?.incompleteEvent ||
      eventObj.event.extendedProps?.type === 'UNKNOWN'
    ) {
      dispatch(displayEventTooltip(eventObj.event, eventObj.el));
    }
    eventObj.jsEvent?.preventDefault();
  };

/**
 * Call to delete an event from the Planning Hub
 * @param  {number} eventID
 */
export const deleteEvent =
  (
    eventToDelete: Event,
    eventScope: RecurrenceChangeScope,
    sendNotifications?: boolean
  ): ThunkAction =>
  (
    dispatch: (
      action: Action | CalendarEventsPanelAction | ThunkAction
    ) => Action | ThunkAction,
    getState: Function
  ) => {
    dispatch(createOrUpdateEventRequestBegin());
    let queryParams;
    if (getIsRepeatEvent(eventToDelete)) {
      // getIsRepeatEvent(eventToDelete) == true guarantees
      // `recurrence.recurring_event_id` and `recurrence.original_start_time`
      // aren’t null or undefined.
      queryParams = {
        // `recurrence.recurring_event_id` isn’t null or undefined inside this
        // if statement.
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-call]
        recurring_event_id: eventToDelete?.recurrence?.recurring_event_id,
        // `recurrence.original_start_time` isn’t null or undefined inside this
        // if statement.
        // $FlowIgnore[prop-missing]
        // $FlowIgnore[incompatible-call]
        original_start_time: eventToDelete?.recurrence?.original_start_time,
        scope: eventScope,
      };
    }

    if (typeof sendNotifications === 'boolean') {
      queryParams = {
        ...queryParams,
        send_notifications: sendNotifications,
      };
    }

    deleteEventService(eventToDelete.id, queryParams)
      .then(() => {
        const startDate = getState().calendarPage.calendarDates.startDate;
        const endDate = getState().calendarPage.calendarDates.endDate;
        const token = $('meta[name=csrf-token]').attr('content');
        dispatch(createOrUpdateEventRequestSuccess());
        dispatch(fetchCalendarEvents(token, startDate, endDate));
      })
      .catch(() => {
        dispatch(createOrUpdateEventRequestFailure());
      });
  };

/**
 * Call to fetch an event from the Planning Hub
 * @param  {number} eventId
 * @param  {boolean=false} duplicate
 * @returns ThunkAction
 */

type FetchEvent = {
  calendarEventId: ?string,
  shouldOpenEditEventSidePanel: boolean,
  isDuplicate: boolean,
  isDeletingEvent?: boolean,
  type: CalendarEventTypeEnumLike,
  // startTime & virtualEventId only passed if it's a virtual repeat event
  startTime?: string,
  virtualEventId?: string,
};
export const fetchEvent =
  ({
    calendarEventId,
    isDuplicate = false,
    shouldOpenEditEventSidePanel,
    isDeletingEvent = false,
    type,
    startTime,
    virtualEventId = null,
  }: FetchEvent): ThunkAction =>
  (
    dispatch: (
      action:
        | Action
        | CalendarEventsPanelAction
        | EventTooltipAction
        | ThunkAction
    ) => Action | ThunkAction
  ) => {
    if (!calendarEventId) return;
    dispatch(fetchEventLoading());
    const requestUrl = createPlanningEventUrl({
      id: virtualEventId ?? calendarEventId,
      start: startTime,
      url: `/planning_hub/events/${calendarEventId}`,
      extendedProps: { type },
    });
    $.ajax({
      method: 'GET',
      url: requestUrl,
      contentType: 'application/json',
      dataType: 'json',
    })
      .done(async (response) => {
        if (response.event) {
          dispatch(hideEventTooltip());
          const convertedEvent = { ...response.event, virtualEventId };
          convertedEvent.background_color = defaultBackgroundColor;
          convertedEvent.border_color = defaultBorderColor;
          convertedEvent.text_color = defaultTextColor;

          if (isDuplicate) {
            dispatch(removeIncompleteEvents());
            convertedEvent.are_participants_duplicated = false;
            delete convertedEvent.event_collection_complete;
            // Usage of Full calendar API getEventById requires a value for id
            // https://fullcalendar.io/docs/v4/Calendar-getEventById
            // Assigning -1 as all saved events will have a positive number
            convertedEvent.calendarEventId = '-1';
            const calendarEvent =
              convertPlanningEventToCalendarEvent(convertedEvent);
            calendarEvent.id = '-1';
            // Because event.id was present in call to convertPlanningEventToCalendarEvent
            // We need to reset these values for a duplicate event to be movable on the calendar
            calendarEvent.incompleteEvent = true;
            calendarEvent.editable = true;
            convertedEvent.recurrence = emptyRecurrence;

            dispatch(addCalendarEvent(calendarEvent));
            dispatch(editEventDetails(convertedEvent, 'DUPLICATE'));
          } else {
            convertedEvent.calendarEventId = calendarEventId;

            if (convertedEvent.recurrence.rule) {
              const transformedRule = transformBeRecurrenceToFitFe({
                rule: convertedEvent.recurrence.rule,
                // Using startTime is necessary for the repeat configuration select to
                // function properly (otherwise the options will not match the value)
                startTime: startTime ?? convertedEvent.start_date,
              });

              // eslint-disable-next-line max-depth
              if (startTime) {
                convertedEvent.recurrence = {
                  rule: transformedRule,
                  recurring_event_id: calendarEventId,
                  original_start_time: startTime,
                  rrule_instances:
                    response.event.recurrence?.rrule_instances ?? null,
                  preferences: convertedEvent.recurrence?.preferences,
                };
                // This will overwrite the start time for a virtual repeat event
                convertedEvent.start_date = startTime;
              } else {
                convertedEvent.recurrence.rule = transformedRule;
              }
            }

            if (shouldOpenEditEventSidePanel) {
              dispatch(editEventDetails(convertedEvent, 'EDIT'));

              // eslint-disable-next-line max-depth
              if (convertedEvent.type === 'game_event') {
                const eventPeriods = await getEventPeriods({
                  eventId: convertedEvent.id,
                });
                dispatch(setSavedEventPeriods(eventPeriods));
              }
            } else if (isDeletingEvent) {
              dispatch(deleteEventDetails(convertedEvent));
            }
          }

          dispatch(fetchEventSuccess());
        } else {
          dispatch(fetchEventError());
        }
      })
      .fail(() => {
        dispatch(fetchEventError());
      });
  };

/**
 * Called when a day or range is selected on the calendar to trigger creation of an event for the calendar
 * @param  {SelectionInfo} selectionInfo
 * @param  {string} orgTimeZone
 */
export const handleEventSelect =
  (selectionInfo: SelectionInfo, orgTimeZone: string) =>
  (
    dispatch: (action: Action | EventTooltipAction) => Action,
    getState: Function
  ) => {
    const tooltipActive = getState().eventTooltip.active;
    if (tooltipActive) {
      dispatch(hideEventTooltip());
    } else {
      const changedEvent = convertFullCalEvent(selectionInfo, orgTimeZone);
      const existingEvent = getState().eventsPanel.event;
      if (!existingEvent) {
        const currentView = getState().calendarPage.currentView;

        if (currentView === 'dayGridMonth') {
          // Clicking on the month view creates all day events
          // We don't want that, clear the duration (1440 minutes) and set the time to now
          changedEvent.allDay = false;
          changedEvent.duration = undefined;
          changedEvent.start_date = changedEvent.start_date
            ? getDateWithCurrentTime(changedEvent.start_date)
            : undefined;
        }

        // New event
        dispatch(removeIncompleteEvents());
        const converted = convertPlanningEventToCalendarEvent(changedEvent);
        dispatch(addCalendarEvent(converted));
      } else if (existingEvent.id == null) {
        const panelEvent = { ...existingEvent };
        // Copy over just the time data to the existing panelEvent
        panelEvent.start_date = changedEvent.start_date;
        panelEvent.duration = changedEvent.duration;
        dispatch(removeIncompleteEvents());
        dispatch(
          addCalendarEvent(convertPlanningEventToCalendarEvent(panelEvent))
        );
        dispatch(editEventDetails(panelEvent));
      }
    }
  };

/**
 * Called when a new event or template is dropped onto the calendar
 * @param  {Object} eventObj
 * @param  {string} orgTimeZone
 */
export const handleEventReceive =
  (eventObj: Object, orgTimeZone: string) =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const currentView = getState().calendarPage.currentView;

    eventObj.event.setProp('backgroundColor', defaultBackgroundColor);
    eventObj.event.setProp('borderColor', defaultBorderColor);
    eventObj.event.setProp('textColor', defaultTextColor);

    const baseEvent = convertFullCalEvent(eventObj.event, orgTimeZone);
    eventObj.event.remove();
    if (currentView === 'dayGridMonth' && baseEvent.start_date) {
      // Events dropped onto Month view will have a start time of 12am
      // We don't want that, set the time to now
      baseEvent.start_date = getDateWithCurrentTime(baseEvent.start_date);
    }

    dispatch(removeIncompleteEvents());
    dispatch(addCalendarEvent(convertPlanningEventToCalendarEvent(baseEvent)));
    dispatch(editEventDetails(baseEvent, 'CREATE'));
  };

/**
 * Called when an existing calendar event is moved on the calendar
 * @param  {Object} eventDropInfo
 * @param  {string} orgTimeZone
 */
export const handleEventDrop =
  (eventDropInfo: Object, orgTimeZone: string): ThunkAction =>
  (
    dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
    getState: Function
  ) => {
    if (eventDropInfo.event.extendedProps?.type !== 'UNKNOWN') {
      const changedEvent = convertFullCalEvent(
        eventDropInfo.event,
        orgTimeZone
      );
      const panelEvent = { ...getState().eventsPanel.event };
      // Copy over just the time data to the existing panelEvent
      panelEvent.allDay = changedEvent.allDay;
      panelEvent.start_date = changedEvent.start_date;
      panelEvent.duration = changedEvent.duration;
      dispatch(editEventDetails(panelEvent));
    }
  };

/**
 * Called when a calendar event is resized, changing its duration / start time
 * @param  {Object} eventResizeInfo
 * @param  {string} orgTimeZone
 */
export const handleEventResize =
  (eventResizeInfo: Object, orgTimeZone: string): ThunkAction =>
  (
    dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
    getState: Function
  ) => {
    if (eventResizeInfo.event.extendedProps?.type !== 'UNKNOWN') {
      const changedEvent = convertFullCalEvent(
        eventResizeInfo.event,
        orgTimeZone
      );
      const panelEvent = { ...getState().eventsPanel.event };
      // Copy over just the time data to the existing panelEvent
      panelEvent.allDay = changedEvent.allDay;
      panelEvent.start_date = changedEvent.start_date;
      panelEvent.duration = changedEvent.duration;
      dispatch(editEventDetails(panelEvent));
    }
  };

export const refreshCalendarEvents =
  (token: string): ThunkAction =>
  (
    dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
    getState: Function
  ) => {
    const startDate = getState().calendarPage.calendarDates.startDate;
    const endDate = getState().calendarPage.calendarDates.endDate;
    dispatch(fetchCalendarEvents(token, startDate, endDate));
    dispatch(closeGameModal());
  };

export const onGameSaveSuccess =
  (token: string): ThunkAction =>
  (
    dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
    getState: Function
  ) => {
    const startDate = getState().calendarPage.calendarDates.startDate;
    const endDate = getState().calendarPage.calendarDates.endDate;
    dispatch(fetchCalendarEvents(token, startDate, endDate));
    dispatch(closeGameModal());
  };

export const onSessionSaveSuccess =
  (token: string): ThunkAction =>
  (
    dispatch: (action: Action | ThunkAction) => Action | ThunkAction,
    getState: Function
  ) => {
    const startDate = getState().calendarPage.calendarDates.startDate;
    const endDate = getState().calendarPage.calendarDates.endDate;
    dispatch(fetchCalendarEvents(token, startDate, endDate));
    dispatch(closeSessionModal());
  };

export const updateSquadSelection = (
  squadSelection: SquadAthletesSelection
): Action => ({
  type: 'UPDATE_SQUAD_SELECTION',
  payload: {
    squadSelection,
  },
});

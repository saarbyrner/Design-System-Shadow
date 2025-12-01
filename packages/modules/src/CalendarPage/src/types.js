// @flow
import { EventImpl } from '@fullcalendar/core/internal';

import { type ModalStatus } from '@kitman/common/src/types';
import { type CalendarEventBeforeFullCalendar } from '@kitman/components/src/Calendar/utils/types';
import { type Event } from '@kitman/common/src/types/Event';
import {
  type CheckboxItem,
  type SquadAthletesSelection,
} from '@kitman/components/src/types';

import {
  type Action as CalendarEventsPanelAction,
  type CalendarBaseEvent,
  type CalendarEventsPanelMode,
} from './components/CalendarEventsPanel/types';
import { type Action as EventTooltipAction } from './components/EventTooltip/types';

export type EventType =
  | 'game_event'
  | 'session_event'
  | 'custom_event'
  | 'tso_event'
  | 'UNKNOWN';

export type SelectionInfo = {
  start: Date,
  end: Date,
  startStr: string, // An ISO8601 string representation of the start date. It will have a timezone offset similar to the calendar’s timeZone e.g. 2018-09-01T12:30:00-05:00. If selecting all-day cells, it won’t have a time nor timezone part e.g. 2018-09-01.
  endStr: string, // An ISO8601 string representation of the end date. It will have a timezone offset similar to the calendar’s timeZone e.g. 2018-09-02T12:30:00-05:00. If selecting all-day cells, it won’t have a time nor timezone part e.g. 2018-09-02.
  allDay: boolean,
  extendedProps?: Object,
  backgroundColor?: string,
  borderColor?: string,
  calendarEventId?: string,
  textColor?: string,
  title?: string,
  id?: string,
};

export type CalendarPageState = {
  events: Array<CalendarEventBeforeFullCalendar>,
  calendarDates: {
    startDate: ?string,
    endDate: ?string,
  },
  calendarFilters: {
    squadSessionsFilter: boolean,
    individualSessionsFilter: boolean,
    gamesFilter: boolean,
    treatmentsFilter: boolean,
    rehabFilter: boolean,
    customEventsFilter: boolean,
  },
  squadSelection: SquadAthletesSelection,
  gameModal: {
    isOpen: boolean,
  },
  sessionModal: {
    isOpen: boolean,
  },
  customEventModal: {
    isOpen: boolean,
  },
};

export type EventsPanelState = {
  isOpen: boolean,
  mode: CalendarEventsPanelMode,
  event: CalendarBaseEvent,
};

export type EventsTooltipState = {
  element: ?Element,
  calendarEvent: ?typeof EventImpl,
};

export type EventsDeleteState = {
  event: Event,
};

export type AppStatusState = {
  status: ?ModalStatus,
  message: ?string,
};

type displayEventTooltip = {
  type: 'DISPLAY_EVENT_TOOLTIP',
  payload: {
    calendarEvent: typeof EventImpl,
    element: Element,
  },
};

type addCalendarEvent = {
  type: 'ADD_CALENDAR_EVENT',
  payload: {
    event: CalendarEventBeforeFullCalendar,
  },
};

type removeIncompleteEvents = {
  type: 'REMOVE_INCOMPLETE_EVENTS',
};

type updateCalendarEvents = {
  type: 'UPDATE_CALENDAR_EVENTS',
  payload: {
    events: Array<CalendarEventBeforeFullCalendar>,
  },
};

type setCalendarLoading = {
  type: 'SET_CALENDAR_LOADING',
  payload: {
    isLoading: boolean,
  },
};

type updateCalendarFilters = {
  type: 'UPDATE_CALENDAR_FILTERS',
  payload: {
    checkbox: CheckboxItem,
  },
};

type onViewChange = {
  type: 'ON_VIEW_CHANGE',
  payload: {
    viewInfo: Object,
  },
};

type onDatesRender = {
  type: 'ON_DATES_RENDER',
  payload: {
    viewInfo: Object,
  },
};

type editEventDetails = {
  type: 'EDIT_CALENDAR_EVENT_DETAILS',
  payload: {
    event: Object,
    mode?: 'EDIT' | 'CREATE' | 'DUPLICATE',
  },
};

type DeletedEventDetails = {
  type: 'DELETE_EVENT_DETAILS',
  payload: {
    event: Event,
  },
};

type fetchCalendarEventsError = {
  type: 'FETCH_CALENDAR_EVENTS_ERROR',
};

type fetchCalendarEventsSuccess = {
  type: 'FETCH_CALENDAR_EVENTS_SUCCESS',
};

type fetchCalendarEventsLoading = {
  type: 'FETCH_CALENDAR_EVENTS_LOADING',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type openGameModal = {
  type: 'OPEN_GAME_MODAL',
};

type closeGameModal = {
  type: 'CLOSE_GAME_MODAL',
};

type openSessionModal = {
  type: 'OPEN_SESSION_MODAL',
};

type closeSessionModal = {
  type: 'CLOSE_SESSION_MODAL',
};

type openCustomEventModal = {
  type: 'OPEN_CUSTOM_EVENT_MODAL',
};

type closeCustomEventModal = {
  type: 'CLOSE_CUSTOM_EVENT_MODAL',
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type serverRequestError = {
  type: 'SERVER_REQUEST_ERROR',
};

type serverRequestSuccess = {
  type: 'SERVER_REQUEST_SUCCESS',
};

type updateSquadSelection = {
  type: 'UPDATE_SQUAD_SELECTION',
  payload: {
    squadSelection: SquadAthletesSelection,
  },
};

type createOrUpdateEventRequestBegin = {
  type: 'CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN',
};

type createOrUpdateEventRequestSuccess = {
  type: 'CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS',
};

type createOrUpdateEventRequestFailure = {
  type: 'CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE',
};

type fetchEventError = {
  type: 'FETCH_EVENT_ERROR',
};

type fetchEventSuccess = {
  type: 'FETCH_EVENT_SUCCESS',
};

type fetchEventLoading = {
  type: 'FETCH_EVENT_LOADING',
};

export type Action =
  | addCalendarEvent
  | updateCalendarEvents
  | fetchCalendarEventsError
  | fetchCalendarEventsSuccess
  | fetchCalendarEventsLoading
  | setCalendarLoading
  | updateCalendarFilters
  | onViewChange
  | onDatesRender
  | openGameModal
  | closeGameModal
  | openSessionModal
  | closeSessionModal
  | openCustomEventModal
  | closeCustomEventModal
  | hideAppStatus
  | serverRequest
  | serverRequestSuccess
  | serverRequestError
  | updateSquadSelection
  | editEventDetails
  | DeletedEventDetails
  | createOrUpdateEventRequestBegin
  | createOrUpdateEventRequestSuccess
  | createOrUpdateEventRequestFailure
  | removeIncompleteEvents
  | displayEventTooltip
  | fetchEventError
  | fetchEventSuccess
  | fetchEventLoading;

type Dispatch = (
  action:
    | Action
    | CalendarEventsPanelAction
    | EventTooltipAction
    // eslint-disable-next-line no-use-before-define
    | ThunkAction
) => any;
type GetState = () => CalendarPageState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

export type CustomEventPermissions = {
  canCreate: boolean | void,
  canEdit: boolean | void,
  canDelete: boolean | void,
  isSuperAdmin: boolean | void,
};

/*
  FullCalendar types
*/
type FullCalendarEventObject = {
  id: string,
  groupId: string,
  allDay: boolean,
  start: Date,
  end: Date,
  title: string,
  url: string,
  classNames: Array<string>,
  editable: boolean,
  startEditable: boolean,
  durationEditable: boolean,
  resourceEditable: boolean,
  rendering?: 'background' | 'inverse-background',
  overlap: boolean,
  constraint: Object,
  backgroundColor: string,
  borderColor: string,
  textColor: string,
  extendedProps: Object,
  source: Array<any> | Function | Object,
  remove: () => void,
};

export type FullCalendarRef = {
  current: {
    getApi: () => typeof EventImpl,
    calendar: { currentData: { viewTitle: string } },
  } | null,
};

export type FullCalendarApi = {
  getEventById: (id: string) => FullCalendarEventObject | null,
  addEvent: (event: FullCalendarEventObject) => void,
};

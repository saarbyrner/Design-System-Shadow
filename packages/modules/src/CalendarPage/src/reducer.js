// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { SquadAthletesSelection } from '@kitman/components/src/types';
import type {
  Action as EventsPanelAction,
  CalendarBaseEvent,
} from './components/CalendarEventsPanel/types';
import type { Action as EventTooltipAction } from './components/EventTooltip/types';

import type {
  CalendarPageState,
  Action,
  AppStatusState,
  EventsPanelState,
  EventsTooltipState,
  EventsDeleteState,
} from './types';

export const calendarPage = (
  state: CalendarPageState = {},
  action: Action
): CalendarPageState => {
  switch (action.type) {
    case 'ADD_CALENDAR_EVENT': {
      return {
        ...state,
        events: [
          ...state.events,
          {
            ...action.payload.event,
            title:
              action.payload.event.title ?? action.payload.event.theme?.name,
          },
        ],
      };
    }
    case 'REMOVE_INCOMPLETE_EVENTS': {
      return {
        ...state,
        events: state.events.filter((event) => event.incompleteEvent !== true),
      };
    }
    case 'UPDATE_CALENDAR_EVENTS': {
      return {
        ...state,
        events: action.payload.events.map((event) => ({
          ...event,
          title: event.title ?? event.theme?.name,
        })),
      };
    }
    case 'UPDATE_CALENDAR_FILTERS': {
      const updatedFilters = { ...state.calendarFilters };
      updatedFilters[action.payload.checkbox.id] =
        action.payload.checkbox.checked;

      if (getIsLocalStorageAvailable()) {
        window.localStorage.setItem(
          'calendarSquadSessionsFilter',
          updatedFilters.squadSessionsFilter
        );
        window.localStorage.setItem(
          'calendarIndividualSessionsFilter',
          updatedFilters.individualSessionsFilter
        );
        window.localStorage.setItem(
          'calendarGamesFilter',
          updatedFilters.gamesFilter
        );
        window.localStorage.setItem(
          'calendarTreatmentsFilter',
          updatedFilters.treatmentsFilter
        );
        window.localStorage.setItem(
          'calendarRehabFilter',
          updatedFilters.rehabFilter
        );
        window.localStorage.setItem(
          'calendarCustomEventsFilter',
          updatedFilters.customEventsFilter
        );
      }

      return {
        ...state,
        calendarFilters: updatedFilters,
      };
    }
    case 'ON_VIEW_CHANGE': {
      if (action.payload.viewInfo && getIsLocalStorageAvailable()) {
        window.localStorage.setItem(
          'selectedCalendarView',
          action.payload.viewInfo.view.type
        );
      }

      return {
        ...state,
        currentView: action.payload.viewInfo.view.type,
      };
    }
    case 'ON_DATES_RENDER': {
      return {
        ...state,
        calendarDates: {
          ...state.calendarDates,
          startDate: moment(action.payload.viewInfo.view.activeStart).format(
            DateFormatter.dateTransferFormat
          ),
          endDate: moment(action.payload.viewInfo.view.activeEnd).format(
            DateFormatter.dateTransferFormat
          ),
        },
      };
    }
    case 'OPEN_GAME_MODAL': {
      return {
        ...state,
        gameModal: {
          ...state.gameModal,
          isOpen: true,
        },
      };
    }
    case 'CLOSE_GAME_MODAL': {
      return {
        ...state,
        gameModal: {
          ...state.gameModal,
          isOpen: false,
        },
      };
    }
    case 'OPEN_SESSION_MODAL': {
      return {
        ...state,
        sessionModal: {
          ...state.sessionModal,
          isOpen: true,
        },
      };
    }
    case 'CLOSE_SESSION_MODAL': {
      return {
        ...state,
        sessionModal: {
          ...state.sessionModal,
          isOpen: false,
        },
      };
    }
    case 'OPEN_CUSTOM_EVENT_MODAL': {
      return {
        ...state,
        customEventModal: {
          ...state.customEventModal,
          isOpen: true,
        },
      };
    }
    case 'CLOSE_CUSTOM_EVENT_MODAL': {
      return {
        ...state,
        customEventModal: {
          ...state.customEventModal,
          isOpen: false,
        },
      };
    }
    case 'UPDATE_SQUAD_SELECTION': {
      const selection: SquadAthletesSelection = {
        ...action.payload.squadSelection,
      };
      selection.applies_to_squad = selection.athletes.length === 0;
      return {
        ...state,
        squadSelection: selection,
      };
    }
    default:
      return state;
  }
};

export const appStatus = (state: AppStatusState = {}, action: Action) => {
  switch (action.type) {
    case 'SET_CALENDAR_LOADING': {
      return {
        status: action.payload.isLoading ? 'loading' : null,
      };
    }
    case 'SERVER_REQUEST':
      return {
        status: 'loading',
      };
    case 'FETCH_EVENT_LOADING':
      return {
        status: 'loading',
        message: i18n.t('Loading...'),
      };
    case 'SERVER_REQUEST_ERROR':
      return {
        status: 'error',
      };
    case 'SERVER_REQUEST_SUCCESS':
    case 'CREATE_OR_UPDATE_EVENT_REQUEST_SUCCESS': {
      return {
        status: 'success',
      };
    }
    case 'HIDE_APP_STATUS':
    case 'FETCH_EVENT_SUCCESS': {
      return {
        status: null,
        message: null,
      };
    }
    case 'CREATE_OR_UPDATE_EVENT_REQUEST_BEGIN': {
      return {
        ...state,
        status: 'loading',
        message: i18n.t('Saving'),
      };
    }
    case 'CREATE_OR_UPDATE_EVENT_REQUEST_FAILURE':
    case 'FETCH_EVENT_ERROR': {
      return {
        ...state,
        status: 'error',
        message: null,
      };
    }
    default:
      return state;
  }
};

export const eventsPanel = (
  state: EventsPanelState = {},
  action: Action | EventsPanelAction
) => {
  switch (action.type) {
    case 'OPEN_CALENDAR_EVENTS_PANEL': {
      return {
        ...state,
        isOpen: true,
      };
    }
    case 'CLOSE_CALENDAR_EVENTS_PANEL': {
      return {
        ...state,
        isOpen: false,
        mode: 'VIEW_TEMPLATES',
        event: null,
      };
    }
    case 'EDIT_CALENDAR_EVENT_DETAILS': {
      const event: CalendarBaseEvent = action.payload.event;
      const mode = action.payload.mode || state.mode;
      return {
        ...state,
        isOpen: true,
        mode,
        event,
      };
    }
    default:
      return state;
  }
};

export const deleteEvent = (state: EventsDeleteState = {}, action: Action) => {
  switch (action.type) {
    case 'DELETE_EVENT_DETAILS': {
      return {
        ...state,
        event: action.payload.event,
      };
    }
    default:
      return state;
  }
};

export const eventTooltip = (
  state: EventsTooltipState = {},
  action: Action | EventTooltipAction
) => {
  switch (action.type) {
    case 'DISPLAY_EVENT_TOOLTIP': {
      return {
        ...state,
        active: true,
        calendarEvent: action.payload.calendarEvent,
        element: action.payload.element,
      };
    }
    case 'HIDE_EVENT_TOOLTIP': {
      return {
        ...state,
        active: false,
        calendarEvent: null,
        element: null,
      };
    }
    default:
      return state;
  }
};

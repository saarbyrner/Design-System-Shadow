// @flow
import type { Filters } from '@kitman/components/src/Calendar/CalendarFilters/redux/types';
import type { Settings } from '@kitman/components/src/Calendar/CalendarSettings/redux/types';

const calendarFilters = {
  squadSessionsFilter: true,
  individualSessionsFilter: true,
  gamesFilter: true,
  treatmentsFilter: true,
  rehabFilter: true,
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => Object.assign({}, state, {}),
});

type StoreMockInput = {
  optimizedCalendarFilters?: Filters,
  calendarSettings?: Settings,
};

export const createStoreMock = ({
  optimizedCalendarFilters,
  calendarSettings,
}: StoreMockInput) => {
  const store = {
    calendarFilters: optimizedCalendarFilters,
    calendarFiltersApi: optimizedCalendarFilters,
    calendarSettings,
    calendarPage: {
      events: [],
      calendarDates: {
        startDate: '2020-10-26T00:00:00+00:00',
        endDate: '2020-12-07T00:00:00+00:00',
      },
      calendarFilters: optimizedCalendarFilters ?? calendarFilters,
      squadSelection: {
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
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
    },
    appStatus: {
      status: null,
      message: null,
    },
    eventsPanel: {
      isOpen: false,
      mode: 'VIEW_TEMPLATES',
      event: null,
    },
    deleteEvent: {
      event: null,
    },
    eventTooltip: {
      active: false,
      calendarEvent: null,
      element: null,
    },
  };

  return storeFake(store);
};

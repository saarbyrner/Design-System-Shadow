// @flow
import moment from 'moment';
import { createStoreMock } from '@kitman/modules/src/CalendarPage/src/containers/__tests__/store';
import { data as squadAthletes } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { data as staffUsers } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { data as teams } from '@kitman/services/src/mocks/handlers/getTeams';
import { data as competitions } from '@kitman/services/src/mocks/handlers/getCompetitions';
import { generalData as locations } from '@kitman/services/src/mocks/handlers/planning/getEventLocations';
import { data as venueTypes } from '@kitman/services/src/mocks/handlers/getVenueTypes';
import { data as mockSquads } from '@kitman/services/src/mocks/handlers/getPermittedSquads';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypeFilterEnumLike } from '../CalendarFilters/utils/enum-likes';
import type { Filters } from '../CalendarFilters/redux/types';
import type { Settings } from '../CalendarSettings/redux/types';

const extendedProps = {
  squad: {
    id: 1,
    name: 'Squad Name',
  },
  eventCollectionComplete: true,
};

export const props = {
  events: [
    {
      backgroundColor: '#843b32',
      borderColor: '#843b32',
      id: '413272',
      start: '2024-03-04T14:00:00+01:00',
      end: '2024-03-04T15:00:00+01:00',
      title: 'Fitbit - Monitoring1',
      type: 'TRAINING_SESSION',
      url: '/workloads/training_sessions/413272',
      extendedProps,
    },
    {
      backgroundColor: '#843b32',
      borderColor: '#843b32',
      id: '413643',
      start: '2024-03-05T00:00:00+01:00',
      title: 'Fitbit - Monitoring2',
      type: 'TRAINING_SESSION',
      url: '/workloads/training_sessions/413643',
      extendedProps,
    },
    {
      backgroundColor: '#843b32',
      borderColor: '#843b32',
      id: '413979',
      start: '2024-03-06T00:00:00+01:00',
      title: 'Fitbit - Monitoring3',
      type: 'TRAINING_SESSION',
      url: '/workloads/training_sessions/413979',
      extendedProps,
    },
  ],
  orgTimeZone: 'Europe/Dublin',
  userLocale: 'en-US',
  forwardedRef: { current: { getApi: () => {} } },
  getAddEventMenuItems: () => [],
  setCalendarLoading: () => {},
  onViewChange: () => {},
  onDatesRender: () => {},
  t: i18nextTranslateStub(),
};

export const calendarFiltersMock: Filters = {
  squads: [mockSquads[0].id],
  locationNames: [{ label: locations[0].name, value: locations[0].id }],
  venueTypes: [venueTypes[0].id],
  athletes: [
    squadAthletes.squads[0].position_groups[0].positions[0].athletes[1].id,
  ],
  staff: [staffUsers[1].id],
  types: [eventTypeFilterEnumLike.games],
  competitions: [competitions[1].id],
  oppositions: [teams[1].id],
  session_type_names: [],
};

export const numberOfActiveFilters = Object.values(calendarFiltersMock).filter(
  // $FlowIgnore[incompatible-use] It's always an array
  (filterValue) => filterValue.length > 0
).length;

const defaultDayStartingHour = moment().set({ hour: 9, minute: 20 }).toString();

const defaultDayEndingHour = moment().set({ hour: 19, minute: 0 }).toString();

export const mockWeekStartDay = 'Saturday';
export const calendarSettingsMock: Settings = {
  weekStartDay: mockWeekStartDay,
  dayStartingHour: defaultDayStartingHour,
  dayEndingHour: defaultDayEndingHour,
  defaultEventDurationMins: 45,
};

export const storeMock = createStoreMock({
  optimizedCalendarFilters: calendarFiltersMock,
  calendarSettings: calendarSettingsMock,
});

// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Filters } from '@kitman/components/src/Calendar/CalendarFilters/redux/types';
import { eventTypeFilterEnumLike } from '@kitman/components/src/Calendar/CalendarFilters/utils/enum-likes';

type State = {
  calendarFilters: Filters,
  calendarPage: {
    calendarFilters: {
      squadSessionsFilter: boolean,
      individualSessionsFilter: boolean,
      gamesFilter: boolean,
      treatmentsFilter: boolean,
      rehabFilter: boolean,
      customEventsFilter: boolean,
    },
    squadSelection: {
      athletes: [],
    },
  },
};

const getEvents = async (
  {
    calendarFilters: optimizedCalendarFilters = {},
    calendarPage: { calendarFilters, squadSelection },
  }: State,
  startDate: string,
  endDate: string,
  abortSignal?: AbortSignal
) => {
  const eventTypes = new Set(optimizedCalendarFilters.types);

  const isOptimizedCalendarFFOn = window.featureFlags['optimized-calendar'];
  const isSessionTypeFilterFFOn = window.getFlag(
    'pac-calendar-filtering-session-types-integrations'
  );
  const squadSessionsFilter = (
    (isOptimizedCalendarFFOn &&
      eventTypes.has(eventTypeFilterEnumLike.squadSessions)) ||
    calendarFilters.squadSessionsFilter
  )?.toString();

  const individualSessionsFilter = (
    (isOptimizedCalendarFFOn &&
      eventTypes.has(eventTypeFilterEnumLike.individualSessions)) ||
    calendarFilters.individualSessionsFilter
  )?.toString();

  const games = (
    (isOptimizedCalendarFFOn &&
      eventTypes.has(eventTypeFilterEnumLike.games)) ||
    calendarFilters.gamesFilter
  )?.toString();

  const treatments = (
    (isOptimizedCalendarFFOn &&
      eventTypes.has(eventTypeFilterEnumLike.treatments)) ||
    calendarFilters.treatmentsFilter
  )?.toString();

  const rehab = (
    (isOptimizedCalendarFFOn &&
      eventTypes.has(eventTypeFilterEnumLike.rehab)) ||
    calendarFilters.rehabFilter
  )?.toString();

  const customEvents =
    isOptimizedCalendarFFOn &&
    eventTypes.has(eventTypeFilterEnumLike.customEvents)
      ? 'true'
      : calendarFilters.customEventsFilter?.toString();

  const { data } = await axios.post(
    '/calendar/events',
    {
      squad_sessions: squadSessionsFilter,
      individual_sessions: individualSessionsFilter,
      games,
      treatments: window.featureFlags['schedule-treatments']
        ? treatments
        : undefined,
      rehab: window.featureFlags['schedule-rehab'] ? rehab : undefined,
      athlete_ids: window.featureFlags['web-calendar-athlete-filter']
        ? squadSelection.athletes
        : undefined,
      custom_events: window.featureFlags['custom-events']
        ? customEvents
        : undefined,
      start: startDate,
      end: endDate,
      ...(isSessionTypeFilterFFOn && {
        session_type_names: optimizedCalendarFilters.session_type_names,
      }),
      ...(isOptimizedCalendarFFOn
        ? {
            user_ids: optimizedCalendarFilters.staff,
            athlete_ids: optimizedCalendarFilters.athletes,
            squad_ids: optimizedCalendarFilters.squads,
            competition_ids: optimizedCalendarFilters.competitions,
            oppositions_ids: optimizedCalendarFilters.oppositions,
            venue_type_ids: optimizedCalendarFilters.venueTypes,
            location_ids: optimizedCalendarFilters.locationNames.map(
              ({ value }) => value
            ),
          }
        : {}),
    },
    { signal: abortSignal }
  );

  return data;
};

export default getEvents;

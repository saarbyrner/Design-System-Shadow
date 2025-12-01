// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  getAthleteEvents as getPaginatedAthleteEvents,
  saveEventParticipants,
  updateEventAttributes,
} from '@kitman/services/src/services/planning';
import type { AthleteEvent } from '@kitman/common/src/types/Event';
import getAthleteEvents from '@kitman/modules/src/PlanningEvent/src/services/getAthleteEvents';

export const athleteEventAPI = createApi({
  reducerPath: 'athleteEventAPI',
  endpoints: (builder) => ({
    getPaginatedAthleteEvents: builder.query({
      queryFn: serviceQueryFactory(getPaginatedAthleteEvents),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, meta) => {
        // Override the current cache - this is a new request
        if (meta.arg.nextId == null) {
          // eslint-disable-next-line no-param-reassign
          currentCache.athlete_events = newItems.athlete_events;
        }
        // Keep cache - next id has a value, meaning this was a call to fetch on infinite scroll
        else {
          currentCache.athlete_events.push(...newItems.athlete_events);
        }
        // eslint-disable-next-line no-param-reassign
        currentCache.next_id = newItems.next_id;
      },
    }),
    updateAthleteEvents: builder.mutation({
      queryFn: serviceQueryFactory(saveEventParticipants),
    }),
    updateAthleteAttendance: builder.mutation({
      queryFn: serviceQueryFactory(updateEventAttributes),
    }),
    getAthleteEvents: builder.query<Array<AthleteEvent>>({
      queryFn: serviceQueryFactory((eventId) => getAthleteEvents(eventId)),
    }),
  }),
});

export const {
  useGetAthleteEventsQuery,
  useGetPaginatedAthleteEventsQuery,
  useUpdateAthleteEventsMutation,
  useUpdateAthleteAttendanceMutation,
} = athleteEventAPI;

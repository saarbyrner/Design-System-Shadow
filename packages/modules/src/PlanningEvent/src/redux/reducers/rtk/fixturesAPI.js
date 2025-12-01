// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getEvents from '@kitman/modules/src/PlanningHub/src/services/getEvents';
import { getSeasonMarkerRange } from '@kitman/services/src/services/leaguefixtures';
import getEventsUpdates, {
  type EventDetails,
} from '@kitman/services/src/services/leaguefixtures/getEventsUpdates';

export const fixturesAPI = createApi({
  reducerPath: 'fixturesAPI',
  endpoints: (builder) => ({
    getEvents: builder.query({
      queryFn: serviceQueryFactory(({ filters, nextId }) =>
        getEvents(filters, nextId)
      ),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const { filters } = queryArgs;
        return `${JSON.stringify(filters)}_${endpointName}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, meta) => {
        // We use this to reset argument for cache busting
        if (meta.arg.reset) return newItems;

        // We merge the events when fetching the nextId ('Load more' button)
        if (meta.arg.nextId) {
          return {
            ...newItems,
            events: [...currentCache.events, ...newItems.events],
          };
        }

        // Otherwise, we leave the cache as is
        return currentCache;
      },
    }),
    getEventsUpdates: builder.query<Array<EventDetails>>({
      queryFn: serviceQueryFactory(({ eventIds }) =>
        getEventsUpdates({ eventIds })
      ),
    }),
    getSeasonMarkerRange: builder.query<Array<string>>({
      queryFn: serviceQueryFactory(getSeasonMarkerRange),
    }),
  }),
});

export const {
  useLazyGetEventsQuery,
  useGetSeasonMarkerRangeQuery,
  useGetEventsUpdatesQuery,
} = fixturesAPI;

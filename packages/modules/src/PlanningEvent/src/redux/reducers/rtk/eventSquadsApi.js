// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getEventSquads } from '@kitman/services/src/services/planning';
import type { EventSquads } from '@kitman/services/src/services/planning/getEventSquads';

export const eventSquadsApi = createApi({
  reducerPath: 'eventSquadsApi',
  endpoints: (builder) => ({
    getEventSquads: builder.query<EventSquads>({
      queryFn: serviceQueryFactory(
        ({ eventId, params }) =>
          getEventSquads(eventId, params)
      ),
    }),
  }),
});

export const { useLazyGetEventSquadsQuery, useGetEventSquadsQuery } =
  eventSquadsApi;

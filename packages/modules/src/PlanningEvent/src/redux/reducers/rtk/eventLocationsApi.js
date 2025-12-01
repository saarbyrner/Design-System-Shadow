// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import type { EventLocationFull } from '@kitman/services/src/services/planning/getEventLocations';
import getEventLocations from '@kitman/services/src/services/planning/getEventLocations';

export const eventLocationsApi = createApi({
  reducerPath: 'eventLocationsApi',
  endpoints: (builder) => ({
    getEventLocations: builder.query<Array<EventLocationFull>, void>({
      queryFn: serviceQueryFactory(getEventLocations),
    }),
  }),
});

export const { useGetEventLocationsQuery } = eventLocationsApi;

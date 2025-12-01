// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getTvChannels from '@kitman/services/src/services/planning/tvChannels/getTvChannels';
import type { TvChannel } from '@kitman/services/src/services/planning/tvChannels/getTvChannels';

export const tvChannelsApi = createApi({
  reducerPath: 'tvChannelsApi',
  endpoints: (builder) => ({
    getTvChannels: builder.query<TvChannel>({
      queryFn: serviceQueryFactory(getTvChannels),
    }),
  }),
});

export const { useGetTvChannelsQuery } = tvChannelsApi;

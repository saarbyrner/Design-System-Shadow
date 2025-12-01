// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import fetchOfficial from './api/fetchOfficial';
import searchOfficials from './api/searchOfficials';
import updateOfficial from './api/updateOfficial';
import createOfficial from './api/createOfficial';

export const officialAPI = createApi({
  reducerPath: 'officialAPI',
  tagTypes: ['OFFICIAL_LIST', 'OFFICIAL'],
  endpoints: (builder) => ({
    fetchOfficial: builder.query({
      queryFn: serviceQueryFactory((id) => fetchOfficial(id)),
      providesTags: ['OFFICIAL'],
    }),
    searchOfficials: builder.query({
      queryFn: serviceQueryFactory(searchOfficials),
      providesTags: ['OFFICIAL_LIST'],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems) => {
        // eslint-disable-next-line no-param-reassign
        currentCache.meta = newItems.meta;
        if (newItems.meta.current_page === 1) {
          // eslint-disable-next-line no-param-reassign
          currentCache.data = newItems.data;
        } else currentCache.data.push(...newItems.data);
      },
    }),
    updateOfficial: builder.mutation({
      queryFn: serviceQueryFactory(updateOfficial),
      invalidatesTags: ['OFFICIAL_LIST', 'OFFICIAL'],
    }),
    createOfficial: builder.mutation({
      queryFn: serviceQueryFactory(createOfficial),
      invalidatesTags: ['OFFICIAL_LIST', 'OFFICIAL'],
    }),
  }),
});

export const {
  useFetchOfficialQuery,
  useSearchOfficialsQuery,
  useUpdateOfficialMutation,
  useCreateOfficialMutation,
} = officialAPI;

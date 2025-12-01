// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import fetchScout from './api/fetchScout';
import searchScouts from './api/searchScouts';
import updateScout from './api/updateScout';
import createScout from './api/createScout';
import fetchFormStructure from './api/fetchFormStructure';

const TAGS = {
  SCOUT_LIST: 'SCOUT_LIST',
  SCOUT: 'SCOUT',
  FORM: 'FORM',
};

export const scoutApi = createApi({
  reducerPath: 'scoutApi',
  tagTypes: [TAGS.SCOUT_LIST, TAGS.SCOUT],
  endpoints: (builder) => ({
    fetchScout: builder.query({
      queryFn: serviceQueryFactory((id) => fetchScout(id)),
      providesTags: [TAGS.SCOUT],
    }),
    searchScouts: builder.query({
      queryFn: serviceQueryFactory(searchScouts),
      providesTags: [TAGS.SCOUT_LIST],
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
    updateScout: builder.mutation({
      queryFn: serviceQueryFactory(updateScout),
      invalidatesTags: [TAGS.SCOUT_LIST, TAGS.SCOUT],
    }),
    createScout: builder.mutation({
      queryFn: serviceQueryFactory(createScout),
      invalidatesTags: [TAGS.SCOUT_LIST, TAGS.SCOUT],
    }),
    fetchFormStructure: builder.query({
      queryFn: serviceQueryFactory((id) => fetchFormStructure(id)),
      providesTags: ['FORM'],
    }),
  }),
});

export const {
  useFetchScoutQuery,
  useSearchScoutsQuery,
  useUpdateScoutMutation,
  useCreateScoutMutation,
  useFetchFormStructureQuery,
} = scoutApi;

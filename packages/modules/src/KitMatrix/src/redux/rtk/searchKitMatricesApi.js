/* eslint-disable no-param-reassign */
// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import searchKitMatrices from '@kitman/services/src/services/kitMatrix/searchKitMatrices';
import type { SearchResponse } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';
import createKitMatrix from '@kitman/services/src/services/kitMatrix/createKitMatrix';
import { updateKitMatrix } from '@kitman/services';
import bulkUpdateKitMatrix from '@kitman/services/src/services/kitMatrix/bulkUpdate';
import getLeagueSeasons from '@kitman/services/src/services/kitMatrix/getLeagueSeasons';
import type { LeagueSeason } from '@kitman/services/src/services/kitMatrix/getLeagueSeasons';

const TAGS = {
  SEARCH_KIT_MATRICES: 'SEARCH_KIT_MATRICES',
};

export const searchKitMatricesApi = createApi({
  reducerPath: 'searchKitMatricesApi',
  tagTypes: [TAGS.SEARCH_KIT_MATRICES],
  endpoints: (builder) => ({
    searchKitMatrices: builder.query<SearchResponse>({
      queryFn: serviceQueryFactory(searchKitMatrices),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, meta) => {
        // Override the current cache - this is a new request
        if (meta.arg.next_id == null) {
          currentCache.kit_matrices = newItems.kit_matrices;
        }
        // Keep cache - next id has a value, meaning this was a call to fetch on infinite scroll
        else {
          currentCache.kit_matrices.push(...newItems.kit_matrices);
        }
        currentCache.next_id = newItems.next_id;
      },
      providesTags: [TAGS.SEARCH_KIT_MATRICES],
    }),
    // Temporary until QA is complete
    searchKitMatricesNoMergeStrategy: builder.query({
      queryFn: serviceQueryFactory(searchKitMatrices),
      providesTags: [TAGS.SEARCH_KIT_MATRICES],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getPlayersKitMatrices: builder.query<SearchResponse>({
      queryFn: serviceQueryFactory(searchKitMatrices),
      serializeQueryArgs: ({ endpointName }) => endpointName,
    }),
    getRefereesKitMatrices: builder.query<SearchResponse>({
      queryFn: serviceQueryFactory(searchKitMatrices),
      serializeQueryArgs: ({ endpointName }) => endpointName,
    }),
    updateKitMatrix: builder.mutation({
      queryFn: serviceQueryFactory(updateKitMatrix),
      invalidatesTags: [TAGS.SEARCH_KIT_MATRICES],
    }),
    createKitMatrix: builder.mutation({
      queryFn: serviceQueryFactory(createKitMatrix),
      invalidatesTags: [TAGS.SEARCH_KIT_MATRICES],
    }),
    bulkUpdateKitMatrix: builder.mutation({
      queryFn: serviceQueryFactory(bulkUpdateKitMatrix),
      invalidatesTags: [TAGS.SEARCH_KIT_MATRICES],
    }),
    getLeagueSeasons: builder.query<Array<LeagueSeason>>({
      queryFn: serviceQueryFactory(getLeagueSeasons),
      serializeQueryArgs: ({ endpointName }) => endpointName,
    }),
  }),
});

export const {
  useSearchKitMatricesQuery,
  useSearchKitMatricesNoMergeStrategyQuery,
  useGetPlayersKitMatricesQuery,
  useGetRefereesKitMatricesQuery,
  useUpdateKitMatrixMutation,
  useCreateKitMatrixMutation,
  useBulkUpdateKitMatrixMutation,
  useGetLeagueSeasonsQuery,
} = searchKitMatricesApi;

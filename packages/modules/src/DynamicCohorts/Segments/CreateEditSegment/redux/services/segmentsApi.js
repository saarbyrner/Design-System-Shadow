// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  createSegment,
  fetchSegment,
  searchAthletes,
  updateSegment,
  searchSegments,
  deleteSegment,
} from '@kitman/services/src/services/dynamicCohorts';

export const segmentsApi = createApi({
  reducerPath: 'segmentsApi',
  endpoints: (builder) => ({
    createSegment: builder.mutation({
      queryFn: serviceQueryFactory(createSegment),
    }),
    fetchSegment: builder.query({
      queryFn: serviceQueryFactory(fetchSegment),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    updateSegment: builder.mutation({
      queryFn: serviceQueryFactory(updateSegment),
    }),
    searchAthletes: builder.query({
      queryFn: serviceQueryFactory(searchAthletes),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, meta) => {
        if (meta.arg.nextId === null) {
          // eslint-disable-next-line no-param-reassign
          currentCache.athletes = newItems.athletes;
        } else {
          currentCache.athletes.push(...newItems.athletes);
        }
        // eslint-disable-next-line no-param-reassign
        currentCache.next_id = newItems.next_id;
      },
    }),
    searchSegments: builder.query({
      queryFn: serviceQueryFactory(searchSegments),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, meta) => {
        if (meta.arg.nextId === null) {
          // eslint-disable-next-line no-param-reassign
          currentCache.segments = newItems.segments;
        } else {
          currentCache.segments.push(...newItems.segments);
        }
        // eslint-disable-next-line no-param-reassign
        currentCache.next_id = newItems.next_id;
      },
    }),
    deleteSegment: builder.mutation({
      queryFn: serviceQueryFactory(deleteSegment),
    }),
  }),
});

export const {
  useCreateSegmentMutation,
  useFetchSegmentQuery,
  useUpdateSegmentMutation,
  useSearchAthletesQuery,
  useSearchSegmentsQuery,
  useDeleteSegmentMutation,
} = segmentsApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  createLabel,
  getAllLabels,
  searchLabels,
  updateLabel,
} from '@kitman/services/src/services/OrganisationSettings';
import { deleteLabel } from '@kitman/services/src/services/dynamicCohorts';

export const labelsApi = createApi({
  reducerPath: 'labelsApi',
  endpoints: (builder) => ({
    searchLabels: builder.query({
      queryFn: serviceQueryFactory(searchLabels),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, meta) => {
        if (meta.arg.nextId === null) {
          // eslint-disable-next-line no-param-reassign
          currentCache.labels = newItems.labels;
        } else {
          currentCache.labels.push(...newItems.labels);
        }
        // eslint-disable-next-line no-param-reassign
        currentCache.next_id = newItems.next_id;
      },
    }),
    createLabel: builder.mutation({
      queryFn: serviceQueryFactory(createLabel),
    }),
    updateLabel: builder.mutation({
      queryFn: serviceQueryFactory(updateLabel),
    }),
    getAllLabels: builder.query({ queryFn: serviceQueryFactory(getAllLabels) }),
    deleteLabel: builder.mutation({
      queryFn: serviceQueryFactory(deleteLabel),
    }),
  }),
});

export const {
  useSearchLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useGetAllLabelsQuery,
  useDeleteLabelMutation,
} = labelsApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import searchImportsList from '@kitman/services/src/services/searchImportsList';

import fetchImportTypeOptions from './api/fetchImportTypeOptions';
import fetchImportCreatorOptions from './api/fetchImportCreatorOptions';

const TAGS = {
  IMPORT_LIST: 'IMPORT_LIST',
};

export const importsApi = createApi({
  reducerPath: 'importsApi',
  tagTypes: [TAGS.IMPORT_LIST],
  endpoints: (builder) => ({
    searchImportsList: builder.query({
      queryFn: serviceQueryFactory(searchImportsList),
      providesTags: [TAGS.IMPORT_LIST],
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
    fetchImportTypeOptions: builder.query({
      queryFn: serviceQueryFactory(fetchImportTypeOptions),
    }),

    fetchImportCreatorOptions: builder.query({
      queryFn: serviceQueryFactory(fetchImportCreatorOptions),
    }),
  }),
});

export const {
  useSearchImportsListQuery,
  useFetchImportTypeOptionsQuery,
  useFetchImportCreatorOptionsQuery,
} = importsApi;

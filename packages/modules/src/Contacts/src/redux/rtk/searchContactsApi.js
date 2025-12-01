// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { searchContacts } from '@kitman/services';
import { mergeContacts } from '@kitman/modules/src/Contacts/shared/utils';

export const searchContactsApi = createApi({
  reducerPath: 'searchContactsApi',
  endpoints: (builder) => ({
    searchContacts: builder.query({
      queryFn: serviceQueryFactory(searchContacts),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: mergeContacts,
    }),
  }),
});

export const { useSearchContactsQuery } = searchContactsApi;

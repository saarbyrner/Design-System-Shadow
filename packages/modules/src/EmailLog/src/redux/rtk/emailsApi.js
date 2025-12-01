// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { searchEmails } from '@kitman/services';

export const emailsApi = createApi({
  reducerPath: 'emailsApi',
  endpoints: (builder) => ({
    searchEmails: builder.query({
      queryFn: serviceQueryFactory(searchEmails),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${JSON.stringify(queryArgs)}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useSearchEmailsQuery } = emailsApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getInitialData from '@kitman/services/src/services/messaging/getInitialData';
import getInitialContext from '@kitman/services/src/services/messaging/getInitialContext';

export const messagingApi = createApi({
  reducerPath: 'messagingApi',
  endpoints: (builder) => ({
    getInitialData: builder.query({
      queryFn: serviceQueryFactory(getInitialData),
    }),
    getInitialContext: builder.query({
      queryFn: serviceQueryFactory(getInitialContext),
    }),
  }),
});

export const { useGetInitialDataQuery, useGetInitialContextQuery } =
  messagingApi;

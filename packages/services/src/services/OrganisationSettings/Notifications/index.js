// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  getNotificationTriggers,
  updateNotificationTriggers,
  bulkUpdateNotificationTriggers,
} from './api';

export const reducerPath = 'notificationsApi';

const TAGS = {
  notificationTriggers: 'notificationTriggers',
};

export const notificationsApi = createApi({
  reducerPath,
  endpoints: (builder) => ({
    getNotificationTriggers: builder.query({
      queryFn: serviceQueryFactory(getNotificationTriggers),
      providesTags: [TAGS.notificationTriggers],
    }),
    updateNotificationTriggers: builder.mutation({
      queryFn: serviceQueryFactory((requestBody) =>
        updateNotificationTriggers(requestBody)
      ),
      invalidatesTags: [TAGS.notificationTriggers],
    }),
    bulkUpdateNotificationTriggers: builder.mutation({
      queryFn: serviceQueryFactory((requestBody) =>
        bulkUpdateNotificationTriggers(requestBody)
      ),
      invalidatesTags: [TAGS.notificationTriggers],
    }),
  }),
});

export const {
  useGetNotificationTriggersQuery,
  useUpdateNotificationTriggersMutation,
  useBulkUpdateNotificationTriggersMutation,
} = notificationsApi;

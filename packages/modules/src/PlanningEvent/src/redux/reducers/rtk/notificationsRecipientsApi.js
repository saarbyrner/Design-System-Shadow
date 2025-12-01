// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import type { NotificationRecipient } from '@kitman/services/src/services/planning/getNotificationsRecipients';
import getNotificationsRecipients from '@kitman/services/src/services/planning/getNotificationsRecipients';

export const notificationsRecipientsApi = createApi({
  reducerPath: 'notificationsRecipientsApi',
  endpoints: (builder) => ({
    getNotificationsRecipients: builder.query<Array<NotificationRecipient>>({
      queryFn: serviceQueryFactory(getNotificationsRecipients),
    }),
  }),
});

export const { useGetNotificationsRecipientsQuery } =
  notificationsRecipientsApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

export const lookerDashboardGroupApi = createApi({
  reducerPath: 'lookerDashboardGroupApi',
  endpoints: () => ({}),
});

export const { useGetDashboardGroupsQuery } = lookerDashboardGroupApi;

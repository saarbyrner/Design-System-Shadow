// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getPositionGroups } from '@kitman/services';
import type { PositionGroups } from '@kitman/services/src/services/getPositionGroups';

export const positionGroupsApi = createApi({
  reducerPath: 'positionGroupsApi',
  endpoints: (builder) => ({
    getPositionGroups: builder.query<PositionGroups>({
      queryFn: serviceQueryFactory(() => getPositionGroups()),
    }),
  }),
});

export const { useGetPositionGroupsQuery } = positionGroupsApi;

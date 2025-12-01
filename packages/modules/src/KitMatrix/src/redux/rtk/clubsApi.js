// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getClubs, getAssociationsOrgs, getClubSquads } from '@kitman/services';
import type { RequestResponse } from '@kitman/services/src/services/getClubs';

export const clubsApi = createApi({
  reducerPath: 'clubsApi',
  endpoints: (builder) => ({
    getClubs: builder.query<RequestResponse>({
      queryFn: serviceQueryFactory(getClubs),
    }),
    getClubSquads: builder.query<RequestResponse>({
      queryFn: serviceQueryFactory(getClubSquads),
    }),
    getAssociationsOrgs: builder.query<RequestResponse>({
      queryFn: serviceQueryFactory(getAssociationsOrgs),
    }),
  }),
});

export const {
  useGetClubsQuery,
  useGetClubSquadsQuery,
  useLazyGetClubSquadsQuery,
  useGetAssociationsOrgsQuery,
} = clubsApi;

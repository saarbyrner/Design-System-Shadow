// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import { getAthleteIssues, getSquadAthleteSearch } from '@kitman/services';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

export const playerSelectApi = createApi({
  reducerPath: 'playerSelectApi',
  endpoints: (builder) => ({
    getSquadAthleteSearch: builder.query({
      queryFn: serviceQueryFactory((filters) => getSquadAthleteSearch(filters)),
    }),
    getAthleteIssues: builder.query({
      queryFn: serviceQueryFactory((args) => getAthleteIssues(args)),
    }),
  }),
});

export const { useGetAthleteIssuesQuery, useGetSquadAthleteSearchQuery } =
  playerSelectApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import getCompetitions from '@kitman/services/src/services/getCompetitions';
import type { Competitions } from '@kitman/services/src/services/getCompetitions';

export const competitionsApi = createApi({
  reducerPath: 'competitionsApi',
  endpoints: (builder) => ({
    getCompetitions: builder.query<Competitions>({
      queryFn: serviceQueryFactory(getCompetitions),
    }),
  }),
});

export const { useGetCompetitionsQuery } = competitionsApi;

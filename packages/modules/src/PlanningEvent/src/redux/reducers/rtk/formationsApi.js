// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getFormations } from '@kitman/modules/src/PlanningEvent/src/services/formations';
import type { Formation } from '@kitman/modules/src/PlanningEvent/src/services/formations';

export const formationsApi = createApi({
  reducerPath: 'formationsApi',
  endpoints: (builder) => ({
    getFormations: builder.query<Array<Formation>>({
      queryFn: serviceQueryFactory(() => getFormations()),
    }),
  }),
});

export const { useGetFormationsQuery } = formationsApi;

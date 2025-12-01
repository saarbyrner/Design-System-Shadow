// @flow
import {
  getAthleteData,
  getSquadAthletes,
  getStaffUsers,
} from '@kitman/services';
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  getTemplateDashboards,
  getTemplateDashboardWidgets,
  getData,
  getGrowthAndMaturationData,
  getPastAthletes,
} from '@kitman/services/src/services/analysis';

export const templateDashboardsApi = createApi({
  reducerPath: 'templateDashboardsApi',
  endpoints: (builder) => ({
    getTemplateDashboards: builder.query({
      queryFn: serviceQueryFactory(getTemplateDashboards),
    }),
    getTemplateDashboardWidgets: builder.query({
      queryFn: serviceQueryFactory(getTemplateDashboardWidgets),
    }),
    getAllSquadAthletes: builder.query({
      queryFn: serviceQueryFactory(getSquadAthletes),
    }),
    getData: builder.query({
      queryFn: (args) => getData(args),
    }),
    getAthleteData: builder.query({
      queryFn: serviceQueryFactory(getAthleteData),
    }),
    getGrowthMaturationData: builder.query({
      queryFn: serviceQueryFactory(getGrowthAndMaturationData),
    }),
    getStaffUsers: builder.query({
      queryFn: serviceQueryFactory(getStaffUsers),
    }),
    getPastAthletes: builder.query({
      queryFn: serviceQueryFactory(getPastAthletes),
    }),
  }),
});

export const {
  useGetTemplateDashboardsQuery,
  useGetTemplateDashboardWidgetsQuery,
  useGetAllSquadAthletesQuery,
  useGetDataQuery,
  useGetAthleteDataQuery,
  useGetGrowthMaturationDataQuery,
  useGetStaffUsersQuery,
  useGetPastAthletesQuery,
} = templateDashboardsApi;

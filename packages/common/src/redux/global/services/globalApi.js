// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import ALL_PREFERENCES from '@kitman/common/src/contexts/PreferenceContext/utils';
import {
  getActiveSquad,
  getPermissions,
  getPreferences,
  getOrganisation,
  getCurrentUser,
  fetchOrganisationPreference,
  getSquads,
  getStaffUsers,
  getSquadAthletes,
  getCountries,
  getTrainingVariables,
  getSport,
} from '@kitman/services';
import { getDashboardGroups } from '@kitman/services/src/services/analysis';

import fetchOrganisation from '@kitman/modules/src/LeagueOperations/shared/services/fetchOrganisation';

import {
  transformDataToPermissions,
  getPermissionsContextMappings,
} from '@kitman/common/src/contexts/PermissionsContext';

const TAGS = {
  PERMISSIONS: 'PERMISSIONS',
  PREFERENCES: 'PREFERENCES',
  ORGANISATION: 'ORGANISATION',
  CURRENT_USER: 'CURRENT_USER',
  PREFERENCE: 'PREFERENCE',
  ACTIVE_SQUAD: 'ACTIVE_SQUAD',
  SQUAD_ATHLETES: 'SQUAD_ATHLETES',
};

export const globalApi = createApi({
  reducerPath: 'globalApi',
  tagTypes: [
    TAGS.PERMISSIONS,
    TAGS.PREFERENCES,
    TAGS.ORGANISATION,
    TAGS.CURRENT_USER,
    TAGS.PREFERENCE,
    TAGS.ACTIVE_SQUAD,
    TAGS.SQUAD_ATHLETES,
  ],
  endpoints: (builder) => ({
    getActiveSquad: builder.query({
      queryFn: serviceQueryFactory(getActiveSquad),
      providesTags: [TAGS.ACTIVE_SQUAD],
    }),
    getPermissions: builder.query({
      queryFn: serviceQueryFactory((args = { returnOriginalData: false }) =>
        getPermissions().then((data) => {
          if (args.returnOriginalData) {
            return data;
          }
          return transformDataToPermissions(
            getPermissionsContextMappings(data)
          );
        })
      ),
      providesTags: [TAGS.PERMISSIONS],
    }),
    getPreferences: builder.query({
      queryFn: serviceQueryFactory(() => getPreferences(ALL_PREFERENCES)),
      providesTags: [TAGS.PREFERENCES],
    }),
    getOrganisation: builder.query({
      queryFn: serviceQueryFactory(getOrganisation),
      providesTags: [TAGS.ORGANISATION],
    }),
    fetchOrganisation: builder.query({
      queryFn: serviceQueryFactory((id) => fetchOrganisation(id)),
    }),
    getCurrentUser: builder.query({
      queryFn: serviceQueryFactory(getCurrentUser),
      providesTags: [TAGS.CURRENT_USER],
    }),
    getSquads: builder.query({
      queryFn: serviceQueryFactory(getSquads),
    }),
    getStaffUsers: builder.query({
      queryFn: serviceQueryFactory(getStaffUsers),
    }),
    fetchOrganisationPreference: builder.query({
      queryFn: serviceQueryFactory(fetchOrganisationPreference),
      providesTags: [TAGS.PREFERENCE],
    }),
    getSquadAthletes: builder.query({
      queryFn: serviceQueryFactory((args) => getSquadAthletes(args)),
      providesTags: [TAGS.SQUAD_ATHLETES],
    }),
    getCountries: builder.query({
      queryFn: serviceQueryFactory(getCountries),
    }),
    getTrainingVariables: builder.query({
      queryFn: serviceQueryFactory((args) => getTrainingVariables(args)),
    }),
    getSport: builder.query({
      queryFn: serviceQueryFactory(getSport),
    }),
    getDashboardGroups: builder.query({
      queryFn: serviceQueryFactory(getDashboardGroups),
    }),
  }),
});

export const {
  useGetActiveSquadQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetSquadsQuery,
  useGetStaffUsersQuery,
  useFetchOrganisationQuery,
  useFetchOrganisationPreferenceQuery,
  useGetSquadAthletesQuery,
  useGetCountriesQuery,
  useGetTrainingVariablesQuery,
  useGetSportQuery,
  useGetDashboardGroupsQuery,
} = globalApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import searchSquadList from './api/searchSquadList';
import searchOrganisationDivisionList from './api/searchOrganisationDivisionList';
import fetchSquadSettings from './api/fetchSquadSettings';
import createSquad from './api/createSquad';

export const squadManagementApi = createApi({
  reducerPath: 'squadManagementApi',
  tagTypes: ['Squads'],
  endpoints: (builder) => ({
    searchSquadList: builder.query({
      queryFn: serviceQueryFactory(searchSquadList),
      providesTags: ['Squads'],
    }),
    searchOrganisationDivisionList: builder.query({
      queryFn: serviceQueryFactory(searchOrganisationDivisionList),
    }),
    fetchSquadSettings: builder.query({
      queryFn: serviceQueryFactory(fetchSquadSettings),
      providesTags: ['Squads'],
    }),
    createSquad: builder.mutation({
      queryFn: serviceQueryFactory((squad) => createSquad(squad)),
      invalidatesTags: ['Squads'],
    }),
  }),
});

export const {
  useSearchSquadListQuery,
  useSearchOrganisationDivisionListQuery,
  useFetchSquadSettingsQuery,
  useCreateSquadMutation,
} = squadManagementApi;

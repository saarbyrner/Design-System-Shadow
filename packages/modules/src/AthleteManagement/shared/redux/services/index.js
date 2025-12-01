// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import { getActiveSquad } from '@kitman/services';
import { bulkUpdateAthleteLabels } from '@kitman/services/src/services/dynamicCohorts';
import getNonCompliantAthletes from './api/getNonCompliantAthletes';
import sendNotifications from './api/sendNotifications';
import fetchAdministrationAthletes from './api/fetchAdministrationAthletes';
import { bulkAssignAthleteSquads } from './api/bulkAssignAthleteSquads';
import { bulkUpdatePrimarySquad } from './api/bulkUpdatePrimarySquad';
import { bulkUpdateActiveStatus } from './api/bulkUpdateActiveStatus';
import { bulkUpdateAthleteAvailabilityStatus } from './api/bulkUpdateAthleteAvailabilityStatus';

const TAGS = {
  ATHLETE_LIST: 'ATHLETE_LIST',
  ATHLETE: 'ATHLETE',
};

const invalidateSearch = async (_, { queryFulfilled }) => {
  await queryFulfilled;
};

export const athleteManagementApi = createApi({
  reducerPath: 'athleteManagementApi',
  tagTypes: [TAGS.ATHLETE_LIST, TAGS.ATHLETE],
  endpoints: (builder) => ({
    getNonCompliantAthletes: builder.query({
      queryFn: serviceQueryFactory(getNonCompliantAthletes),
    }),
    getActiveSquad: builder.query({
      queryFn: serviceQueryFactory(getActiveSquad),
    }),
    // TODO: This uses a legacy endpoint which returns { athletes: [], meta: {}}
    // Going forward, we'll need to rename the athletes to data
    fetchAdministrationAthletes: builder.query({
      queryFn: serviceQueryFactory(fetchAdministrationAthletes),
      providesTags: [TAGS.ATHLETE_LIST],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems) => {
        // eslint-disable-next-line no-param-reassign
        currentCache.meta = newItems.meta;
        if (newItems.meta.current_page === 1) {
          // eslint-disable-next-line no-param-reassign
          currentCache.athletes = newItems.athletes;
        } else currentCache.athletes.push(...newItems.athletes);
      },
    }),
    sendNotifications: builder.mutation({
      queryFn: serviceQueryFactory(sendNotifications),
    }),
    bulkAssignAthleteSquads: builder.mutation({
      queryFn: serviceQueryFactory(bulkAssignAthleteSquads),
      onQueryStarted: invalidateSearch,
    }),
    bulkUpdatePrimarySquad: builder.mutation({
      queryFn: serviceQueryFactory(bulkUpdatePrimarySquad),
      onQueryStarted: invalidateSearch,
    }),
    bulkUpdateActiveStatus: builder.mutation({
      queryFn: serviceQueryFactory(bulkUpdateActiveStatus),
      onQueryStarted: invalidateSearch,
    }),
    bulkUpdateAthleteLabels: builder.mutation({
      queryFn: serviceQueryFactory(bulkUpdateAthleteLabels),
    }),
    bulkUpdateAthleteAvailabilityStatus: builder.mutation({
      queryFn: serviceQueryFactory(bulkUpdateAthleteAvailabilityStatus),
    }),
  }),
});

export const {
  useGetNonCompliantAthletesQuery,
  useSendNotificationsQuery,
  useFetchAdministrationAthletesQuery,
  useGetActiveSquadQuery,
  useBulkAssignAthleteSquadsMutation,
  useBulkUpdatePrimarySquadMutation,
  useBulkUpdateActiveStatusMutation,
  useBulkUpdateAthleteLabelsMutation,
  useBulkUpdateAthleteAvailabilityStatusMutation,
} = athleteManagementApi;

// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import fetchUserData from '@kitman/services/src/services/fetchUserData';

import { getPositionGroups, getDivisions } from '@kitman/services';
import searchMovementOrganisationsList from './api/searchMovementOrganisationsList';

import searchAthletes from './api/searchAthletes';
import postMovementRecord from './api/postMovementRecord';
import searchAvailableSquads from './api/searchAvailableSquads';
import createMovementRecord from './api/createMovementRecord';
import postMovementRecordHistory from './api/postMovementRecordHistory';

export const TAGS = {
  ORGANISATION_LIST: 'ORGANISATION_LIST',
  USER_DETAILS: 'USER_DETAILS',
  SEARCH_ATHLETES: 'SEARCH_ATHLETES',
  TRANSFERRABLE_OPTIONS: 'TRANSFERRABLE_OPTIONS',
  AVAILABLE_SQUADS: 'AVAILABLE_SQUADS',
  MOVEMENT_HISTORY: 'MOVEMENT_HISTORY',
  POSITION_GROUPS: 'POSITION_GROUPS',
  DIVISIONS: 'DIVISIONS',
};

export const REDUCER_PATH = 'UserMovement.services';

export const userMovementApi = createApi({
  reducerPath: REDUCER_PATH,
  tagTypes: Object.keys(TAGS),
  endpoints: (builder) => ({
    searchMovementOrganisationsList: builder.query({
      queryFn: serviceQueryFactory(searchMovementOrganisationsList),
      providesTags: [TAGS.ORGANISATION_LIST],
    }),
    searchAvailableSquads: builder.query({
      queryFn: serviceQueryFactory(searchAvailableSquads),
      providesTags: [TAGS.AVAILABLE_SQUADS],
    }),
    searchAthletes: builder.query({
      queryFn: serviceQueryFactory(searchAthletes),
      providesTags: [TAGS.SEARCH_ATHLETES],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems) => {
        // eslint-disable-next-line no-param-reassign
        currentCache.meta = newItems.meta;
        if (newItems.meta.current_page === 1) {
          // eslint-disable-next-line no-param-reassign
          currentCache.data = newItems.data;
        } else {
          // This will prevent pushing duplicate values
          // Iterate over each item in newItems.data
          // Find the index of the item in currentCache.data that has the same id as newItem
          // If the item exists in the cache, update it with newItem
          // If the item does not exist in the cache, add it to the cache
          newItems.data.forEach((newItem) => {
            const index = currentCache.data.findIndex(
              (item) => item.id === newItem.id
            );
            if (index !== -1) {
              // eslint-disable-next-line no-param-reassign
              currentCache.data[index] = newItem;
            } else {
              currentCache.data.push(newItem);
            }
          });
        }
      },
    }),
    fetchUserData: builder.query({
      queryFn: serviceQueryFactory(fetchUserData),
      providesTags: [TAGS.USER_DETAILS],
      invalidatesTags: [TAGS.AVAILABLE_SQUADS, TAGS.TRANSFERRABLE_OPTIONS],
    }),
    createMovementRecord: builder.mutation({
      queryFn: serviceQueryFactory(createMovementRecord),
      invalidatesTags: [
        TAGS.ORGANISATION_LIST,
        TAGS.USER_DETAILS,
        TAGS.TRANSFERRABLE_OPTIONS,
        TAGS.AVAILABLE_SQUADS,
        TAGS.MOVEMENT_HISTORY,
        TAGS.POSITION_GROUPS,
        TAGS.DIVISIONS,
      ],
    }),
    postMovementRecordHistory: builder.query({
      queryFn: serviceQueryFactory(postMovementRecordHistory),
      providesTags: [TAGS.MOVEMENT_HISTORY],
      invalidatesTags: Object.keys(TAGS),
    }),
    /**
     * @deprecated
     * Only in use by the medical trial flow which will be removed once the generic flow is done
     */
    postMovementRecord: builder.mutation({
      queryFn: serviceQueryFactory(postMovementRecord),
      invalidatesTags: Object.keys(TAGS),
    }),
    getPositionGroups: builder.query({
      queryFn: serviceQueryFactory(getPositionGroups),
      invalidatesTags: [TAGS.POSITION_GROUPS],
    }),
    getDivisions: builder.query({
      queryFn: serviceQueryFactory(getDivisions),
      invalidatesTags: [TAGS.DIVISIONS],
    }),
  }),
});

export const {
  useSearchMovementOrganisationsListQuery,
  useFetchUserDataQuery,
  useSearchAthletesQuery,
  useLazySearchAthletesQuery,
  usePostMovementRecordMutation,
  useSearchAvailableSquadsQuery,
  useCreateMovementRecordMutation,
  usePostMovementRecordHistoryQuery,
  usePostMovementRecordHistoryMutation,
  useGetPositionGroupsQuery,
  useGetDivisionsQuery,
} = userMovementApi;

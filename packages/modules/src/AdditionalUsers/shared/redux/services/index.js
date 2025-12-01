// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import searchAdditionalUsers from './api/searchAdditionalUsers';
import fetchAdditionalUser from './api/fetchAdditionalUser';
import updateAdditionalUser from './api/updateAdditionalUser';
import createAdditionalUser from './api/createAdditionalUser';

export const REDUCER_KEY = 'additionalUsersAPI';

export const additionalUsersAPI = createApi({
  reducerPath: REDUCER_KEY,
  tagTypes: ['ADDITIONAL_USERS_LIST', 'ADDITIONAL_USER'],
  endpoints: (builder) => ({
    searchAdditionalUsers: builder.query({
      queryFn: serviceQueryFactory(searchAdditionalUsers),
      providesTags: ['ADDITIONAL_USERS_LIST'],
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
        } else currentCache.data.push(...newItems.data);
      },
    }),
    fetchAdditionalUser: builder.query({
      queryFn: serviceQueryFactory((id) => fetchAdditionalUser(id)),
      providesTags: ['ADDITIONAL_USER'],
    }),
    createAdditionalUser: builder.mutation({
      queryFn: serviceQueryFactory(createAdditionalUser),
      invalidatesTags: ['ADDITIONAL_USERS_LIST', 'ADDITIONAL_USER'],
    }),
    updateAdditionalUser: builder.mutation({
      queryFn: serviceQueryFactory(updateAdditionalUser),
      invalidatesTags: ['ADDITIONAL_USERS_LIST', 'ADDITIONAL_USER'],
    }),
  }),
});

export const {
  useSearchAdditionalUsersQuery,
  useFetchAdditionalUserQuery,
  useCreateAdditionalUserMutation,
  useUpdateAdditionalUserMutation,
} = additionalUsersAPI;

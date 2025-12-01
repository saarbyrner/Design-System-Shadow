// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import fetchStaffProfile from '@kitman/modules/src/StaffProfile/shared/redux/services/api/fetchStaffProfile';
import createStaffProfile from '@kitman/modules/src/StaffProfile/shared/redux/services/api/createStaffProfile';
import updateStaffProfile from '@kitman/modules/src/StaffProfile/shared/redux/services/api/updateStaffProfile';
import updateUserStatus, {
  type UpdateUserStatusRequestBody,
} from '@kitman/modules/src/StaffProfile/shared/redux/services/api/updateUserStatus';

const TAGS = {
  STAFF_PROFILE: 'STAFF_PROFILE',
};

export const staffProfileApi = createApi({
  reducerPath: 'staffProfileApi',
  tagTypes: [TAGS.STAFF_PROFILE],
  endpoints: (builder) => ({
    fetchStaffProfile: builder.query({
      queryFn: serviceQueryFactory((id) => fetchStaffProfile(id)),
      providesTags: [TAGS.STAFF_PROFILE],
    }),
    createStaffProfile: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        createStaffProfile(requestProps)
      ),
    }),
    updateStaffProfile: builder.mutation({
      queryFn: serviceQueryFactory((requestProps) =>
        updateStaffProfile(requestProps)
      ),
    }),
    updateUserStatus: builder.mutation({
      queryFn: serviceQueryFactory(
        ({
          userId,
          requestBody,
        }: {
          userId: number,
          requestBody: UpdateUserStatusRequestBody,
        }) => updateUserStatus(userId, requestBody)
      ),
    }),
  }),
});

export const {
  useFetchStaffProfileQuery,
  useCreateStaffProfileMutation,
  useUpdateStaffProfileMutation,
  useUpdateUserStatusMutation,
} = staffProfileApi;

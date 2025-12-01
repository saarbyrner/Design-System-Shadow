// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchPermissionsDetails from '@kitman/services/src/services/permissions/redux/services/api/fetchPermissionsDetails';
import updatePermissionsDetails from '@kitman/services/src/services/permissions/redux/services/api/updatePermissionsDetails';

const TAGS = {
  PERMISSIONS: 'PERMISSIONS',
};

export const permissionsDetailsApi = createApi({
  reducerPath: 'permissionsDetailsApi',
  tagTypes: [TAGS.PERMISSIONS],
  endpoints: (builder) => ({
    fetchPermissionsDetails: builder.query({
      queryFn: serviceQueryFactory((staffId) =>
        fetchPermissionsDetails(staffId)
      ),
      providesTags: [TAGS.PERMISSIONS],
    }),
    updatePermissionsDetails: builder.mutation({
      queryFn: serviceQueryFactory(({ staffId, requestBody }) =>
        updatePermissionsDetails(staffId, requestBody)
      ),
      providesTags: [TAGS.PERMISSIONS],
    }),
  }),
});

export const {
  useFetchPermissionsDetailsQuery,
  useUpdatePermissionsDetailsMutation,
} = permissionsDetailsApi;

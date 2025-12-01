// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getContactRoles, deleteContact } from '@kitman/services';

export const getContactRolesApi = createApi({
  reducerPath: 'contactsApi',
  endpoints: (builder) => ({
    getContactRoles: builder.query({
      queryFn: serviceQueryFactory(getContactRoles),
    }),
    deleteContact: builder.mutation({
      queryFn: serviceQueryFactory(deleteContact),
    }),
  }),
});

export const { useGetContactRolesQuery, useDeleteContactMutation } =
  getContactRolesApi;

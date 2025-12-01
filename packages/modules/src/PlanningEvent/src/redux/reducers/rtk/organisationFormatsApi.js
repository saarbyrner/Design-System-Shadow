// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { getOrganisationFormats } from '@kitman/services';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';

export const organisationFormatsApi = createApi({
  reducerPath: 'organisationFormatsApi',
  endpoints: (builder) => ({
    getOrganisationFormats: builder.query<Array<OrganisationFormat>>({
      queryFn: serviceQueryFactory(() => getOrganisationFormats()),
    }),
  }),
});

export const { useGetOrganisationFormatsQuery } = organisationFormatsApi;

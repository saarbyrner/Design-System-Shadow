// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { leagueOperationsApi } from './leagueOperations';
import { TAGS } from './utils';

import fetchApplicationStatuses from '../../services/fetchApplicationStatuses';
import filterByRegistrationStatus from '../../services/filterByRegistrationStatus';
import fetchSectionStatuses from '../../services/fetchSectionStatuses';

export const registrationStatusesApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchApplicationStatuses: builder.query({
      queryFn: serviceQueryFactory(fetchApplicationStatuses),
      providesTags: [TAGS.REGISTRATION_STATUS],
      keepUnusedDataFor: 0,
    }),
    filterByRegistrationStatus: builder.query({
      queryFn: serviceQueryFactory(filterByRegistrationStatus),
      providesTags: [TAGS.REGISTRATION_STATUS_FILTERS],
      keepUnusedDataFor: 0,
    }),
    fetchSectionStatuses: builder.query({
      queryFn: serviceQueryFactory(fetchSectionStatuses),
      providesTags: [TAGS.SECTION_STATUSES],
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const {
  useFetchApplicationStatusesQuery,
  useFilterByRegistrationStatusQuery,
  useFetchSectionStatusesQuery,
} = registrationStatusesApi;

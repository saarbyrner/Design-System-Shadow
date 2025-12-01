// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { leagueOperationsApi } from './leagueOperations';
import fetchOrganisation from '../../services/fetchOrganisation';
import { TAGS } from './utils';

export const registrationOrganisationApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegistrationOrganisation: builder.query({
      queryFn: serviceQueryFactory(fetchOrganisation),
      providesTags: [TAGS.REGISTRATION_ORGANISATION],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchRegistrationOrganisationQuery } =
  registrationOrganisationApi;

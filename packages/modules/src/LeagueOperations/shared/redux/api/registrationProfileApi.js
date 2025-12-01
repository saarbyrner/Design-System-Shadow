// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { leagueOperationsApi } from './leagueOperations';
import fetchRegistrationProfile from '../../services/fetchRegistrationProfile';
import { TAGS } from './utils';

export const registrationProfileApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegistrationProfile: builder.query({
      queryFn: serviceQueryFactory((id) => fetchRegistrationProfile(id)),
      providesTags: [TAGS.REGISTRATION_PROFILE],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchRegistrationProfileQuery } = registrationProfileApi;

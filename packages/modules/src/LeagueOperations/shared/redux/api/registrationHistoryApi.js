// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchRegistrationHistory from '../../services/fetchRegistrationHistory';
import { leagueOperationsApi } from './leagueOperations';
import { TAGS } from './utils';

export const registrationHistoryApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchRegistrationHistory: builder.query({
      queryFn: serviceQueryFactory(fetchRegistrationHistory),
      providesTags: [TAGS.REGISTRATION_HISTORY],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchRegistrationHistoryQuery } = registrationHistoryApi;

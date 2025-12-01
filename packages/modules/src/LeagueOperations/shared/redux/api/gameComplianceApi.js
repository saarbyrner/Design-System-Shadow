// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import fetchGameComplianceInfo from '@kitman/modules/src/LeagueOperations/shared/services/fetchGameComplianceInfo';
import { leagueOperationsApi } from './leagueOperations';

const TAGS = {
  GAME_COMPLIANCE: 'GAME_COMPLIANCE',
};

export const gameComplianceApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchGameComplianceInfo: builder.query({
      queryFn: serviceQueryFactory(fetchGameComplianceInfo),
      providesTags: [TAGS.GAME_COMPLIANCE],
    }),
  }),
  overrideExisting: false,
});

export const { useFetchGameComplianceInfoQuery } = gameComplianceApi;

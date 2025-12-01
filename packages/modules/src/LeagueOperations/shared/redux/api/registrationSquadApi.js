// @flow
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { leagueOperationsApi } from './leagueOperations';

import fetchSquad from '../../services/fetchSquad';

export const registrationSquadApi = leagueOperationsApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchSquad: builder.query({
      queryFn: serviceQueryFactory((id) => fetchSquad(id)),
    }),
  }),
  overrideExisting: false,
});

export const { useFetchSquadQuery } = registrationSquadApi;

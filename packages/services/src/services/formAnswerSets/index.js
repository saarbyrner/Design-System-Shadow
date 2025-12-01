// @flow
import { createApi } from '@reduxjs/toolkit/query/react';

import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { searchFormAnswerSets } from './api';
import getFormAnswerSetsAthletes from './api/getFormAnswerSetsAthletes';
import searchFreeAgents from './api/searchFreeAgents';
import searchFormAnswerSetsByAthlete from './api/searchByAthlete';

export const reducerPath = 'formAnswerSetsApi';

export const formAnswerSetsApi = createApi({
  reducerPath,
  endpoints: (builder) => ({
    searchFormAnswerSets: builder.query({
      queryFn: serviceQueryFactory(searchFormAnswerSets),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getFormAnswerSetsAthletes: builder.query({
      queryFn: serviceQueryFactory(getFormAnswerSetsAthletes),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    searchFreeAgentFormAnswerSets: builder.query({
      queryFn: serviceQueryFactory(searchFreeAgents),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    searchFormAnswerSetsByAthlete: builder.query({
      queryFn: serviceQueryFactory(searchFormAnswerSetsByAthlete),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {
  useSearchFormAnswerSetsQuery,
  useGetFormAnswerSetsAthletesQuery,
  useSearchFreeAgentFormAnswerSetsQuery,
  useSearchFormAnswerSetsByAthleteQuery,
} = formAnswerSetsApi;

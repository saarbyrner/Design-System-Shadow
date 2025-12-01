// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import {
  getBenchmarkingClubs,
  getBenchmarkingWindows,
  getBenchmarkingSeasons,
  getBenchmarkingResults,
  submitBenchmarkTestValidations,
} from '@kitman/services/src/services/benchmarking';

export const benchmarkTestValidationApi = createApi({
  reducerPath: 'benchmarkTestValidationApi',
  endpoints: (builder) => ({
    getBenchmarkingClubs: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkingClubs),
    }),
    getBenchmarkingWindows: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkingWindows),
    }),
    getBenchmarkingSeasons: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkingSeasons),
    }),
    getBenchmarkingResults: builder.query({
      queryFn: serviceQueryFactory(({ org, window, season }) =>
        getBenchmarkingResults(org, window, season)
      ),
    }),
    submitBenchmarkTestValidations: builder.query({
      queryFn: serviceQueryFactory(
        ({ org, window, season, validatedMetrics }) =>
          submitBenchmarkTestValidations(org, window, season, validatedMetrics)
      ),
    }),
  }),
});

export const resetApiState = () =>
  benchmarkTestValidationApi.util.resetApiState();

export const {
  useGetBenchmarkingClubsQuery,
  useGetBenchmarkingWindowsQuery,
  useGetBenchmarkingSeasonsQuery,
  useGetBenchmarkingResultsQuery,
  useLazyGetBenchmarkingResultsQuery,
  useLazySubmitBenchmarkTestValidationsQuery,
} = benchmarkTestValidationApi;

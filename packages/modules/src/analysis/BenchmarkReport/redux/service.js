// @flow
import { getSquadAthletes, getPositionGroups } from '@kitman/services';
import {
  getBenchmarkTests,
  getBenchmarkingSeasons,
  getBenchmarkingWindows,
  getBenchmarkAgeGroups,
  getBenchmarkMaturationStatuses,
  getBenchmarkReport,
} from '@kitman/services/src/services/benchmarking';
import { type GetBenchmarkReportParams } from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';

import { sortBenchmarkReport } from './utils';

const defaultBenchmarkReportParams: GetBenchmarkReportParams = {
  training_variable_ids: [],
  seasons: [],
  testing_window_ids: [],
  age_group_ids: [],
  bio_band_range: DEFAULT_BIO_BAND_RANGE,
  maturation_status_ids: [],
  position_ids: [],
  national_results: true,
  club_results: false,
  compare_to: {
    athlete_ids: [],
    seasons: [],
    testing_window_ids: [],
  },
};

export const benchmarkReportApi = createApi({
  reducerPath: 'benchmarkReportApi',
  endpoints: (builder) => ({
    getBenchmarkTests: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkTests),
    }),
    getSeasons: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkingSeasons),
    }),
    getTestingWindows: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkingWindows),
    }),
    getAgeGroups: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkAgeGroups),
    }),
    getMaturationStatuses: builder.query({
      queryFn: serviceQueryFactory(getBenchmarkMaturationStatuses),
    }),
    getPositionGroups: builder.query({
      queryFn: serviceQueryFactory(getPositionGroups),
    }),
    getAllSquadAthletes: builder.query({
      queryFn: serviceQueryFactory(getSquadAthletes),
    }),
    getBenchmarkReport: builder.query({
      queryFn: serviceQueryFactory(
        async (
          params: GetBenchmarkReportParams = defaultBenchmarkReportParams
        ) => {
          if (
            window.getFlag('bm-testing-fe-side-performance-optimization')
          ) {
            const allData = Promise.all(
              params.training_variable_ids.map((id) =>
                getBenchmarkReport({
                  ...params,
                  training_variable_ids: [id],
                })
              )
            );
            return (await allData).flatMap((d) => d.sort(sortBenchmarkReport));
          }

          return (await getBenchmarkReport(params)).sort(sortBenchmarkReport);
        }
      ),
    }),
  }),
});

export const {
  useGetBenchmarkTestsQuery,
  useGetSeasonsQuery,
  useGetTestingWindowsQuery,
  useGetAgeGroupsQuery,
  useGetMaturationStatusesQuery,
  useGetAllSquadAthletesQuery,
  useGetBenchmarkReportQuery,
  useGetPositionGroupsQuery,
} = benchmarkReportApi;

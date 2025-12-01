// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';

import fetchMatchMonitorReport from './api/fetchMatchMonitorReport';
import saveMatchMonitorReport from './api/saveMatchMonitorReport';

export const REDUCER_KEY = 'matchMonitorReportAPI';

export const matchMonitorReportAPI = createApi({
  reducerPath: REDUCER_KEY,
  tagTypes: ['MATCH_MONITOR_REPORT'],
  endpoints: (builder) => ({
    fetchMatchMonitorReport: builder.query({
      queryFn: serviceQueryFactory((eventId) =>
        fetchMatchMonitorReport(eventId)
      ),
      providesTags: ['MATCH_MONITOR_REPORT'],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),
    saveMatchMonitorReport: builder.mutation({
      queryFn: serviceQueryFactory(({ id, matchReport }) =>
        saveMatchMonitorReport(id, matchReport)
      ),
      invalidatesTags: ['MATCH_MONITOR_REPORT'],
    }),
  }),
});

export const {
  useFetchMatchMonitorReportQuery,
  useSaveMatchMonitorReportMutation,
} = matchMonitorReportAPI;

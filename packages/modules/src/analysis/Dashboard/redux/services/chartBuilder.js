// @flow
import { createApi } from '@reduxjs/toolkit/query/react';
import serviceQueryFactory from '@kitman/common/src/utils/serviceQueryFactory';
import validateResponseWithRetry from '@kitman/common/src/utils/serviceQueryPolling';

import {
  addChartElement,
  addWidget,
  updateWidget,
  deleteChartElement,
  getData,
  getGroupings,
  updateChartElement,
} from '@kitman/services/src/services/analysis';

export const chartBuilderApi = createApi({
  reducerPath: 'chartBuilderApi',
  endpoints: (builder) => ({
    addChartWidget: builder.mutation({
      queryFn: serviceQueryFactory((args) => addWidget(args)),
    }),
    updateChartWidget: builder.mutation({
      queryFn: serviceQueryFactory((...args) => updateWidget(...args)),
    }),
    getData: builder.query({
      queryFn: (args) =>
        window.getFlag('rep-charts-v2-caching')
          ? validateResponseWithRetry(serviceQueryFactory(getData), args)
          : getData(args),
    }),
    saveChartElement: builder.mutation({
      queryFn: serviceQueryFactory((args) => addChartElement(args)),
    }),
    saveUpdateChartElement: builder.mutation({
      queryFn: serviceQueryFactory((args) => updateChartElement(args)),
    }),
    removeChartElement: builder.mutation({
      queryFn: serviceQueryFactory((args) => deleteChartElement(args)),
    }),
    getAllGroupings: builder.query({
      queryFn: serviceQueryFactory(getGroupings),
    }),
  }),
});

export const {
  useAddChartWidgetMutation,
  useUpdateChartWidgetMutation,
  useGetDataQuery,
  useGetAllGroupingsQuery,
  useSaveChartElementMutation,
  useSaveUpdateChartElementMutation,
  useRemoveChartElementMutation,
} = chartBuilderApi;

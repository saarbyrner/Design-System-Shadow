// @flow
import type {
  ChartTypeEventData,
  TableTypeEventData,
  ChartDataSourceData,
  ChartDataSourceParams,
  FormulaDataSourcesData,
  DashboardCacheRefreshData,
  DashboardCacheRefreshParams,
  WidgetCacheRefreshData,
  WidgetCacheRefreshParams,
  SeriesData,
} from '@kitman/common/src/utils/TrackingData/src/types/analysis';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import {
  DATA_SOURCE_TYPES,
  MEDICAL_DATA_SOURCES_TYPES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import { NOT_APPLICABLE } from '@kitman/common/src/utils/TrackingData/src/data/analysis/constants';

export const mockChartTypeEventData: ChartTypeEventData = {
  chartType: 'xy',
};

export const mockTableTypeEventData: TableTypeEventData = {
  tableType: 'SCORECARD',
};

export const mockChartDataSourceParams: ChartDataSourceParams = {
  source: 'formula',
  subtypeId: 1,
};

export const mockChartDataSourceData: ChartDataSourceData = {
  Source: 'Formula',
  Subtype: 'Percentage',
};

export const mockFormulaDataSourceData: FormulaDataSourcesData = {
  Sources: [
    MEDICAL_DATA_SOURCES_TYPES.medicalInjury,
    DATA_SOURCE_TYPES.tableMetric,
  ],
};

export const mockFormulaInputParams = {
  A: {
    data_source_type: MEDICAL_DATA_SOURCES_TYPES.medicalInjury,
  },
  B: {
    data_source_type: DATA_SOURCE_TYPES.tableMetric,
  },
};

export const mockWidgetCacheRefreshParams: WidgetCacheRefreshParams = {
  dashboardId: 31086,
  widgetId: 397008,
};

export const mockWidgetCacheRefreshData: WidgetCacheRefreshData = {
  DashboardId: 31086,
  WidgetId: 397008,
};

export const mockDashboardCacheRefreshParams: DashboardCacheRefreshParams = {
  dashboardId: 31086,
};

export const mockDashboardCacheRefreshData: DashboardCacheRefreshData = {
  DashboardId: 31086,
};

export const mockSeriesData: SeriesData = {
  Visualisation: 'line',
  ChartType: CHART_TYPE.xy,
  Population: ['labels'],
  Groupings: ['squad', 'position'],
  TimePeriod: 'yesterday',
  Axis: 'left',
};

export const mockValueData: SeriesData = {
  Visualisation: NOT_APPLICABLE,
  ChartType: CHART_TYPE.value,
  Population: ['labels'],
  Groupings: NOT_APPLICABLE,
  TimePeriod: 'yesterday',
  Axis: 'left',
};

export default {
  mockChartTypeEventData,
  mockTableTypeEventData,
  mockFormulaInputParams,
};

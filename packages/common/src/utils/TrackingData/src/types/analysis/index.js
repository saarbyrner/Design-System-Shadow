// @flow
import type { CoreChartType } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import type { TableWidgetType } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type {
  FormulaSubtype,
  DataSource,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import type { AxisConfig } from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import { type VisualisationType } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/types';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';

export type ChartTypeEventParams = {
  chartType: CoreChartType,
};

export type ChartTypeEventData = {
  chartType: CoreChartType,
};

export type TableTypeEventParams = {
  tableType: TableWidgetType,
};

export type TableTypeEventData = {
  tableType: TableWidgetType,
};

export type ChartDataSourceParams = {
  source: DataSource,
  subtypeId?: number,
};

export type ChartDataSourceData = {
  Source: DataSource,
  Subtype?: FormulaSubtype,
};

export type FormulaDataSourcesData = {
  Sources: Array<DataSource>,
};

export type SeriesDataParams = {
  seriesType?: VisualisationType,
  chartType: CoreChartType,
  population: SquadAthletesSelection,
  groupings?: Array<string>,
  timePeriod: string,
  axisConfig?: AxisConfig,
};

export type SeriesData = {
  Visualisation: VisualisationType | string,
  ChartType: CoreChartType,
  Population: Array<string>,
  Groupings: Array<string> | string,
  TimePeriod: string,
  Axis?: AxisConfig,
};

export type WidgetCacheRefreshParams = {
  dashboardId: number,
  widgetId: number,
};
export type WidgetCacheRefreshData = {
  DashboardId: number,
  WidgetId: number,
};

export type DashboardCacheRefreshParams = {
  dashboardId: number,
};
export type DashboardCacheRefreshData = {
  DashboardId: number,
};

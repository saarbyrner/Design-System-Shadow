// @flow
import type {
  ChartTypeEventParams,
  ChartTypeEventData,
  ChartDataSourceParams,
  ChartDataSourceData,
  SeriesDataParams,
  SeriesData,
} from '@kitman/common/src/utils/TrackingData/src/types/analysis';
import { FORMULA_SUBTYPES } from '@kitman/modules/src/analysis/shared/constants';
import {
  getMixpanelDataSourceLabel,
  getPopulationKeys,
} from '@kitman/modules/src/analysis/shared/utils';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import { NOT_APPLICABLE } from './constants';

const chartTypeLabels = {
  [CHART_TYPE.value]: 'Add Value Viz',
  [CHART_TYPE.xy]: 'Add XY Chart',
  [CHART_TYPE.pie]: 'Add Pie Chart',
  [CHART_TYPE.radial]: 'Add Radial Chart',
};

export const getChartType = ({
  chartType,
}: ChartTypeEventParams): ChartTypeEventData => {
  return {
    chartType,
  };
};

export const getChartDataSource = ({
  source,
  subtypeId,
}: ChartDataSourceParams): ChartDataSourceData => {
  const subtype =
    subtypeId === 1 ? FORMULA_SUBTYPES.percentage : FORMULA_SUBTYPES.baseline;

  return {
    Source: getMixpanelDataSourceLabel(source),
    ...(subtypeId && { Subtype: subtype }),
  };
};

export const getChartTypeLabel = ({
  chartType,
}: ChartTypeEventParams): string => {
  return chartTypeLabels[chartType];
};

export const getChartData = ({
  seriesType,
  chartType,
  population,
  groupings,
  timePeriod,
  axisConfig,
}: SeriesDataParams): SeriesData => {
  if (!chartType) {
    return {};
  }

  return {
    Visualisation: seriesType || NOT_APPLICABLE,
    ChartType: chartType,
    Population: getPopulationKeys(population),
    Groupings: groupings || NOT_APPLICABLE,
    TimePeriod: timePeriod,
    Axis: axisConfig,
  };
};

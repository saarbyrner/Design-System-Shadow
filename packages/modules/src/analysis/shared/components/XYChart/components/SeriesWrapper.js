// @flow

import { useEffect, type Node } from 'react';
import type {
  ChartOptionTypes,
  SortConfig,
  AggregateValues,
  DefaultSortFunction,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';

import useChartContext from '../hooks/useChartContext';
import type {
  ValueAccessor,
  ValueFormatter,
  CategoryAccessor,
  SeriesDataType,
  SeriesType,
  AggregatePeriod,
  RenderSeriesType,
  AxisConfig,
} from '../types';

export type CommonSeriesProps = {|
  id: string | number,
  data: Array<Object>,
  type: SeriesType,
  categoryAccessor: CategoryAccessor,
  valueAccessor: ValueAccessor,
  valueFormatter: ValueFormatter,
  isGrouped?: boolean,
  renderAs?: RenderSeriesType,
  axisConfig: AxisConfig,
  axisLabel: string,
  primaryAxis: AxisConfig,
|};

type Props = {|
  ...CommonSeriesProps,
  children: Node,
  dataType: SeriesDataType,
  showAggregatorSelector?: boolean,
  aggregateValues?: AggregateValues,
  chartOptions: ChartOptionTypes,
  sortConfig?: SortConfig,
  defaultSortFunction?: ?DefaultSortFunction,
  onChangeAggregatePeriod?: (chartId: string, key: AggregatePeriod) => void,
  name: string,
|};

function SeriesWrapper(props: Props) {
  const { series, destroySeries, registerSeries, updateSeries } =
    useChartContext();

  useEffect(() => {
    registerSeries(props.id, {
      categoryAccessor: props.categoryAccessor,
      valueAccessor: props.valueAccessor,
      valueFormatter: props.valueFormatter,
      data: props.data,
      dataType: props.dataType,
      type: props.type,
      aggregateValues: props.aggregateValues,
      showAggregatorSelector: props.showAggregatorSelector,
      onChangeAggregatePeriod: props.onChangeAggregatePeriod,
      isGrouped: props.isGrouped,
      renderAs: props.renderAs,
      axisConfig: props.axisConfig,
      chartOptions: props.chartOptions,
      sortConfig: props.sortConfig,
      defaultSortFunction: props.defaultSortFunction,
      name: props.name,
      axisLabel: props.axisLabel,
      primaryAxis: props.primaryAxis,
    });

    return () => {
      destroySeries(props.id);
    };
  }, [props.id]);

  useEffect(() => {
    updateSeries(props.id, {
      categoryAccessor: props.categoryAccessor,
      valueAccessor: props.valueAccessor,
      data: props.data,
      type: props.type,
      valueFormatter: props.valueFormatter,
      aggregateValues: props.aggregateValues,
      showAggregatorSelector: props.showAggregatorSelector,
      isGrouped: props.isGrouped,
      renderAs: props.renderAs,
      axisConfig: props.axisConfig,
      chartOptions: props.chartOptions,
      sortConfig: props.sortConfig,
      defaultSortFunction: props.defaultSortFunction,
      name: props.name,
      axisLabel: props.axisLabel,
      primaryAxis: props.primaryAxis,
    });
  }, [
    props.id,
    props.data,
    props.type,
    props.aggregateValues,
    props.isGrouped,
    props.renderAs,
    props.showAggregatorSelector,
    props.axisConfig,
    props.chartOptions,
    props.sortConfig,
    props.defaultSortFunction,
    props.axisLabel,
    props.primaryAxis,
  ]);

  // will only render children if series is registered
  if (!series[`${props.id}`]) return null;

  return props.children;
}

export default SeriesWrapper;

// @flow

import type {
  ChartOptionTypes,
  AggregateValues,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type { CommonSeriesProps } from './SeriesWrapper';
import type { AggregatePeriod } from '../types';

import SeriesWrapper from './SeriesWrapper';
import SeriesRender from './SeriesRender';
import SeriesGroup from './SeriesGroup';
import { aggregateByTimePeriod } from '../utils';
import { AGGREGATE_PERIOD } from '../constants';

type Props = {|
  ...CommonSeriesProps,
  showLabels?: boolean,
  showAggregatorSelector: boolean,
  aggregateValues: AggregateValues,
  chartOptions: ChartOptionTypes,
  onChangeAggregatePeriod: (chartId: string, key: AggregatePeriod) => void,
  name: string,
  axisLabel: string,
|};

function DateTimeSeries(props: Props) {
  const { aggregatePeriod, aggregateMethod } = props.aggregateValues;

  const assignAggregation = (data) => {
    return aggregatePeriod === AGGREGATE_PERIOD.daily
      ? data
      : aggregateByTimePeriod(data, aggregatePeriod, aggregateMethod);
  };

  const updatedData = props.isGrouped
    ? props.data
    : assignAggregation(props.data);

  const seriesProps = {
    categoryAccessor: props.categoryAccessor,
    valueAccessor: props.valueAccessor,
    // Fill missing data was added as part of REP-1942. Based on feedback, this should not
    // be the default behaviour waiting for REP-1949 for this to be exposed as a
    // selected behaviour
    // data: fillMissingDates(updatedData, props.aggregateValues.aggregatePeriod),
    data: updatedData,
  };

  return (
    <SeriesWrapper
      dataType="time"
      type={props.type}
      id={props.id}
      valueFormatter={props.valueFormatter}
      aggregateValues={props.aggregateValues}
      showAggregatorSelector={props.showAggregatorSelector}
      onChangeAggregatePeriod={props.onChangeAggregatePeriod}
      isGrouped={props.isGrouped}
      renderAs={props.renderAs}
      axisConfig={props.axisConfig}
      name={props.name}
      {...seriesProps}
      chartOptions={props.chartOptions}
      axisLabel={props.axisLabel}
      primaryAxis={props.primaryAxis}
    >
      {props.isGrouped && props.renderAs && (
        <SeriesGroup
          dataType="time"
          type={props.type}
          categoryAccessor={props.categoryAccessor}
          valueAccessor={props.valueAccessor}
          valueFormatter={props.valueFormatter}
          data={props.data}
          processSeriesData={assignAggregation}
          id={props.id}
          renderAs={props.renderAs}
          axisConfig={props.axisConfig}
          showLabels={props.showLabels}
          axisLabel={props.axisLabel}
          primaryAxis={props.primaryAxis}
        />
      )}
      {!props.isGrouped && (
        <SeriesRender
          dataType="time"
          type={props.type}
          id={props.id}
          valueFormatter={props.valueFormatter}
          showLabels={props.showLabels}
          axisConfig={props.axisConfig}
          axisLabel={props.axisLabel}
          primaryAxis={props.primaryAxis}
          {...seriesProps}
        />
      )}
    </SeriesWrapper>
  );
}

export default DateTimeSeries;

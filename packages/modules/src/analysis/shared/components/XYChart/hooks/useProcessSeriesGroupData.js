// @flow
import type {
  SummaryValueDataShape,
  // GroupedSummaryValueDataShape,
} from '@kitman/modules/src/analysis/shared/types/charts';
import { mapSeriesDataToDomain, filterDataByChartOptions } from '../utils';
import useChartContext from './useChartContext';
import { SERIES_TYPES } from '../constants';

/* 
    This hook has extracted the logic of the processData functionality from the SeriesGroup componenet
    so that it can be tested. 

    At a glance, this hook: 
    - handles aggregation for time series 
    - maps series to the domain for category series (so series do not loop back on each other)
    - filters out null values for line series
 */

const useProcessSeriesGroupData = (seriesId: string) => {
  const { series } = useChartContext();

  const { dataType, type, valueAccessor } = series[seriesId];

  const processData = (
    data: Array<SummaryValueDataShape>,
    processSeriesData?: (
      data: Array<SummaryValueDataShape>
    ) => Array<SummaryValueDataShape>
  ) => {
    let processedData;

    //  handles aggregation for dataTime series
    if (typeof processSeriesData === 'function') {
      processedData = processSeriesData(data);
    } else {
      processedData = data;
    }

    // handles mapping series to domain for category series
    if (dataType === 'category') {
      // map data to inherit the order from the domain for category labels
      processedData = mapSeriesDataToDomain(processedData, series);
    }

    /* 
        If line series, filter out null values, otherwise line is not drawn between glyphs
        This is needed for the tooltip fix REP-818 which populates missing grouped data with nulls
        If the above problem is fixed by visx, then this logic just needs to be applied to data configured on the right axis
     */
    if (type === SERIES_TYPES.line) {
      processedData = filterDataByChartOptions(
        true,
        false,
        processedData,
        valueAccessor
      );
    }
    return processedData;
  };

  return {
    processData,
  };
};

export default useProcessSeriesGroupData;

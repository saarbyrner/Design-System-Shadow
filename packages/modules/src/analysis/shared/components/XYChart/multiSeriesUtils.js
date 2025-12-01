// @flow
import { extent } from '@visx/vendor/d3-array';
import type {
  SummaryValueDataShape,
  GroupedSummaryValueDataShape,
} from '@kitman/modules/src/analysis/shared/types/charts';
import type { ValueAccessor } from './types';

/*
    This file is specifically for multi series utils on XY Charts.
    visx do not offer an out of the box solution to render multiple series on the same XY chart.
    Utils here are to process and format data
*/

/**
 * Function that returns the min and max value of the chart data
 *
 * @param {Array<GroupedSummaryValueDataShape>} data chart data
 * @param {ValueAccessor} valueAccessor accessor to format the value
 * @returns Array<number> - [min, max]
 */

export const getSummaryValueChartDomain = (
  data: Array<SummaryValueDataShape>,
  valueAccessor: ValueAccessor
) => {
  return extent(data.map((item) => valueAccessor(item)));
};

/**
 * Function that returns the min and max value of the stacked chart data
 * Stacked (bar) data is summed together to calculate the range of the series
 *
 * @param {Array<GroupedSummaryValueDataShape>} data grouped chart data
 * @param {ValueAccessor} valueAccessor accessor to format the value
 * @returns Array<number> - [min, max]
 */

export const getStackedValueChartDomain = (
  data: Array<GroupedSummaryValueDataShape>,
  valueAccessor: ValueAccessor
) => {
  const reducedGroupedData = data.map((item) => {
    return item.values?.reduce((acc, cur) => {
      const value = valueAccessor(cur);
      return value !== null ? parseInt(value, 10) + acc : acc;
    }, 0);
  });

  return extent(reducedGroupedData);
};

/**
 * Function that returns the min and max value of the grouped chart data
 * Grouped (bar, line) data renders each series data separately, so we need the max
 * value for an associated x label, not sum of all values of the x label like stacked charts
 *
 * @param {Array<GroupedSummaryValueDataShape>} data grouped chart data
 * @param {ValueAccessor} valueAccessor accessor to format the value
 * @returns Array<number> - [min, max]
 */

export const getGroupedValueChartDomain = (
  data: Array<GroupedSummaryValueDataShape>,
  valueAccessor: ValueAccessor
) => {
  const maxValues = data.map((item) => {
    const numericValues = item.values
      .map((val) => {
        const value = valueAccessor(val);
        return value !== null ? parseFloat(value) : null;
      })
      .filter((val) => val !== null);

    // $FlowIgnore - filtered out nulls above
    return numericValues.length > 0 ? Math.max(...numericValues) : null;
  });

  const minValues = data.map((item) => {
    const numericValues = item.values
      .map((val) => {
        const value = valueAccessor(val);
        return value !== null ? parseFloat(value) : null;
      })
      .filter((val) => val !== null);

    // $FlowIgnore - filtered out nulls above
    return numericValues.length > 0 ? Math.min(...numericValues) : null;
  });

  return extent([...minValues, ...maxValues]);
};

/**
 * Function that scales a value from one axis range to another axis range
 *
 * @param {number} value value to be scaled
 * @param {[number, number]} fromRange [min, max] values of the axis range that the value belongs to
 * @param {[number, number]} toRange  [min, max] values of the axis range that the value will be scaled to
 * @returns number - scaled value
 */

export const scaleValue = (
  value: number,
  fromRange: [number, number],
  toRange: [number, number]
) => {
  if (!fromRange || !toRange) return value;

  return (
    ((value - fromRange[0]) * (toRange[1] - toRange[0])) /
      (fromRange[1] - fromRange[0]) +
    toRange[0]
  );
};

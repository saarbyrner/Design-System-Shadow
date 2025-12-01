// @flow
import _find from 'lodash/find';
import moment from 'moment';
import _uniq from 'lodash/uniq';
import i18n from '@kitman/common/src/utils/i18n';
import {
  formatShortOrgLocale,
  formatStandard,
} from '@kitman/common/src/utils/dateFormatter';
import {
  calculateSumOfValues,
  calculateMeanOfValues,
  calculateMinValue,
  calculateMaxValue,
  returnLastValue,
  meanPercentageValue,
} from '@kitman/common/src/utils/aggregators';
import { type SummaryValueDataShape } from '@kitman/modules/src/analysis/shared/types/charts';
import { extent } from '@visx/vendor/d3-array';
import {
  getDatesBetween,
  getWeeksBetween,
  getMonthsBetween,
} from '@kitman/common/src/utils/dateUtils';
import type {
  ValueAccessor,
  AggregatePeriod,
  AggregateMethod,
  SeriesContextType,
  SortOrder,
  DefaultSortFunction,
} from './types';
import { AGGREGATE_METHOD, AGGREGATE_PERIOD, SORT_ORDER } from './constants';

type ProcessDataSeriesConfig = {
  hideNulls?: boolean,
  hideZeroes?: boolean,
  seriesOrder?: SortOrder | 'no-order',
  defaultSortFunction?: ?DefaultSortFunction,
};

/**
 * Retrieves the value associated with a chart item.
 *
 * If the chart has single grouping, the value is returned directly.
 * If the chart is stacked with two groupings, the method iterates
 * through the array of groupings and returns the first existing value.
 *
 * @param {Array<Object>|string} item chart element
 * @returns value of the chart item
 */
function getChartItemValueByGrouping(item) {
  return Array.isArray(item.values)
    ? item.values.find((i) => i.value || i.value === 0)?.value
    : item.value;
}

/**
 * Filters the data based on the Chart Options passed
 * @param {boolean} hideNulls indicates if value null items would be hidden
 * @param {boolean} hideZeroes indicates if value zero items would be hidden
 * @param {Array<Object>} orderedData data to be filtered
 * @param {Function} valueAccessor accessor function which returns data for data item
 * @returns Filtered data
 */
export function filterDataByChartOptions(
  hideNulls: boolean,
  hideZeroes: boolean,
  orderedData: Array<Object>,
  valueAccessor: ValueAccessor
): Array<Object> {
  let filteredData = [...orderedData];
  if (hideNulls) {
    filteredData = orderedData.filter((item) => {
      const itemValue = getChartItemValueByGrouping(item);
      const value = valueAccessor({ value: itemValue });
      return value !== null;
    });
  }

  if (hideZeroes) {
    filteredData = filteredData.filter((item) => {
      const itemValue = getChartItemValueByGrouping(item);
      const value = valueAccessor({ value: itemValue });
      return value !== 0;
    });
  }
  return filteredData;
}

/**
 * Sorts the data based on sort order passed. If sort order is DEFAULT or empty,
 * it will use a provided defaultSortFunction if available; otherwise, returns data as-is.
 * @param {Array<Object>} data data to be sorted
 * @param {string} sortBy sort order
 * @param {DefaultSortFunction} defaultSortFunction function that can be provided for a custom sort order
 * @returns Sorted data
 */
export function sortSeries(
  data: Array<Object>,
  sortBy: string,
  defaultSortFunction?: ?DefaultSortFunction
): Array<Object> {
  if (!data) {
    return [];
  }

  const orderedData = [...data];
  const isDefaultSortFunctionDefined =
    typeof defaultSortFunction === 'function';

  const isDefaultSortOrderEnabled = sortBy === 'default' || sortBy === '';

  if (isDefaultSortOrderEnabled) {
    if (isDefaultSortFunctionDefined) {
      // $FlowIgnore not a function - check for function defined in isDefaultSortFunctionDefined
      return defaultSortFunction(data);
    }

    return orderedData;
  }

  return orderedData.sort((a, b) => {
    const valueA = a.value;
    const valueB = b.value;
    switch (sortBy) {
      case SORT_ORDER.LOW_TO_HIGH:
        return +valueA - +valueB;
      case SORT_ORDER.HIGH_TO_LOW:
        return +valueB - +valueA;
      case SORT_ORDER.ALPHABETICAL:
      default:
        return a.label.localeCompare(b.label);
    }
  });
}
/**
 * Function that process the data before it can be rendered in the chart
 * By default, this function
 *  - Does not filter nulls
 *  - Does not order the data
 *
 * Config can be provided which orders the data and filters the null values
 *
 * @param {Array<Object>} data data to be processed
 * @param {Function} valueAccessor accessor function which returns data for data item
 * @param {ProcessDataSeriesConfig} config provides a way to filter nulls and orders data
 * @returns Array<Object>
 */
export const processSeriesData = (
  data: Array<Object>,
  valueAccessor: ValueAccessor,
  {
    hideNulls = false,
    hideZeroes = false,
    seriesOrder = 'no-order',
    defaultSortFunction,
  }: ProcessDataSeriesConfig
): Array<Object> => {
  let orderedData = [];

  if (seriesOrder === 'no-order') {
    orderedData = data;
  } else {
    const groupedData = data.map((item) => {
      // if grouped, order by the sum of the grouped data
      let val;
      const castString = (value) => {
        return typeof value === 'string' ? Number.parseInt(value, 10) : value;
      };

      if (item.values) {
        val = item.values.reduce((acc, cur) => {
          const value = valueAccessor(cur);
          return value === null ? acc : castString(value) + acc;
        }, 0);
      } else {
        const value = valueAccessor(item);
        val = value === null ? value : castString(value);
      }
      return { ...item, value: val };
    });

    orderedData = sortSeries(groupedData, seriesOrder, defaultSortFunction);
  }

  if (!hideNulls && !hideZeroes) {
    return orderedData;
  }

  return filterDataByChartOptions(
    hideNulls,
    hideZeroes,
    orderedData,
    valueAccessor
  );
};

/**
 * This util processes the series data for each series and
 * returns the categories in a string array to be used as the domain
 * for a band scale.
 *
 * @param {Series} series Series object stored in the chart context
 * @returns Array<string>
 */
export const getChartFullCategoryDomain = (
  series: SeriesContextType
): Array<string> =>
  _uniq(
    Object.keys(series)
      // Sort the element based on sortConfig to ensure that
      // the labels of the element to be sorted appear first.
      .sort((key1, key2) => {
        if (series[key1].sortConfig?.sortOrder) return -1;
        if (series[key2].sortConfig?.sortOrder) return 1;
        return 0;
      })
      .flatMap<string>((seriesId) => {
        const seriesObject = series[seriesId];
        const seriesOrder =
          seriesObject.dataType === 'time'
            ? 'no-order'
            : seriesObject.sortConfig?.sortOrder;

        return (
          processSeriesData(seriesObject.data, seriesObject.valueAccessor, {
            seriesOrder,
            defaultSortFunction: seriesObject?.defaultSortFunction,
            hideNulls: seriesObject.chartOptions?.hide_null_values,
            hideZeroes: seriesObject.chartOptions?.hide_zero_values,
          }).map(seriesObject.categoryAccessor) || []
        );
      })
  );

/**
 * This util maps the chart data to the domain order
 * used for multiple series, to ensure the series are ordered the same
 *
 * @param {Array<Object>} data chart data to be mapped
 * @param {Series} series Series object stored in the chart context
 * @returns Array<Object>
 */
export const mapSeriesDataToDomain = (
  data: Array<Object>,
  series: SeriesContextType
): Array<Object> => {
  const domain = getChartFullCategoryDomain(series);
  const order = domain.map((label) => {
    const item = _find(data, { label });
    if (!item) {
      return { label, value: null };
    }

    return item;
  });

  return order;
};

/**
 * As xy chart allows multiple series and only a single category axis. We must determine
 * the type of the category axis. This util accepts all the chart series and detrermines the type
 * It assumes that all series in a chart are the same. Will throw an error if multiple
 * series types are used in one place. Returns supported d3 scale types
 *
 * @param {SeriesContextType} series series stored on the chart context
 * @returns 'category' | 'time'
 */
export const getScaleType = (
  series: SeriesContextType
): 'category' | 'time' => {
  const dataTypes = _uniq(
    Object.keys(series).map((key) => {
      const { dataType } = series[key];

      return dataType;
    })
  );

  if (dataTypes.length > 1) {
    throw new Error(
      'Multiple series of different types used in chart. Must use all DateTime or Category series'
    );
  }

  return dataTypes[0];
};

export const convertLabelsToDates = (data: SummaryValueDataShape[]) =>
  data.map<SummaryValueDataShape>((item) => ({
    ...item,
    label: moment(item.label, 'YYYY-MM-DD').toDate(),
  }));

type AggregateData = {
  [string]: Array<number>,
};

/**
 * Function that takes in an object with the structure: 
      {
        [string]: Array<?number>,
      } 
 *  And loops through each attribute and aggregates the array based on the given method
 *  Returns an array of objects with the label and aggregated data for charts
 *
 * @param {Object} data data to be aggregated
 * @param {Function} aggregationMethod method in which to aggregate the data
 * @returns Array<SummaryValueDataShape>
 */
export const aggregateByMethod = (
  data: AggregateData,
  aggregationMethod: (values: Array<number> | Array<Object>) => number
): Array<SummaryValueDataShape> => {
  const formattedData = [];

  Object.keys(data).forEach((label) => {
    const result = aggregationMethod(data[label]);

    formattedData.push({ label, value: result });
  });

  return formattedData;
};

/**
 *  Function that returns an array of data for charts that has been aggregated by period and method
 *
 *  Users can aggregate longitudinal charts by grouping the data by week and month - the aggregationPeriod
 *  This function groups the data by the aggregationPeriod, and applies the aggregationMethod (e.g. sum, mean) to the data
 *
 * Returns an array of objects aggregated for the charts Array<SummaryValueDataShape>
 *
 * @param {Array<SummaryValueDataShape>} data chart data to be aggregated
 * @param {AggregatePeriod} aggregatePeriod string that gives the aggregationPeriod
 * @param {AggregateMethod} aggregateMethod string that gives the aggregationMethod
 * @returns Array<SummaryValueDataShape>
 */
export const aggregateByTimePeriod = (
  data: Array<SummaryValueDataShape>,
  aggregatePeriod: AggregatePeriod,
  aggregateMethod: AggregateMethod
): Array<SummaryValueDataShape> => {
  const aggregatedData = {};

  data.forEach(({ label, value }: SummaryValueDataShape) => {
    const date = new Date(label);

    let aggregateKey;

    if (aggregatePeriod === AGGREGATE_PERIOD.weekly) {
      // get date of monday for that week
      aggregateKey = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
    } else {
      aggregateKey = moment(date).startOf('month').format('YYYY-MM-DD');
    }

    if (!aggregatedData[aggregateKey]) {
      aggregatedData[aggregateKey] = [];
    }

    if (!value) return;

    // Handle Fractions for percentage aggregations
    if (typeof value === 'object') {
      aggregatedData[aggregateKey].push({
        numerator: value?.numerator ? Number.parseInt(value.numerator, 10) : 0,
        denominator: value?.denominator
          ? Number.parseInt(value.denominator, 10)
          : 0,
      });
      return;
    }

    aggregatedData[aggregateKey].push(parseFloat(value));
  });

  switch (aggregateMethod) {
    case AGGREGATE_METHOD.sum:
      return aggregateByMethod(aggregatedData, calculateSumOfValues);
    case AGGREGATE_METHOD.mean:
      return aggregateByMethod(aggregatedData, calculateMeanOfValues);
    case AGGREGATE_METHOD.min:
      return aggregateByMethod(aggregatedData, calculateMinValue);
    case AGGREGATE_METHOD.max:
      return aggregateByMethod(aggregatedData, calculateMaxValue);
    case AGGREGATE_METHOD.last:
      return aggregateByMethod(aggregatedData, returnLastValue);
    case AGGREGATE_METHOD.percentage:
      return aggregateByMethod(aggregatedData, meanPercentageValue);
    default:
      return data;
  }
};

export const getSeriesIds = (series: SeriesContextType): Array<string> => {
  return Object.keys(series);
};

export const getGranualityOptions = (): Array<{
  key: AggregatePeriod,
  label: string,
}> => [
  {
    key: AGGREGATE_PERIOD.daily,
    label: i18n.t('Daily'),
  },
  {
    key: AGGREGATE_PERIOD.weekly,
    label: i18n.t('Weekly'),
  },
  {
    key: AGGREGATE_PERIOD.monthly,
    label: i18n.t('Monthly'),
  },
];

/**
 * Determines the lowest chart aggregation on the chart.
 * If there are 2 series on the chart with different aggregations it
 * will return the highest definition. i.e. [daily, monthly] will return
 * 'daily
 *
 * @param {SeriesContextType} series series context type
 */
export const getChartAggregatePeriod = (
  series: SeriesContextType
): AggregatePeriod => {
  const order = {
    daily: 1,
    weekly: 2,
    monthly: 3,
  };
  const periods = _uniq(
    Object.keys(series).map((key) => {
      const { aggregateValues } = series[key];

      return aggregateValues?.aggregatePeriod || ['daily'];
    })
  ).sort((a, b) => order[a] - order[b]);

  return periods[0];
};

/**
 * Calculates the time domain based on the aggregation perioed of the series
 * will allways assume the lowest granularity, i.e. daily
 *
 * @param {SeriesContextType} series series context type
 * @param {Array<string>} fullDomain full domain of the chart
 * @returns
 */
export const getTimeDomain = (series: SeriesContextType): Array<string> => {
  const fullDomain = getChartFullCategoryDomain(series);
  const aggregatePeriod = getChartAggregatePeriod(series);
  const range = extent(fullDomain);
  const rangeMap = {
    daily: getDatesBetween,
    weekly: getWeeksBetween,
    monthly: getMonthsBetween,
  };

  const rangeFn = rangeMap[aggregatePeriod];

  return rangeFn(moment(range[0]).toDate(), moment(range[1]).toDate()).map(
    (date) => moment(date).format('YYYY-MM-DD')
  );
};

export const formatDateValue = (
  value: string,
  series: SeriesContextType,
  locale: ?string
) => {
  const momentValue = moment(value);
  const selectedPeriod = getChartAggregatePeriod(series);

  switch (selectedPeriod) {
    case 'weekly':
      return momentValue.format('MMM D');

    case 'monthly':
      return momentValue.format('MMM');

    case 'daily':
    default:
      return locale
        ? formatShortOrgLocale(momentValue, locale, false)
        : formatStandard({ date: momentValue });
  }
};

// formats the ticks on the right axis to x decimal points
export const formatAxisTick = (value: number) => {
  // handles 0 as the first tick
  if (value === 0) {
    return value.toFixed(0);
  }
  // handles decimal values and percentage calcualtions
  if (value > 0 && value < 1) {
    return value.toFixed(2);
  }
  // handles small numbers
  if (value < 10) {
    return value.toFixed(1);
  }

  return value.toFixed(0);
};

export const getSortOrderList = (): Array<{
  key: SortOrder,
  label: string,
}> => [
  {
    key: SORT_ORDER.HIGH_TO_LOW,
    label: i18n.t('High - Low'),
  },
  {
    key: SORT_ORDER.LOW_TO_HIGH,
    label: i18n.t('Low - High'),
  },
  {
    key: SORT_ORDER.ALPHABETICAL,
    label: i18n.t('A - Z'),
  },
  {
    key: SORT_ORDER.DEFAULT,
    label: i18n.t('Default'),
  },
];

const formatDate = (date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

const addMissingEntries = (data, stepFunction) => {
  return data.reduce((filledData, current, i, arr) => {
    filledData.push(current);

    if (i < arr.length - 1) {
      let currentDate = new Date(current.label);
      const nextDate = new Date(arr[i + 1].label);

      let newDate = stepFunction(currentDate);
      while (
        newDate < nextDate &&
        formatDate(newDate) !== formatDate(nextDate)
      ) {
        filledData.push({
          label: formatDate(newDate),
          value: '0',
        });
        currentDate = newDate;
        newDate = stepFunction(currentDate);
      }
    }
    return filledData;
  }, []);
};

const nextDaily = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

const nextWeekly = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 7);
  return newDate;
};

const nextMonthly = (date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
};

export const fillMissingDates = (
  data: Array<Object>,
  interval: AggregatePeriod
) => {
  const stepFunctions = {
    daily: nextDaily,
    weekly: nextWeekly,
    monthly: nextMonthly,
  };

  if (!stepFunctions[interval]) {
    throw new Error("Invalid interval. Use 'daily', 'weekly', or 'monthly'.");
  }

  return addMissingEntries(data, stepFunctions[interval]);
};

/**
 * Calculates the tick width for chart axes based on scale type and rotation settings
 *
 * @param {Object} config - Configuration object
 * @param {number} config.parentWidth - The parent container width
 * @param {number} config.numItems - Number of items/bars in the chart
 * @param {'category' | 'time'} config.scaleType - The type of scale being used
 * @param {boolean} config.shouldHaveScrollBar - Whether the chart should have a scroll bar
 * @param {boolean} config.isScrollActive - Whether scrolling is currently active
 * @param {number} config.axisLabelMaxWidth - Maximum width allowed for axis labels (default: 100)
 * @returns {number} The calculated tick width
 */
export const getTickWidth = ({
  parentWidth,
  numItems,
  scaleType,
  shouldHaveScrollBar,
  isScrollActive,
  axisLabelMaxWidth = 100,
}: {
  parentWidth: number,
  numItems: number,
  scaleType: 'category' | 'time',
  shouldHaveScrollBar: boolean,
  isScrollActive: boolean,
  axisLabelMaxWidth?: number,
}): number => {
  const axisWidth = parentWidth - 70; // subtracting space for y axis labels
  const widthPerBar = axisWidth / numItems;
  const isRotated = shouldHaveScrollBar && !isScrollActive;

  if (scaleType === 'time') {
    return Math.min(axisLabelMaxWidth, widthPerBar);
  }

  if (isRotated) {
    return axisLabelMaxWidth;
  }

  return widthPerBar;
};

/**
 * Calculates the number of ticks to display on the chart axis
 *
 * @param {'category' | 'time'} scaleType - The type of scale being used
 * @param {number | null} parentWidth - The parent container width
 * @param {number} tickWidth - The width of each tick
 * @returns {number | null} The calculated number of ticks, or null if not applicable
 */
export const getNumTicks = (
  scaleType: 'category' | 'time',
  parentWidth: number | null,
  tickWidth: number
): number | null => {
  if (scaleType === 'time' && parentWidth !== null) {
    return parentWidth / tickWidth;
  }

  return null;
};

/**
 * Determines whether formatting values are out of the chart axis range.
 * Returns true if the value/s are completely out of bounds of the chart,
 * otherwise returns false
 *
 * @param {[number, number]} ranges chart axis range
 * @param {number | undefined} to formatting "to" value, or top of range
 * @param {number | undefined} from formatting "from" value, or bottom of range
 * @returns boolean
 */
export const getIsFormattingOutOfChartBounds = (
  ranges: [number, number],
  to?: number,
  from?: number
): boolean => {
  const chartMin = ranges?.[0];
  const chartMax = ranges?.[1];

  // If both from and to are defined and both are outside the chart range, return true
  if (
    from !== undefined &&
    to !== undefined &&
    ((from < chartMin && to < chartMin) || (from > chartMax && to > chartMax))
  ) {
    return true;
  }

  // If to is defined and below chart min, return true
  if (to !== undefined && to < chartMin) {
    return true;
  }

  // If from is defined and above chart max, return true
  if (from !== undefined && from > chartMax) {
    return true;
  }

  return false;
};

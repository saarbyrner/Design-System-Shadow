// @flow
import _round from 'lodash/round';
import _truncate from 'lodash/truncate';
import { getCalculationTitle } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/utils';
import { CHART_BACKGROUND_ZONE_CONDITIONS } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel/constants';
import type { TableWidgetCellValue } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import type {
  Calculation,
  ChartElement,
  ChartData,
  SummaryValueDataShape,
  GroupedSummaryValueDataShape,
} from '@kitman/modules/src/analysis/shared/types/charts';
import type { DefaultSortFunction } from '@kitman/modules/src/analysis/shared/components/XYChart/types';

export const getChartValue = (
  value: TableWidgetCellValue,
  calculation?: Calculation | string
): number | null => {
  if (value === null) return null;
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return parseFloat(value);
  }

  if (
    typeof value?.numerator !== 'undefined' &&
    typeof value?.denominator !== 'undefined'
  ) {
    if (calculation === 'percentage' || calculation === 'percentage_duration') {
      return _round((value.numerator / value.denominator) * 100, 2);
    }

    if (calculation === 'count') {
      return value.numerator;
    }
  }

  return null;
};

export const getValueFormat = (
  value: string | number | null,
  calculation?: Calculation | string,
  addDecorator?: boolean,
  roundingPlaces?: number | null
): string => {
  if (value === null) return '';

  const formattedValue = roundingPlaces
    ? Number(value).toFixed(roundingPlaces)
    : value.toString();

  if (
    addDecorator &&
    ['percentage', 'percentage_duration'].includes(calculation)
  ) {
    return `${formattedValue}%`;
  }

  return formattedValue;
};

/**
 * Function to sort the chart elements by ordering the bar series first
 * Returns the ordered chart elements indexes
 *
 * @param {Array<ChartElement>} chartElements to be sorted by bar
 * @returns {Array<number>} array of indexes
 */

export const sortChartElementIndexes = (
  chartElements: Array<ChartElement>
): Array<number> => {
  if (!chartElements) {
    return [];
  }

  const sortedChartElementIndexes = chartElements
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const aSeriesType = a?.item?.config?.render_options?.type;
      const bSeriesType = b?.item?.config?.render_options?.type;

      if (aSeriesType === 'bar') return -1;
      if (bSeriesType === 'bar') return 1;
      return 0;
    })
    .map(({ index }) => index);

  return sortedChartElementIndexes;
};

/**
 * Function to sort the chart elements by ordering the bar series first
 * Returns the chartElements ordered
 *
 * @param {Array<ChartElement>} chartElements to be sorted by bar
 * @returns {Array<ChartElement>} chartElements ordered
 */
export const sortChartElements = (
  chartElements: Array<ChartElement>
): Array<ChartElement> => {
  if (!chartElements) {
    return [];
  }

  const sortedChartElementIndexes = sortChartElementIndexes(chartElements);

  return sortedChartElementIndexes.map((index) => chartElements[index]);
};

/**
 * Function to sort the chart data by chart elements
 * The chartElements index corresponds to the chartData index - this function orders
 * the chartElements first by bar and then maps the indexes to the data.
 * Returns the chartData ordered
 *
 * @param {Array<Object>} chartData to be sorted by chartElements
 * @param {Array<ChartElement>} chartElements to be sorted by bar
 * @returns {Array<Object>} chartData ordered
 */
export const sortChartDataByChartElements = (
  chartData: Array<ChartData>,
  chartElements: Array<ChartElement>
): Array<ChartData> => {
  if (!chartData) {
    return [];
  }

  const sortedChartElementIndexes = sortChartElementIndexes(chartElements);

  return sortedChartElementIndexes.map((index) => chartData[index]);
};

export const isChartDataEmpty = (chartData: Array<Object>): boolean => {
  if (!chartData || chartData.length === 0) {
    return true;
  }

  const emptyChartElements = chartData.filter(
    (element) => element.chart.length === 0
  );

  if (chartData.length === emptyChartElements.length) {
    return true;
  }

  return false;
};

export const getDefaultAxisLabel = (
  datasourceName: string,
  calculation: string
): string => {
  if (!datasourceName && !calculation) return '';

  const truncatedName = _truncate(datasourceName, {
    omission: '...',
    length: calculation ? 25 : 45,
  });

  const calculationName = calculation
    ? `-${getCalculationTitle(calculation)}`
    : '';

  return truncatedName + calculationName;
};

/**
 * Function to sort data that has been grouped by micro_cycles
 * Any non week data labels are sorted at the end
 * Returns the data ordered
 *
 * @param {Array<SummaryValueDataShape | GroupedSummaryValueDataShape>} data to be sorted
 * @returns {Array<SummaryValueDataShape | GroupedSummaryValueDataShape>} data sorted
 */
export const sortMicroCyclesData = (
  data: Array<SummaryValueDataShape | GroupedSummaryValueDataShape>
): Array<SummaryValueDataShape | GroupedSummaryValueDataShape> => {
  return data.sort((a, b) => {
    const aWeekNumber = a.label.split(' ')[1];
    const bWeekNumber = b.label.split(' ')[1];

    // Handle non week data labels and sorts them at the end
    if (aWeekNumber === undefined && bWeekNumber !== undefined) {
      return 1;
    }
    if (aWeekNumber !== undefined && bWeekNumber === undefined) {
      return -1;
    }
    if (aWeekNumber === undefined && bWeekNumber === undefined) {
      return 0;
    }

    return parseInt(aWeekNumber, 10) - parseInt(bWeekNumber, 10);
  });
};

/**
 * Function to get the sort function based on the grouping of the data
 *
 * This functionality will likely grow in charts, where we will need a custom sort functions for different groupings
 * We can change to a switch statement when that becomes necessary
 *
 * Returns the correct sort function for the grouping
 *
 * @param {string} grouping how the data is grouped
 * @returns {?DefaultSortFunction} function that will be used to sort Summary and Grouped chart data
 */
export const getDefaultSortFunctionByGrouping = (
  grouping: string
): ?DefaultSortFunction => {
  if (grouping === 'micro_cycle') {
    return sortMicroCyclesData;
  }

  return undefined;
};

type BackgroundZone = {
  to?: number,
  from?: number,
};
/**
 * Function to calcalute the to / from values of a background zone for conditional formatting
 *
 * Only "between" condition passes to and from values
 * "less_than" & "greater_than" only have one value configured
 *
 * Returns the to / from values required to configure the background zone
 *
 * @param {condition} condition is the type of formatting rule required
 * @param {string} to is the to value input by the user for the between condition
 * @param {string} from is the from value input by the user for the between condition
 * @param {string} value is the single value input by the user for less_than and greater_than conditions
 * @returns {BackgroundZone} object with to and from values as numbers or null
 */
export const handleBackgroundZoneRanges = ({
  condition,
  to,
  from,
  value,
}: {
  condition: string,
  to?: string,
  from?: string,
  value?: string,
}): BackgroundZone => {
  let toVal;
  let fromVal;

  if (condition === CHART_BACKGROUND_ZONE_CONDITIONS.between) {
    toVal = parseFloat(to);
    fromVal = parseFloat(from);
  }

  if (condition === CHART_BACKGROUND_ZONE_CONDITIONS.less_than) {
    toVal = parseFloat(value);
  }

  if (condition === CHART_BACKGROUND_ZONE_CONDITIONS.greater_than) {
    fromVal = parseFloat(value);
  }

  return { to: toVal, from: fromVal };
};

export const getFormattingRuleByType = (
  chartElement: ChartElement,
  ruleType: string
) => {
  return chartElement?.config?.render_options?.conditional_formatting?.filter(
    (format) => format.type === ruleType
  );
};

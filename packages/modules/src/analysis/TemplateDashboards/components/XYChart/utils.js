// @flow
import { scaleTime } from '@visx/scale';
import { extent } from '@visx/vendor/d3-array';
import type {
  ChartType,
  SummaryValueDataShape,
  GroupedSummaryValueDataShape,
  WidgetColors,
  ChartOrientation,
} from '@kitman/modules/src/analysis/shared/types/charts';
import moment from 'moment';
import _sumBy from 'lodash/sumBy';
import _orderBy from 'lodash/orderBy';
import type { Scroll } from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type { DataItem, Data } from './types';
import {
  LEGEND_HEIGHT,
  SCROLL_BAR_HEIGHT,
  HORIZONTAL_PX_PER_LABEL,
  BAR_CHART_AXIS_LABEL_MAX_CHARS,
  VALUE_AXIS_WIDTH,
  BAR_Y_AXIS_LABEL_WIDTH,
  AXIS_FONT_SIZE,
} from './constants';

export const valueAccessor = (item: SummaryValueDataShape) =>
  typeof item.value === 'string' ? parseFloat(item.value) : item.value;
export const labelAccessor = (item: DataItem): string =>
  item ? item.label : '';

export const isDataGrouped = (data: Data): boolean =>
  // $FlowIgnore this is safe to ignore as it checks for the correct shape
  !!(data.length && data[0].values);

export const flattenData = (data: Data): SummaryValueDataShape[] =>
  // $FlowIgnore this is safe to ignore as it checks for the correct shape
  isDataGrouped(data) ? data.flatMap(({ values }) => values) : data;

const AXIS_SIZE = AXIS_FONT_SIZE + 10;
const LARGE_MARGIN = 48;
const SMALL_MARGIN = 8;

export const calcMarginTop = (orientation: ChartOrientation) => {
  return orientation === 'horizontal' ? AXIS_SIZE : SMALL_MARGIN;
};

export const calcMarginBottom = (
  orientation: ChartOrientation,
  shouldScroll: boolean
) => {
  const verticalBottomMargin = shouldScroll ? LARGE_MARGIN * 2 : AXIS_SIZE;
  return orientation === 'horizontal' ? SMALL_MARGIN : verticalBottomMargin;
};

export const calcMarginLeft = (
  chartType: ChartType,
  orientation: ChartOrientation
) => {
  return ['bar', 'summary_stack'].includes(chartType) &&
    orientation === 'horizontal'
    ? BAR_Y_AXIS_LABEL_WIDTH
    : LARGE_MARGIN;
};

export const calcMarginRight = () => {
  return 0;
};

export const getMargin = ({
  shouldScroll,
  chartType,
  orientation,
}: {
  shouldScroll: boolean,
  chartType: ChartType,
  orientation: ChartOrientation,
}) => ({
  top: calcMarginTop(orientation),
  right: calcMarginRight(),
  bottom: calcMarginBottom(orientation, shouldScroll),
  left: calcMarginLeft(chartType, orientation),
});

export const getMinAndMax = (data: Data, accessor: Function) => {
  const dataValues = flattenData(data).map(accessor);
  const min = Math.min(...dataValues);
  const max = Math.max(...dataValues);

  return [min, max];
};

export const getValueScale = ({
  chartType,
  max,
}: {
  chartType: ChartType,
  max: number,
}) => {
  const commonConfig = { type: 'linear' };

  switch (chartType) {
    case 'line':
      return {
        ...commonConfig,
        zero: false,
        domain: [0, parseInt(max * 1.1, 10)],
      };

    default:
      return {
        ...commonConfig,
      };
  }
};

export const getTimeDomain = (data: Data) =>
  extent(
    flattenData(data).map((item) => ({
      ...item,
      label: moment(item.label, 'YYYY-MM-DD').toDate(),
    })),
    labelAccessor
  );

/**
 * This util will return a subsection of the data labels to be used as the
 * domain attribute for the visx scale
 *
 * @param {Data} data chart data
 * @param {Scroll} scroll the chart scroll object which contains the start and end index set by the scrollbar, as well as information about the chart scrollbar being active
 * @returns
 */
export const getBarValueDomain = (
  data: Data,
  scroll: Scroll
): Array<string> => {
  if (!scroll.isActive) {
    return data.map(labelAccessor);
  }

  return data.slice(scroll.startIndex, scroll.endIndex).map(labelAccessor);
};

export const getLabelScale = ({
  chartType,
  width,
  height,
  orientation,
  data,
  scroll,
  margin,
}: {
  chartType: ChartType,
  width: number,
  height: number,
  orientation: ChartOrientation,
  data: Data,
  scroll: Scroll,
  margin: { top: number, bottom: number, right: number, left: number },
}) => {
  const size = {
    vertical: width,
    horizontal: height - AXIS_FONT_SIZE,
  };
  const scaleStart = {
    vertical: VALUE_AXIS_WIDTH,
    horizontal: margin.top,
  };
  const commonConfig = { type: 'band' };

  switch (chartType) {
    case 'line':
      return () =>
        scaleTime({
          range: [0, size[orientation]],
          domain: getTimeDomain(data),
          nice: false,
        });
    case 'bar':
    case 'summary_stack':
      return {
        ...commonConfig,
        range: [scaleStart[orientation], size[orientation]],
        domain: getBarValueDomain(data, scroll),
        // data is sorted incorrectly for bar type data as it isn't grouped.
        reverse: orientation === 'horizontal' && chartType === 'bar',
        padding: 0.7,
      };
    default:
      return {
        ...commonConfig,
      };
  }
};

// the value passed in is a date obect as thats what vix will pass in as a value
// the time domain is based on the min and max dates in a range as calculated
// by d3/visx in the getTimeDomain util above
const timeFormatter = (value, timeDomain) => {
  const daysBetween = moment(timeDomain[1]).diff(timeDomain[0], 'days');
  let format;

  if (daysBetween < 7) {
    format = 'ddd Do';
  } else if (daysBetween < 30) {
    format = 'Do MMM';
  } else {
    format = 'MMM YY';
  }

  return moment(value).format(format);
};

export const getLabelAxisNumTicks = (width: number, shouldScroll: boolean) => {
  if (shouldScroll) {
    return Math.ceil(width / (AXIS_FONT_SIZE + 4)); // padding 2 on either side
  }

  return Math.ceil(width / HORIZONTAL_PX_PER_LABEL);
};

export const getBarChartAxisLabelTrimmed = (labelText: string) => {
  if (labelText.length > BAR_CHART_AXIS_LABEL_MAX_CHARS) {
    return `${labelText
      .substring(0, BAR_CHART_AXIS_LABEL_MAX_CHARS)
      .trim()}...`;
  }
  return labelText;
};

export const getLabelAxisTickFormatter = ({
  data,
  chartType,
}: {
  data: Data,
  chartType: ChartType,
}): Function => {
  const tickFormat = (value) => {
    if (chartType === 'line') {
      const timeDomain = getTimeDomain(data);

      return timeFormatter(value, timeDomain);
    }

    if (chartType === 'bar') {
      return getBarChartAxisLabelTrimmed(value);
    }

    return value;
  };

  return tickFormat;
};

/**
 * The api returns grouped data by bar, where as visx treats series as the 
 * segment within a bar stack, so we need to convert the format
 * Converts 
 *  [
      {
        label: "Bar value",
        values: [
          {
            label: "Series value",
            value: 123,
          },
          {
            label: "Series value 2",
            value: 246,
          },
        ],
      },
    ]

 * To:
    [
      {
        label: "Series value",
        values: [
          {
            label: "Bar value",
            value: 123,
          },
        ],
      },
      {
        label: "Series value 2",
        values: [
          {
            label: "Bar value",
            value: 246,
          },
        ],
      }
    ];
  * [{
  *   label: 'Bar value',
  *   values: [
  *   ]
  * }]
  */
export const mapSummaryStackData = (
  data: GroupedSummaryValueDataShape[],
  removeNullValues?: boolean
): GroupedSummaryValueDataShape[] =>
  data.reduce((acc, curr) => {
    const series = [...acc];

    curr.values.forEach((value) => {
      // Skip iteration if value.value is null
      if (removeNullValues && value.value === null) return;

      const index = series.findIndex((serie) => serie.label === value.label);
      const valueObj = {
        label: curr.label,
        value: value.value,
      };

      if (index === -1) {
        series.push({
          label: value.label,
          values: [valueObj],
        });
      } else {
        series[index].values.push(valueObj);
      }
    });

    return [...series];
  }, []);

/**
 * Function to process the chart data at the very start of the chart render.
 * By default we sort summary_stack and bar charts highest to lowest.
 *
 * Potential TODO: sort the chart data programatically by supplying args
 *
 * @param {Data} data the chart data
 * @param {ChartType} chartType the chart type
 * @returns Data
 */
export const processData = (
  data: Data,
  chartType: ChartType,
  orientation: string = 'vertical'
) => {
  let processedData = data || [];

  if (chartType === 'summary_stack') {
    processedData = _orderBy(
      data,
      (item) =>
        _sumBy(
          item.values.filter(({ value }) => value !== null),
          (val) => parseFloat(val.value)
        ),
      'desc'
    );
  }

  if (chartType === 'bar' && orientation === 'vertical') {
    processedData = _orderBy(
      data,
      (item) => (item.value === null ? 0 : parseFloat(item.value)),
      'desc'
    );
  }

  if (chartType === 'bar' && orientation === 'horizontal') {
    processedData = _orderBy(
      data,
      (item) => (item.value === null ? 0 : parseFloat(item.value)),
      'asc'
    );
  }

  return processedData;
};

export const getChartHeight = ({
  hasLegend,
  isScrollActive,
  containerHeight,
}: {
  hasLegend: boolean,
  isScrollActive: boolean,
  containerHeight: number,
}): number => {
  return [
    {
      value: LEGEND_HEIGHT,
      shouldMinus: hasLegend,
    },
    {
      value: SCROLL_BAR_HEIGHT,
      shouldMinus: isScrollActive,
    },
  ].reduce((accHeight, { value, shouldMinus }) => {
    let newHeight = accHeight;

    if (shouldMinus) {
      newHeight -= value;
    }

    return newHeight;
  }, containerHeight);
};

export const getLineColor = (
  currentData: Object,
  chartData: Object[],
  widgetColors: WidgetColors
) => {
  if (!widgetColors?.colors.length) {
    return null;
  }

  const widgetColorsArray = widgetColors.colors || [];

  let lineCategory = '';
  // Get the Category of the Event Type before getting color
  chartData.forEach((chartDataItem: Object) => {
    if (
      chartDataItem?.values &&
      Array.isArray(chartDataItem.values) &&
      chartDataItem.values.length
    ) {
      chartDataItem?.values.forEach((chartDataItemValue: Object) => {
        if (chartDataItemValue.label === currentData.label) {
          lineCategory = chartDataItem.label;
        }
      });
    } else if (
      chartDataItem?.label &&
      chartDataItem.label === currentData.label &&
      !chartDataItem?.values
    ) {
      lineCategory = chartDataItem.label;
    }
  });

  const lineColor = widgetColorsArray.find(
    (widgetColor) => widgetColor.label === lineCategory
  );
  return lineColor?.value;
};

export const formatValueTick = (locale: string, number: number) =>
  Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);

export const formatVerticalAxisTicks = (
  locale: string,
  value: number,
  addDecorator: boolean,
  calculation?: string
) => {
  const num = formatValueTick(locale, +value);

  if (
    addDecorator &&
    ['percentage', 'percentage_duration'].includes(calculation)
  ) {
    return `${num}%`;
  }
  return num;
};

export const labelTextAccessor = (datum: Object) => {
  const value = datum?.text ?? datum.value;

  return typeof value === 'string' ? parseInt(value, 10) : value;
};

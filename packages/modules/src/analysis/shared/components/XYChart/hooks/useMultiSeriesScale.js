// @flow
import {
  getStackedValueChartDomain,
  getGroupedValueChartDomain,
  getSummaryValueChartDomain,
  scaleValue,
} from '../multiSeriesUtils';
import useChartContext from './useChartContext';
import { type AxisConfig } from '../types';

type Ranges = {
  [axis: AxisConfig]: [number, number],
};

// hook to map data for multi series charts
const useMultiSeriesScale = () => {
  const { series } = useChartContext();

  const ranges: Ranges = Object.keys(series).reduce((acc, curr) => {
    const currentSeries = series[curr];
    const axis = currentSeries.axisConfig;
    const isGrouped = currentSeries.isGrouped;
    const isStacked = currentSeries.renderAs === 'stack';
    const isBar = currentSeries.type === 'bar';
    const isArea = currentSeries.type === 'area';

    let domain = [];
    if (isStacked && (isBar || isArea)) {
      domain = getStackedValueChartDomain(
        currentSeries.data,
        currentSeries.valueAccessor
      );
    } else if (isGrouped) {
      domain = getGroupedValueChartDomain(
        currentSeries.data,
        currentSeries.valueAccessor
      );
    } else {
      domain = getSummaryValueChartDomain(
        currentSeries.data,
        currentSeries.valueAccessor
      );
    }

    // $FlowIgnore - properties left/right can exist on acc but an undefined check is below
    const accumulatedRange = acc?.[axis];

    // adjustedDomain takes into account all series on the same axis
    // takes the min and max of all series for that axis
    const adjustedDomain = [
      accumulatedRange ? Math.min(accumulatedRange[0], domain[0]) : domain[0],
      accumulatedRange ? Math.max(accumulatedRange[1], domain[1]) : domain[1],
    ];

    // e.g. left: [min, max] - min defined as 0 unless min is a minus number
    const axisRange = {};
    axisRange[axis] = [
      adjustedDomain[0] > 0 ? 0 : adjustedDomain[0],
      adjustedDomain[1],
    ];

    // Future iterations
    // - used to set to the axis scales when the time comes
    // - will need to take into account the min and max range for left and right for more than 2 series

    return { ...acc, ...axisRange };
  }, {});

  const convertValueToSecondaryAxis = (
    seriesId: string,
    value: string | number | null
  ) => {
    if (value === null) {
      return null;
    }
    const formattedValue =
      typeof value === 'string' ? parseFloat(value) : value;

    const currentSeries = series[seriesId];
    const primaryAxis = currentSeries.primaryAxis;

    if (currentSeries.axisConfig === primaryAxis) {
      return value;
    }

    if (!ranges?.right || !ranges?.left) {
      return value;
    }

    const primaryRange = ranges[primaryAxis];
    const secondaryRange = ranges[primaryAxis === 'left' ? 'right' : 'left'];

    return scaleValue(formattedValue, secondaryRange, primaryRange);
  };

  const convertValueWithRanges = (
    value: string | number | null,
    primaryRange: [number, number],
    secondaryRange: [number, number]
  ) => {
    if (value === null) {
      return null;
    }

    const formattedValue =
      typeof value === 'string' ? parseFloat(value) : value;

    if (!primaryRange || !secondaryRange) {
      return value;
    }

    return scaleValue(formattedValue, secondaryRange, primaryRange);
  };

  return {
    ranges,
    convertValueToSecondaryAxis,
    convertValueWithRanges,
  };
};

export default useMultiSeriesScale;

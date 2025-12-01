// @flow
import _truncate from 'lodash/truncate';
import { AnimatedAxis, Axis, AnimatedGrid } from '@visx/xychart';
import {
  formatDateValue,
  formatAxisTick,
  getScaleType,
  getTickWidth,
  getNumTicks,
} from '../utils';
import { scaleValue } from '../multiSeriesUtils';
import useChartContext from '../hooks/useChartContext';
import useMultiSeriesScale from '../hooks/useMultiSeriesScale';
import useScrollControls from '../hooks/useScrollControls';
import { type AxisConfig } from '../types';
import { AXIS_CONFIG, AXIS_LABLE_MAX_WIDTH } from '../constants';

type Props = {
  hasLongitudinal: boolean,
  tickFormatterVerticalAxis: (
    value: string | number,
    axisConfig: AxisConfig
  ) => number | string,
  tickFormatterHorizonalAxis?: (string | Date) => string,
};

function Axes(props: Props) {
  const { series, locale, parentSize } = useChartContext();
  const { ranges } = useMultiSeriesScale();
  const { scroll, metadata } = useScrollControls();
  const scaleType = getScaleType(series);
  const parentWidth = parentSize.width || 0;

  const isRotated = () => metadata.shouldHaveScrollBar && !scroll.isActive;
  const tickWidth = getTickWidth({
    parentWidth,
    numItems: metadata.numItems,
    scaleType,
    shouldHaveScrollBar: metadata.shouldHaveScrollBar,
    isScrollActive: scroll.isActive,
    axisLabelMaxWidth: AXIS_LABLE_MAX_WIDTH.horizontal,
  });
  const numTicks = getNumTicks(scaleType, parentSize.width, tickWidth);

  const hasLeftAxis = Object.keys(series).some(
    (key) => series[key].axisConfig === AXIS_CONFIG.left
  );
  const hasRightAxis = Object.keys(series).some(
    (key) => series[key].axisConfig === AXIS_CONFIG.right
  );

  const primaryAxis = series?.[Object.keys(series)[0]]?.primaryAxis;

  // gets the first series label for the given axis
  const getAxisLabel = (axisConfig) => {
    const axisSeries = Object.keys(series).find(
      (key) => series[key].axisConfig === axisConfig
    );

    if (axisSeries) {
      return series[axisSeries]?.axisLabel;
    }
    return '';
  };

  return (
    <>
      <AnimatedGrid columns={false} numTicks={4} animationTrajectory="min" />
      {hasLeftAxis && (
        <AnimatedAxis
          orientation={AXIS_CONFIG.left}
          label={getAxisLabel(AXIS_CONFIG.left)}
          labelOffset={30}
          animationTrajectory="min"
          hideAxisLine
          tickFormat={(value) => {
            // if primary axis is left, no conversion needed
            // otherwise convert to right axis scale
            const adjustedValue =
              primaryAxis === AXIS_CONFIG.left
                ? value
                : scaleValue(value, ranges?.right, ranges?.left);

            return props.tickFormatterVerticalAxis(
              adjustedValue,
              AXIS_CONFIG.left
            );
          }}
        />
      )}
      {hasRightAxis && (
        <AnimatedAxis
          orientation={AXIS_CONFIG.right}
          label={getAxisLabel(AXIS_CONFIG.right)}
          labelOffset={30}
          animationTrajectory="min"
          hideAxisLine
          tickFormat={(value) => {
            // if primary axis is right, no conversion needed
            // otherwise convert to left axis scale
            const adjustedValue =
              primaryAxis === AXIS_CONFIG.right
                ? value
                : scaleValue(value, ranges?.left, ranges?.right);

            return props.tickFormatterVerticalAxis(
              formatAxisTick(adjustedValue),
              AXIS_CONFIG.right
            );
          }}
        />
      )}
      <Axis
        orientation="bottom"
        hideAxisLine
        numTicks={numTicks}
        tickLabelProps={() => {
          let rotateProps = {};

          if (isRotated()) {
            rotateProps = {
              angle: 300,
              textAnchor: 'end',
              dy: '-5',
            };
          }

          return {
            width: tickWidth,
            textAnchor: 'middle',
            verticalAnchor: 'start',
            ...rotateProps,
          };
        }}
        tickFormat={(value) => {
          if (props.tickFormatterHorizonalAxis) {
            return props.tickFormatterHorizonalAxis(value);
          }

          if (props.hasLongitudinal) {
            return formatDateValue(value, series, locale);
          }

          if (isRotated()) {
            return _truncate(value, {
              ommission: '...',
              length: 15,
            });
          }

          return value;
        }}
      />
    </>
  );
}

export default Axes;

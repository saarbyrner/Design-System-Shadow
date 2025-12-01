// @flow

import { useContext } from 'react';
import { DataContext } from '@visx/xychart';
import { Label } from '@visx/annotation';
import getContrastingColor from '@kitman/common/src/utils/getContrastingColor';
import { CHART_BACKGROUND_ZONE_CONDITIONS } from '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel/constants';
import useMultiSeriesScale from '../hooks/useMultiSeriesScale';
import { AXIS_CONFIG } from '../constants';
import { getIsFormattingOutOfChartBounds } from '../utils';

import type { AxisConfig } from '../types';

const TITLE_FONT_SIZE = 12;

type Props = {
  color: string,
  from?: number,
  to?: number,
  axis: AxisConfig,
  label?: string,
  condition: string,
  isPrimaryAxis: boolean,
};

function BackgroundZone(props: Props) {
  const { yScale, margin, width, height } = useContext(DataContext);
  const { convertValueWithRanges, ranges } = useMultiSeriesScale();

  const isZoneOutOfBounds = getIsFormattingOutOfChartBounds(
    ranges[props.axis],
    props.to,
    props.from
  );

  if (isZoneOutOfBounds) return null;

  if (!yScale) return null;

  const convert = (value) => {
    // if not primary axis, convert value to primary axis scale
    if (!props.isPrimaryAxis) {
      const secondaryRange = ranges[props.axis];
      const primaryRange = ranges[props.axis === 'left' ? 'right' : 'left'];
      return convertValueWithRanges(value, primaryRange, secondaryRange);
    }

    return value;
  };

  const domainMax = yScale.domain()[1];

  const isGreaterThan =
    props.condition === CHART_BACKGROUND_ZONE_CONDITIONS.greater_than;

  const chartMin = ranges?.[props.axis]?.[0];
  const chartMax = ranges?.[props.axis]?.[1];

  const fromValue = props.from !== undefined ? props.from : chartMin; // if no "from", anchor from chartMin
  const fallbackToValue = isGreaterThan ? domainMax : chartMax; // if the condition is "greater than", extend to top of chart
  const toValue = props.to !== undefined ? props.to : fallbackToValue;

  // yscale converts the data values to pixel values
  const fromY = yScale(convert(fromValue));
  const toY = yScale(convert(toValue));

  // Calculate top and bottom Y positions for the zone, handling out-of-bounds cases
  const zoneTopY =
    props.to !== undefined && props.to > chartMax ? margin.top : toY;
  const zoneBottomY =
    props.from !== undefined && props.from < chartMin
      ? height - margin.bottom
      : fromY;
  const zoneRectY = Math.min(zoneTopY, zoneBottomY);
  const zoneRectHeight = Math.abs(zoneBottomY - zoneTopY);

  const BOUNDS = {
    left: margin.left,
    right: width - margin.right - margin.left,

    top: toY, // top of the zone is the the yScale value of the "to" provided
    bottom: Math.max(fromY, toY) - Math.min(fromY, toY),
  };

  const rightX = BOUNDS.left + BOUNDS.right;

  const textColor = getContrastingColor(props.color);
  const labelLength = props.label ? props.label.length : 0;
  const labelY =
    props.to !== undefined && props.to > chartMax ? margin.top : BOUNDS.top;

  return (
    <>
      <rect
        x={BOUNDS.left}
        y={zoneRectY}
        width={BOUNDS.right}
        height={zoneRectHeight}
        fillOpacity={0.3}
        fill={props.color}
      />
      <line
        x1={props.axis === AXIS_CONFIG.left ? BOUNDS.left : rightX}
        x2={props.axis === AXIS_CONFIG.left ? BOUNDS.left : rightX}
        y1={zoneRectY}
        y2={zoneBottomY}
        stroke={props.color}
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
        shapeRendering="crispEdges"
      />
      {props.label ? (
        <Label
          title={props.label}
          titleFontSize={TITLE_FONT_SIZE}
          titleFontWeight={500}
          maxWidth={200}
          width={labelLength * (TITLE_FONT_SIZE * 0.6) + 5} // approximate width based on character count
          backgroundFill={props.color}
          backgroundPadding={1}
          fontColor={textColor}
          verticalAnchor="start"
          showAnchorLine={false}
          horizontalAnchor={props.axis === AXIS_CONFIG.left ? 'start' : 'end'}
          x={props.axis === AXIS_CONFIG.left ? BOUNDS.left : rightX}
          y={labelY}
          backgroundProps={{
            fillOpacity: 0.8,
          }}
          titleProps={{
            fontFamily: 'Chivo Mono',
          }}
        />
      ) : null}
    </>
  );
}

export default BackgroundZone;

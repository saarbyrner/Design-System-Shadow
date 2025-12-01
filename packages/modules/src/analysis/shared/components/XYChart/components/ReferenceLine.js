// @flow
import { useContext } from 'react';
import { DataContext } from '@visx/xychart';
import { Label } from '@visx/annotation';
import getContrastingColor from '@kitman/common/src/utils/getContrastingColor';
import useMultiSeriesScale from '../hooks/useMultiSeriesScale';
import { AXIS_CONFIG } from '../constants';
import { getIsFormattingOutOfChartBounds } from '../utils';

import type { AxisConfig } from '../types';

const TITLE_FONT_SIZE = 12;

type Props = {
  color: string,
  axis: AxisConfig,
  label?: string,
  value: number,
  isPrimaryAxis: boolean,
};

function ReferenceLine(props: Props) {
  const { yScale, margin, width } = useContext(DataContext);
  const { convertValueWithRanges, ranges } = useMultiSeriesScale();

  const isReferenceValueOutOfBounds = getIsFormattingOutOfChartBounds(
    ranges[props.axis],
    props.value,
    props.value
  );

  if (isReferenceValueOutOfBounds) return null;

  if (!yScale) return null;

  const convert = (value) => {
    // if not primary axis, convert value to primary range
    if (!props.isPrimaryAxis) {
      const secondaryRange = ranges[props.axis];
      const primaryRange = ranges[props.axis === 'left' ? 'right' : 'left'];
      return convertValueWithRanges(value, primaryRange, secondaryRange);
    }

    return value;
  };

  const y = yScale(convert(props.value));
  const leftX = margin.left;
  const rightX = width - margin.right;
  const textColor = getContrastingColor(props.color);

  const labelOffset = 1;
  const labelY = y + labelOffset;
  const labelLength = props.label ? props.label.length : 0;

  return (
    <>
      <line
        x1={leftX}
        x2={rightX}
        y1={y}
        y2={y}
        stroke={props.color}
        strokeWidth={2}
        strokeDasharray="8 4"
        vectorEffect="non-scaling-stroke"
        shapeRendering="crispEdges"
      />
      {props.label ? (
        <Label
          title={props.label}
          titleFontSize={TITLE_FONT_SIZE}
          titleFontWeight={500}
          maxWidth={200}
          width={labelLength * (TITLE_FONT_SIZE * 0.6) + 5}
          backgroundFill={props.color}
          backgroundPadding={1}
          fontColor={textColor}
          verticalAnchor="end"
          showAnchorLine={false}
          horizontalAnchor={props.axis === AXIS_CONFIG.left ? 'start' : 'end'}
          x={props.axis === AXIS_CONFIG.left ? leftX : rightX}
          y={labelY}
          backgroundProps={{ fillOpacity: 0.8 }}
          titleProps={{ fontFamily: 'Chivo Mono' }}
        />
      ) : null}
    </>
  );
}
export default ReferenceLine;

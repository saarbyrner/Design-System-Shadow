// @flow
import { useState } from 'react';
import { Annotation, HtmlLabel, Connector } from '@visx/annotation';
import { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { animated, useTransition, to } from '@react-spring/web';
import { colors } from '@kitman/common/src/variables';
import type { TooltipData } from '@kitman/modules/src/analysis/shared/components/PieChart/types';
import {
  getLabelDisplacementCoordinates,
  getPercentageValueFromArc,
  getQuadrant,
  fromLeaveTransition,
  enterUpdateTransition,
} from '../utils';

import type {
  PieDatumProps,
  ValueFormatter,
  PieChartOptions,
  PieSeriesType,
} from '../types';
import { transitionConfig } from '../constants';

const style = {
  valueText: {
    fontSize: '11px',
    fontWeight: 700,
    lineHeight: '14px',
    opacity: 1,
  },
  labelText: {
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: '11px',
    opacity: 1,
    padding: '5px',
    whiteSpace: 'nowrap',
  },
  arcTransition: {
    transition: 'opacity 0.2s ease-in-out',
  },
};

type Props<Datum> = ProvidedProps<Datum> & {
  animate: boolean,
  type: PieSeriesType,
  getKey: (d: PieArcDatum<Datum>) => string,
  colorAccessor: (d: PieArcDatum<Datum>) => string,
  onClickDatum: (d: PieArcDatum<Datum>) => void,
  valueFormatter: ValueFormatter,
  chartOptions: PieChartOptions,
  onMouseOut?: () => void,
  onMouseOver?: (event: MouseEvent, data: TooltipData) => void,
};

function AnimatedPie({
  animate,
  type,
  arcs,
  path,
  getKey,
  colorAccessor,
  valueFormatter,
  chartOptions,
  onMouseOut,
  onMouseOver,
}: Props<PieDatumProps>) {
  const [hoveredKey, setHoveredKey] = useState<?string>(null);
  const transitions = useTransition(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
    config: transitionConfig,
    expires: true,
  });

  const getArcOpacity = (key: string) => ({
    opacity: hoveredKey !== null && hoveredKey !== key ? 0.3 : 1,
  });

  // this prevents old labels from rendering when data changes
  if (arcs?.length === 0) return null;

  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);

    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.25;

    const midPointQuadrant = getQuadrant(arc);

    const horizontalPosition = midPointQuadrant > 2 ? -1 : 1;

    const verticalPosition =
      midPointQuadrant === 2 || midPointQuadrant === 3 ? -1 : 1;

    const { dx, dy } = getLabelDisplacementCoordinates(
      horizontalPosition,
      verticalPosition,
      type
    );

    return (
      <g key={key}>
        <animated.path
          // compute to path d attribute from intermediate angle values
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            })
          )}
          css={[style.arcTransition, getArcOpacity(key)]}
          fill={colorAccessor(arc.data)}
          onClick={() => {
            // leaving this in for now as a future ticket my need to utilise it
            // onClickDatum(arc)
          }}
          onTouchStart={() => {
            // leaving this in for now as a future ticket my need to utilise it
            // onClickDatum(arc)
          }}
          onMouseOver={(event) => {
            setHoveredKey(key);
            onMouseOver?.(event, {
              ...arc.data,
              color: colorAccessor(arc.data),
              percentage: getPercentageValueFromArc(arc, arcs),
            });
          }}
          onMouseOut={() => {
            setHoveredKey(null);
            onMouseOut?.();
          }}
        />
        {hasSpaceForLabel && (
          <>
            {/* Shows labels on the pie arcs */}
            {chartOptions?.show_label && (
              <Annotation x={centroidX} y={centroidY} dx={dx} dy={dy}>
                <Connector type="line" />
                <HtmlLabel
                  showAnchorLine={false}
                  horizontalAnchor={horizontalPosition < 0 ? 'end' : 'start'}
                  verticalAnchor="middle"
                >
                  <div css={style.labelText}>{getKey(arc)}</div>
                </HtmlLabel>
              </Annotation>
            )}
            {chartOptions?.show_values && (
              <animated.g>
                <text
                  x={centroidX}
                  y={centroidY}
                  dy=".33em"
                  fontSize={9}
                  textAnchor="middle"
                  pointerEvents="none"
                  stroke={colors.white}
                  strokeWidth="2px"
                  paintOrder="stroke"
                  style={style.valueText}
                >
                  {valueFormatter({ value: arc.value, addDecorator: true })}
                </text>
              </animated.g>
            )}
            {chartOptions?.show_percentage && (
              <animated.g>
                <text
                  x={centroidX}
                  y={centroidY + 12}
                  dy=".33em"
                  fontSize={9}
                  textAnchor="middle"
                  pointerEvents="none"
                  stroke={colors.white}
                  strokeWidth="2px"
                  paintOrder="stroke"
                  style={style.valueText}
                >
                  {`${getPercentageValueFromArc(arc, arcs)}%`}
                </text>
              </animated.g>
            )}
          </>
        )}
      </g>
    );
  });
}

export default AnimatedPie;

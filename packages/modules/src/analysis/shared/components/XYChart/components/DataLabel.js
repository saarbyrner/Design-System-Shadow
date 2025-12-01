// @flow
import { GlyphSeries } from '@visx/xychart';
import { useMemo, useRef, useCallback } from 'react';

import type { CommonSeriesProps } from './SeriesWrapper';
import type { ValueAccessor } from '../types';

import { MIN_SPACING_LABEL } from '../constants';

const style = {
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: '14px',
  opacity: 0,
};

type Props = {
  ...CommonSeriesProps,
  labelAccessor: ValueAccessor,
  showLabels?: boolean,
  displayAllLabels?: boolean,
};

const DataLabel = ({
  id,
  data,
  valueAccessor,
  categoryAccessor,
  labelAccessor,
  showLabels,
  displayAllLabels,
  valueFormatter,
}: Props) => {
  const previousXValues = useRef(undefined);
  const renderCounter = useRef(0);

  const canvas = useMemo(() => {
    if (typeof document !== 'undefined') {
      const canvasElement = document.createElement('canvas');
      return canvasElement.getContext('2d');
    }
    return null;
  }, []);

  const renderGlyph = useCallback(
    ({ datum, x, y }) => {
      if (!canvas) return null;

      const value = labelAccessor(datum);
      const text = valueFormatter?.({
        value,
      });

      const textWidth = canvas.measureText(text).width;

      // Measure text width for spacing, if it's not a group series
      let shouldRender = true;
      if (!displayAllLabels) {
        // Determine if there’s enough space to render the label
        const previousValue = previousXValues.current;
        const isEnoughSpace =
          previousValue === undefined
            ? true
            : Math.abs(x - previousValue) >= textWidth + MIN_SPACING_LABEL;

        // Render all labels if there's enough space, otherwise render every other label
        shouldRender = isEnoughSpace || renderCounter.current % 2 === 0;

        // Update the stored x-coordinate for the next iteration
        previousXValues.current = x;

        // Increment the render counter to track how many labels have been processed
        renderCounter.current += 1;
      }

      return (
        <text
          data-testid="XYChart|DataLabel"
          textAnchor="middle"
          x={x}
          y={y}
          stroke="white"
          strokeWidth="2px"
          paintOrder="stroke"
          style={{
            ...style,
            ...(shouldRender && { opacity: 1 }),
          }}
        >
          {text}
        </text>
      );
    },
    [canvas, valueAccessor]
  );

  if (!showLabels) {
    return null;
  }

  return (
    <GlyphSeries
      dataKey={id}
      data={data}
      yAccessor={valueAccessor}
      xAccessor={categoryAccessor}
      renderGlyph={renderGlyph}
    />
  );
};

export default DataLabel;

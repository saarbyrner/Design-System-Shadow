// @flow
import { useContext, useMemo } from 'react';
import { DataContext } from '@visx/xychart';
import { colors } from '@kitman/common/src/variables';
import type {
  ValueFormatter,
  ValueAccessor,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type { SummaryValueDataShape } from '@kitman/modules/src/analysis/shared/types/charts';

const style = {
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: '14px',
  opacity: 0,
};

type Props = {
  dataKey: string,
  data: Array<SummaryValueDataShape>,
  showLabels?: boolean,
  valueFormatter?: ValueFormatter,
  hideSeries?: boolean,
  labelAccessor: ValueAccessor,
};

const CustomAreaGlyph = ({
  data,
  showLabels,
  dataKey,
  valueFormatter,
  hideSeries,
  labelAccessor,
}: Props) => {
  const { xScale, yScale, dataRegistry, colorScale } = useContext(DataContext);

  const series = dataRegistry.get(dataKey);
  const color = colorScale?.(dataKey);

  // Remove unused values
  const seriesData = useMemo(() => {
    return (
      series?.data?.filter(
        (item) =>
          Array.isArray(item) &&
          item.every((value) => value != null && !Number.isNaN(value))
      ) || []
    );
  }, [series?.data]);

  if (!seriesData || !xScale || !yScale) return null;

  const glphyStyle = {
    opacity: hideSeries ? '0' : '1',
  };

  return (
    <>
      {data?.map((datum, index) => {
        // X-position of the line
        const lineX = xScale(datum?.label);
        // Prevent <text> rendering if x-position is invalid or datum value is falsy
        if (lineX == null || lineX <= 0 || !datum.value) return null;

        // Y-position of the top line: The value at index 1 represents the current data point.
        // The value at index 0 represents the previous value in the series. E.g. [80, 160]
        const barY = yScale(seriesData?.[index]?.[1]);
        const bandScaleOffset = xScale.bandwidth() / 2;

        const labelXPosition = lineX + bandScaleOffset;
        const value = labelAccessor(datum);
        const text = valueFormatter?.({
          value,
        });

        return (
          <g key={`${datum.label}-${datum.value}`} style={glphyStyle}>
            <circle
              r={2}
              fill={color}
              stroke="white"
              strokeWidth="0"
              cx={labelXPosition}
              cy={barY}
            />
            <text
              x={labelXPosition}
              y={barY}
              stroke={colors.white}
              strokeWidth="2px"
              paintOrder="stroke"
              textAnchor="middle"
              style={{
                ...style,
                ...(showLabels && { opacity: 1 }),
              }}
            >
              {text}
            </text>
          </g>
        );
      })}
    </>
  );
};

export default CustomAreaGlyph;

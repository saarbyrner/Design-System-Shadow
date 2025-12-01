// @flow
import { useContext, useMemo } from 'react';
import { DataContext } from '@visx/xychart';
import type {
  ValueFormatter,
  ValueAccessor,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';

const style = {
  fontSize: '11px',
  fontWeight: 700,
  lineHeight: '14px',
  opacity: 0,
};

type Props = {
  dataKey: string,
  data: Object,
  showLabels?: boolean,
  valueFormatter?: ValueFormatter,
  labelAccessor: ValueAccessor,
};

const StackDataLabel = ({
  data,
  showLabels,
  dataKey,
  valueFormatter,
  labelAccessor,
}: Props) => {
  const { xScale, yScale, dataRegistry } = useContext(DataContext);

  const series = dataRegistry.get(dataKey);

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

  return (
    <>
      {data?.map((datum, index) => {
        // X-position of the bar
        const barX = xScale(datum?.label);
        // Prevent <text> rendering if x-position is invalid or datum value is falsy
        if (barX == null || barX <= 0 || !datum.value) return null;

        // Y-position of the top bar: The value at index 1 represents the current data point.
        // The value at index 0 represents the previous value in the series. E.g. [80, 160]
        const barY = yScale(seriesData?.[index]?.[1]);
        const bandScaleOffset = xScale.bandwidth() / 2;

        const labelXPosition = barX + bandScaleOffset;
        const value = labelAccessor(datum);
        const text = valueFormatter?.({
          value,
        });

        return (
          <text
            key={`${datum.label}-${datum.value}`}
            x={labelXPosition}
            y={barY}
            stroke="white"
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
        );
      })}
    </>
  );
};

export default StackDataLabel;

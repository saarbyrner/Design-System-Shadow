// @flow
import { useContext } from 'react';
import { scaleBand } from '@visx/scale';
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
  groupKeys: string[],
  label: string,
  showLabels?: boolean,
  valueFormatter?: ValueFormatter,
  labelAccessor: ValueAccessor,
};

const GroupDataLabel = ({
  groupKeys,
  label,
  showLabels,
  dataKey,
  valueFormatter,
  labelAccessor,
}: Props) => {
  const { xScale, yScale, dataRegistry } = useContext(DataContext);

  const series = dataRegistry.get(dataKey);

  if (!series || !xScale || !yScale) return null;

  const x0Scale = scaleBand({
    domain: groupKeys,
    range: [0, xScale.bandwidth()], // Width of each group
    padding: 0.1,
  });

  return (
    <>
      {series.data?.map((datum) => {
        const groupX = xScale(datum.label); // X position of the group
        const barX = x0Scale(label); // x position of the bar between the group
        // Prevent <text> to render if x-position is null or undefined
        if (barX == null || groupX == null || groupX <= 0) return null;

        const value = labelAccessor(datum);
        const barY = yScale(value); // y position of the bar
        const bandScaleOffset = x0Scale.bandwidth() / 2;

        const labelXPosition = groupX + barX + bandScaleOffset;
        const text = valueFormatter?.({
          value,
        });

        return (
          <text
            key={datum.label}
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

export default GroupDataLabel;

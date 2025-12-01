// @flow

import Pie from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import _find from 'lodash/find';

import type { TooltipData } from '@kitman/modules/src/analysis/shared/components/PieChart/types';
import type { SeriesLabel } from '@kitman/modules/src/analysis/shared/components/XYChart/hooks/useChartControlsState';
import { defaultMargin } from '../constants';
import useCalculatePieDimensions from '../hooks/useCalculatePieDimensions';
import { handlePieSort } from '../utils';
import AnimatedPie from './AnimatedPie';
import type {
  CommonPieProps,
  DefaultMarginType,
  PieChartOptions,
} from '../types';

type Props = {|
  ...CommonPieProps,
  width: number,
  height: number,
  margin?: DefaultMarginType,
  animate?: boolean,
  chartOptions: PieChartOptions,
  onMouseOut?: () => void,
  onMouseOver?: (event: MouseEvent, data: TooltipData) => void,
  hiddenSeries?: Array<SeriesLabel>,
|};

function PieChart({
  width,
  height,
  margin = defaultMargin,
  animate = true,
  data = [],
  colors,
  type,
  valueAccessor,
  labelAccessor,
  valueFormatter,
  chartOptions,
  onMouseOver,
  onMouseOut,
  hiddenSeries,
}: Props) {
  const { radius, innerRadius, centerX, centerY, padAngle } =
    useCalculatePieDimensions({
      width,
      height,
      margin,
      type,
    });

  if (width < 10) return null;

  const domain = data.map(labelAccessor);
  const getBrowserColor = scaleOrdinal({
    domain,
    range: colors,
  });

  const filteredData = data.filter(
    (item) => !_find(hiddenSeries, { datum: labelAccessor(item) })
  );

  return (
    <svg width={width} height={height}>
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={filteredData}
          pieValue={valueAccessor}
          outerRadius={radius}
          innerRadius={innerRadius}
          padAngle={padAngle}
          pieSort={handlePieSort}
        >
          {(pie) => (
            <AnimatedPie
              {...pie}
              radius={radius}
              animate={animate}
              getKey={(arc) => labelAccessor(arc.data)}
              colorAccessor={(item) => getBrowserColor(labelAccessor(item))}
              valueFormatter={valueFormatter}
              chartOptions={chartOptions}
              onMouseOut={onMouseOut}
              onMouseOver={onMouseOver}
              type={type}
            />
          )}
        </Pie>
      </Group>
    </svg>
  );
}

export default PieChart;

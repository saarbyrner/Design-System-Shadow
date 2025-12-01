// @flow
import { useState } from 'react';
import { ParentSize } from '@visx/responsive';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LEGEND_HEIGHT } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import type { TooltipData } from '@kitman/modules/src/analysis/shared/components/PieChart/types';
import type { SeriesLabel } from '@kitman/modules/src/analysis/shared/components/XYChart/hooks/useChartControlsState';

import PieChart from './components/PieChart';
import LegendWrapper from './components/LegendWrapper';
import Tooltip from './components/Tootip';
import useProcessSeriesData from './hooks/useProcessSeriesData';
import type { CommonPieProps, PieChartOptions } from './types';

type Props = {|
  ...CommonPieProps,
  chartOptions: PieChartOptions,
  sourceName: string,
|};

function ChartWrapper(props: Props) {
  const [hiddenSeries, setHiddenSeries] = useState<Array<SeriesLabel>>([]);
  const { show_legend: showLegend } = props.chartOptions;
  const pieHeight = (height) => height - (showLegend ? LEGEND_HEIGHT : 0);
  const { sourceName, ...commonProps } = props;

  const { processedData, otherSegment } = useProcessSeriesData({
    data: props.data,
    valueAccessor: props.valueAccessor,
  });

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const handleMouseOver = (event: MouseEvent, data: TooltipData) => {
    // $FlowFixMe it does not include type SVGElement to cast to
    const coords = localPoint(event.target?.ownerSVGElement, event);

    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: data,
    });
  };

  return (
    <ParentSize>
      {({ width, height }) => (
        <div css={{ position: 'relative' }}>
          <PieChart
            {...commonProps}
            data={processedData}
            width={width}
            height={pieHeight(height)}
            chartOptions={props.chartOptions}
            onMouseOver={handleMouseOver}
            onMouseOut={hideTooltip}
            hiddenSeries={hiddenSeries}
          />
          {showLegend && (
            <LegendWrapper
              data={processedData}
              labelAccessor={props.labelAccessor}
              colors={props.colors}
              hiddenSeries={hiddenSeries}
              setHiddenSeries={setHiddenSeries}
            />
          )}
          {tooltipOpen && (
            <Tooltip
              data={tooltipData}
              left={tooltipLeft}
              top={tooltipTop}
              sourceName={props.sourceName}
              seriesData={props.data}
              otherSegment={otherSegment}
              valueAccessor={props.valueAccessor}
            />
          )}
        </div>
      )}
    </ParentSize>
  );
}

export default ChartWrapper;

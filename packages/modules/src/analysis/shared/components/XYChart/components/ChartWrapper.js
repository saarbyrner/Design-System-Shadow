// @flow
import { type Node, useMemo } from 'react';
import { lightTheme, DataProvider, XYChart } from '@visx/xychart';
import { DEFAULT_COLORS } from '@kitman/modules/src/analysis/shared/constants';
import { SCROLL_BAR_HEIGHT, LEGEND_HEIGHT } from '../constants';
import useChartContext from '../hooks/useChartContext';
import useScales from '../hooks/useScales';
import useScrollControls from '../hooks/useScrollControls';
import LegendWrapper from './LegendWrapper';

type Props = {
  children: Node,
  colorPallette?: Array<string>,
};

function ChartWrapper(props: Props) {
  const {
    parentSize,
    controls: { scroll },
    series,
  } = useChartContext();

  const { metadata } = useScrollControls();
  const { xScale, yScale } = useScales();
  const seriesIds = Object.keys(series);

  const isMultiSeries = seriesIds?.length > 1;

  const isGrouped = series?.[seriesIds[0]]
    ? series[seriesIds[0]]?.isGrouped
    : false;

  const chartHeight = useMemo(() => {
    let height = parentSize?.height;

    if ((isGrouped || isMultiSeries) && height) {
      height -= LEGEND_HEIGHT;
    }
    if (scroll.isActive && height) {
      height -= SCROLL_BAR_HEIGHT;
    }

    return height;
  }, [scroll.isActive, parentSize.height, isGrouped, isMultiSeries]);

  const chartMargin = useMemo(() => {
    if (metadata.shouldHaveScrollBar) {
      return { bottom: 100, top: 8, left: 70, right: 70 };
    }
    return { bottom: 50, top: 30, left: 70, right: 70 };
  }, [metadata.shouldHaveScrollBar]);

  return (
    <DataProvider
      yScale={yScale}
      xScale={xScale}
      theme={{
        ...lightTheme,
        colors: props.colorPallette || DEFAULT_COLORS,
      }}
    >
      <XYChart
        width={parentSize.width}
        height={chartHeight}
        margin={chartMargin}
      >
        {props.children}
      </XYChart>
      <LegendWrapper />
    </DataProvider>
  );
}

export default ChartWrapper;

// @flow
import type { Node } from 'react';
import { ParentSize } from '@visx/responsive';
import { ChartContextProvider } from './components/Context';
import { AggregatorSelectorTranslated as AggregatorSelector } from './components/AggregatorSelector';
import { SortSelectorTranslated as SortSelector } from './components/SortSelector';
import ChartWrapper from './components/ChartWrapper';
import CategorySeries from './components/CategorySeries';
import DateTimeSeries from './components/DateTimeSeries';
import SeriesGroup from './components/SeriesGroup';
import Axes from './components/Axes';
import Tooltip from './components/Tooltip';
import ScrollBar from './components/ScrollBar';
import BackgroundZone from './components/BackgroundZone';

type Props = {
  children: Node,
  locale?: ?string,
  colorPallette?: Array<string>,
  showSortOption?: boolean,
  onSortChange?: Function,
  chartId: number,
};

function index(props: Props) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <ChartContextProvider
          height={height}
          width={width}
          locale={props.locale}
        >
          <ChartWrapper colorPallette={props.colorPallette}>
            {props.children}
          </ChartWrapper>
          <ScrollBar />
          <AggregatorSelector />
          {props.showSortOption && (
            <SortSelector
              onSortChange={props.onSortChange}
              chartId={props.chartId}
            />
          )}
        </ChartContextProvider>
      )}
    </ParentSize>
  );
}

export {
  BackgroundZone,
  CategorySeries,
  DateTimeSeries,
  Axes,
  Tooltip,
  SeriesGroup,
};

export default index;

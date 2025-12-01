// @flow
import type {
  ChartOptionTypes,
  SortConfig,
  DefaultSortFunction,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import SeriesWrapper from './SeriesWrapper';
import SeriesGroup from './SeriesGroup';
import SeriesRender from './SeriesRender';
import type { CommonSeriesProps } from './SeriesWrapper';

type Props = {|
  ...CommonSeriesProps,
  showLabels?: boolean,
  isGrouped: boolean,
  renderAs: 'group' | 'stack' | null,
  chartOptions: ChartOptionTypes,
  sortConfig: SortConfig,
  defaultSortFunction: ?DefaultSortFunction,
  name: string,
|};

function CategorySeries(props: Props) {
  return (
    <SeriesWrapper
      dataType="category"
      type={props.type}
      categoryAccessor={props.categoryAccessor}
      valueAccessor={props.valueAccessor}
      valueFormatter={props.valueFormatter}
      data={props.data}
      id={props.id}
      isGrouped={props.isGrouped}
      axisConfig={props.axisConfig}
      chartOptions={props.chartOptions}
      sortConfig={props.sortConfig}
      defaultSortFunction={props.defaultSortFunction}
      name={props.name}
      axisLabel={props.axisLabel}
      primaryAxis={props.primaryAxis}
    >
      {props.isGrouped && props.renderAs && (
        <SeriesGroup
          dataType="category"
          type={props.type}
          categoryAccessor={props.categoryAccessor}
          valueAccessor={props.valueAccessor}
          valueFormatter={props.valueFormatter}
          data={props.data}
          id={props.id}
          renderAs={props.renderAs}
          axisConfig={props.axisConfig}
          showLabels={props.showLabels}
          sortConfig={props.sortConfig}
          axisLabel={props.axisLabel}
          primaryAxis={props.primaryAxis}
        />
      )}
      {!props.isGrouped && (
        <SeriesRender
          dataType="category"
          type={props.type}
          categoryAccessor={props.categoryAccessor}
          valueAccessor={props.valueAccessor}
          valueFormatter={props.valueFormatter}
          data={props.data}
          showLabels={props.showLabels}
          id={props.id}
          axisConfig={props.axisConfig}
          axisLabel={props.axisLabel}
          primaryAxis={props.primaryAxis}
        />
      )}
    </SeriesWrapper>
  );
}

export default CategorySeries;

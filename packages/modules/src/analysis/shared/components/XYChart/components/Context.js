// @flow
import type { Node } from 'react';
import { useMemo, createContext, useState } from 'react';
import type {
  ChartOptionTypes,
  SortConfig,
  AggregateValues,
  DefaultSortFunction,
} from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import useChartControlsState, {
  type ChartControls,
  type ControlsApi,
  INITIAL_CONTROLS,
  INITIAL_CONTROLS_API,
} from '../hooks/useChartControlsState';
import { SERIES_TYPES, AXIS_CONFIG } from '../constants';
import type {
  SeriesType,
  SeriesDataType,
  ValueFormatter,
  ValueAccessor,
  CategoryAccessor,
  RenderSeriesType,
  AxisConfig,
} from '../types';

type ChartSeriesID = string | number;
type ChartSeries = {
  id: ChartSeriesID,
  data: Array<Object>,
  categoryAccessor: CategoryAccessor,
  valueAccessor: ValueAccessor,
  valueFormatter: ValueFormatter,
  type: SeriesType,
  dataType: SeriesDataType,
  aggregateValues?: AggregateValues,
  showAggregatorSelector?: boolean,
  onChangeAggregatePeriod?: Function,
  isGrouped: boolean,
  renderAs: RenderSeriesType,
  axisConfig: AxisConfig,
  chartOptions?: ChartOptionTypes,
  sortConfig?: SortConfig,
  defaultSortFunction?: ?DefaultSortFunction,
  name: string,
  axisLabel: string,
  primaryAxis: AxisConfig,
};
type ChartSeriesShape = $Shape<ChartSeries>;

const EMPTY_CHART_SERIES: ChartSeries = {
  id: -1,
  data: [],
  dataType: 'category',
  type: SERIES_TYPES.bar,
  categoryAccessor: ({ label }) => label,
  valueAccessor: ({ value }) => value,
  valueFormatter: ({ value }) => (value === null ? '' : `${value}`),
  isGrouped: false,
  renderAs: null,
  axisConfig: AXIS_CONFIG.left,
  chartOptions: { hide_null_values: false, hide_zero_values: false },
  name: '',
  axisLabel: '',
  primaryAxis: AXIS_CONFIG.left,
};

export type ChartContextType = {|
  series: {
    [string]: ChartSeries,
  },
  registerSeries: (id: ChartSeriesID, series: ChartSeriesShape) => void,
  updateSeries: (id: ChartSeriesID, series: ChartSeriesShape) => void,
  destroySeries: (id: ChartSeriesID) => void,
  parentSize: {
    width: number | null,
    height: number | null,
  },
  controls: ChartControls,
  controlsApi: ControlsApi,
  locale?: ?string,
|};

export const DEFAULT_CONTEXT_VALUE: ChartContextType = {
  series: {},
  registerSeries: () => {},
  updateSeries: () => {},
  destroySeries: () => {},
  parentSize: {
    width: null,
    height: null,
  },
  controls: INITIAL_CONTROLS,
  controlsApi: INITIAL_CONTROLS_API,
};

const ChartContext = createContext<ChartContextType>(DEFAULT_CONTEXT_VALUE);

type ChartContextProviderProps = {
  children: Node,
  width: number,
  height: number,
  locale?: ?string,
};

const ChartContextProvider = (props: ChartContextProviderProps) => {
  const [series, setSeries] = useState<{
    [string]: ChartSeries,
  }>({});
  const registerSeries = (
    id: ChartSeriesID,
    initialSeries: ChartSeriesShape
  ) => {
    setSeries((currentState) => ({
      ...currentState,
      [`${id}`]: {
        ...EMPTY_CHART_SERIES,
        ...initialSeries,
        id,
      },
    }));
  };
  const updateSeries = (id: ChartSeriesID, updatedSeries: ChartSeriesShape) => {
    setSeries((currentState) => ({
      ...currentState,
      [`${id}`]: {
        ...currentState[`${id}`],
        ...updatedSeries,
      },
    }));
  };
  const destroySeries = (id: ChartSeriesID) => {
    setSeries((currentState) => {
      if (!currentState[`${id}`]) {
        return currentState;
      }

      const updatedState = { ...currentState };
      delete updatedState[`${id}`];
      return updatedState;
    });
  };
  const { controls, controlsApi } = useChartControlsState();

  const value: ChartContextType = useMemo(
    () => ({
      ...DEFAULT_CONTEXT_VALUE,
      series,
      registerSeries,
      updateSeries,
      destroySeries,
      parentSize: { width: props.width, height: props.height },
      controls,
      controlsApi,
      locale: props?.locale,
    }),
    [props.height, props.width, series, controls, controlsApi, props.locale]
  );

  return (
    <ChartContext.Provider value={value}>
      {props.children}
    </ChartContext.Provider>
  );
};

export { ChartContextProvider };
export default ChartContext;

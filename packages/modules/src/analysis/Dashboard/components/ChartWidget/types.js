// @flow
import type {
  ChartElement,
  ChartType,
} from '@kitman/modules/src/analysis/shared/types/charts';
import type { WidgetShape } from '../../types';

export const CHART_TYPE = {
  value: 'value',
  xy: 'xy',
  radial: 'radial',
  pie: 'pie',
};
export type CoreChartType = $Values<typeof CHART_TYPE>;

export type ChartWidgetType = {
  id: number | string,
  name: string,
  chart_id: number,
  config?: Object,
  chart_type: ChartType,
  chart_elements: ChartElement[],
};

export type ChartWidgetData = WidgetShape<ChartWidgetType, 'chart'>;

type ID = string | number;

export type PivotData = {
  pivotedDateRange?: {
    start_date?: string,
    end_date?: string,
  },
  pivotedPopulation?: {
    applies_to_squad: boolean,
    all_squads: boolean,
    position_groups: Array<ID>,
    positions: Array<ID>,
    athletes: Array<ID>,
    squads: Array<ID>,
  },
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
};

export type ChartWidgetFormatRule = {
  condition: string,
  value: number | { from: number, to: number },
  color: string,
  displayText: string,
};
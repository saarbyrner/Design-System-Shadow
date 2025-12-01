// @flow
import type { TableWidgetFormatRule } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';

export type ChartWidgetFormatRule = {
  type: 'zone',
  condition: string,
  value?: number | string,
  from?: number | string,
  to?: number | string,
  color: string,
  textDisplay: string,
};

export type WidgetFormatRule = TableWidgetFormatRule | ChartWidgetFormatRule;

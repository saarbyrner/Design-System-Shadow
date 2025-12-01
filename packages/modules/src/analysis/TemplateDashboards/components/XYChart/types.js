// @flow
import type {
  SummaryValueDataShape,
  GroupedSummaryValueDataShape,
} from '@kitman/modules/src/analysis/shared/types/charts';

export type DataItem = GroupedSummaryValueDataShape | SummaryValueDataShape;
export type Data = Array<DataItem>;

export type ChartData = {
  chart: Data,
  overlays: SummaryValueDataShape[],
  id: string,
};

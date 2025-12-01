// @flow
import { PIE_SERIES_TYPES } from './constants';

export type PieDatumProps = {
  label: string,
  value: string | number | null,
};

export type PieSeriesType = $Values<typeof PIE_SERIES_TYPES>;

export type ValueAccessor = (dataItem: PieDatumProps) => string | number | null;
export type LabelAccessor = (dataItem: PieDatumProps) => string;
export type ValueFormatter = ({
  value: string | number | null,
  addDecorator: boolean,
}) => string;

export type CommonPieProps = {|
  data: Array<PieDatumProps>,
  colors: Array<string>,
  type: PieSeriesType,
  valueAccessor: ValueAccessor,
  labelAccessor: LabelAccessor,
  valueFormatter: ValueFormatter,
|};

export type DefaultMarginType = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};

export type PieChartOptions = {
  show_label: boolean,
  show_values: boolean,
  show_percentage: boolean,
  show_legend: boolean,
};

export type TooltipData = {
  label: string,
  value: ?string,
  percentage: number,
  color: string,
};

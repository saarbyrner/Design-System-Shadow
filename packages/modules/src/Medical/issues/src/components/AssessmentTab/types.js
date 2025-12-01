// @flow
export type dateValueRow = {
  date: string,
  id: string,
  value: string,
  backgroundAlert: string,
};

export type subRowData = {
  [string]: dateValueRow,
  column_section: string,
  column_baseline: string,
};

export type responseDataRow = {
  [string]: dateValueRow,
  column_section: string,
  column_baseline: string,
  sub_rows?: subRowData[],
  expanded: boolean,
  type: string,
};

export type columnDataType = {
  frozen: boolean,
  idx: number,
  isLastFrozenColumn: boolean,
  key: string,
  maxWidth: number | null,
  minWidth: number | null,
  name: string,
  resizable: boolean,
  rowGroup: boolean,
  sortable: boolean,
  width: number,
};
export type columnCellDataType = {
  column: columnDataType,
  isCellSelected: boolean,
  row: responseDataRow,
  type: string,
};

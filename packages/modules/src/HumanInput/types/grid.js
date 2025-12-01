// @flow

export type Column = {
  id: string,
  row_key: string,
};

export type DataCell = {
  id: string,
  content: any,
};

export type Row = {
  id: number,
  cells: Array<DataCell>,
};

export type GridData = {
  columns: Array<Column>,
  rows: Array<Row>,
  next_id?: ?number,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type GridConfig = {
  rows: Array<Row>,
  columns: Array<Column>,
  emptyTableText: string,
  id: string,
};

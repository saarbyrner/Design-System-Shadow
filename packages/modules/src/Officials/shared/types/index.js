// @flow
export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type Official = {
  avatar_url?: string,
  created_at: string,
  date_of_birth: string,
  division: ?string,
  email: string,
  firstname: string,
  fullname: string,
  id: number,
  lastname: string,
  locale: ?string,
  mobile_number: ?string,
  role: ?string,
  username: string,
  is_active: boolean,
};

export type Filters = {
  search_expression: string,
  include_inactive?: boolean,
  is_active: boolean,
  per_page?: number,
  page?: number,
};

export type RequestResponse = {
  data: Array<Object>,
  meta: Meta,
};

export type Column = {
  id: string,
  row_key: string,
};

export type DataCell = {
  id: string,
  content: any,
};

export type Row = {
  id: number | string,
  cells: Array<DataCell>,
  classnames?: Object,
};

export type GridConfig = {
  rows: Array<Row>,
  columns: Array<Column>,
  emptyTableText: string,
  id: string,
};

export type OfficialForm = {
  firstname: string,
  lastname: string,
  email: string,
  date_of_birth: '',
  is_active: boolean,
};

// @flow
export type AdditionalUserTypes =
  | 'scout'
  | 'official'
  | 'match_director'
  | 'match_monitor';

export type CsvUploadAdditionalUserTypes =
  | 'scout'
  | 'official'
  | 'match_monitor';

export type Mode = 'NEW' | 'EDIT';

export type AdditionalUser = {
  avatar_url?: string,
  created_at: string,
  date_of_birth: string,
  email: string,
  firstname: string,
  fullname: string,
  id: number,
  is_active: boolean,
  lastname: string,
  locale: ?string,
  mobile_number: ?string,
  type: AdditionalUserTypes,
  username: string,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type Filters = {
  search_expression: string,
  is_active: boolean,
  include_inactive: boolean,
  types: Array<AdditionalUserTypes | 'match_director'>,
  per_page: number,
  page: number,
};

export type RequestResponse = {
  data: Array<AdditionalUser>,
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

type AdditionalModelAttributes = Array<{
  attribute_name: string,
  value: string,
}>;

type Attributes = {
  third_party_scout_organisation?: string,
};

export type AdditionalUserFormState = {
  firstname: ?string,
  lastname: ?string,
  email: ?string,
  date_of_birth: ?string,
  locale: ?string,
  assign_squad_ids: ?Array<number>,
  primary_squad: ?number,
  is_active?: boolean,
} & Attributes;

export type AdditionalUserSlice = {
  formState: AdditionalUserFormState,
  additional_model_attributes?: AdditionalModelAttributes,
};

export type OnUpdateAction = {
  payload: $Shape<AdditionalUserSlice>,
};

export type FormInformation = {
  id: ?string,
  userType: ?AdditionalUserTypes,
  mode: ?Mode,
};

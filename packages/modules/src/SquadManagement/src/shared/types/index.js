// @flow
import type { Node } from 'react';

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
  classnames?: Array<Object>,
};

export type GridConfig = {
  rows: Array<Row>,
  columns: Array<Column>,
  emptyTableText: string,
  id: string,
};

export type GridData = {
  columns: Array<Column>,
  rows: Array<Row>,
  next_id?: ?number,
};

type RowKey =
  | 'full_name'
  | 'club'
  | 'id_number'
  | 'location'
  | 'dob'
  | 'level'
  | 'role'
  | 'status'
  | 'team'
  | 'type'
  | 'paid';

export type GridHeader = {
  id: string,
  row_key: RowKey,
  content: Node,
};

export type Address = {
  id: number,
  city: string,
  country: {
    abbreviation: string,
    id: number,
    name: string,
  },
  line_1: string,
  line_2: ?string,
  line_3: ?string,
  state: string,
  zipcode: ?string,
};

export type Organisation = {
  address: ?Address,
  handle: string,
  logo_full_path: ?string,
  id: number,
  name: string,
  shortname: string,
  registration_balance: number,
  total_athletes: number,
  total_squads: number,
  total_coaches: number,
};

export type PlayerType =
  | 'primary'
  | 'future'
  | 'future_affiliate'
  | 'guest'
  | 'late_developer'
  | null;

export type Squad = {
  id: number,
  name: string,
  address: ?Address,
  organisations: Array<Organisation>,
  total_athletes: number,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type Markers = {
  start_season: string,
  in_season: string,
  end_season: string,
};

export type ConferenceDivision = {
  id: number,
  name: string,
  child_divisions: Array<ConferenceDivision>,
  attachment: ?string,
};

export type Division = {
  id: ?number,
  name: string,
  markers: Markers,
  squads: Array<string>,
  child_divisions: Array<ConferenceDivision>,
};

export type SquadSetting = {
  id: number,
  name: string,
  address: ?Address,
  organisations: Array<{ id: number, logo_path: string, name: string }>,
  total_athletes: number,
  total_coaches: number,
  markers: Markers,
  divisions: Array<{ id: number, name: string }>,
};

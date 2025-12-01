// @flow
import type {
  LatestNote,
  AthleteOpenIssues,
} from '@kitman/modules/src/Medical/rosters/types';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';

export type Filters = {
  athlete_name: string,
  positions: Array<number>,
  squads: Array<number>,
  availabilities: Array<number>,
  issues: Array<number>,
};

export type Athlete = {
  availability: AvailabilityStatus,
  extended_attributes: Object,
  avatar_url: string,
  fullname: string,
  position: string,
};

export type Allergy = { id: number, display_name: string, severity: string };

export type RosterAthlete = {
  allergies?: Array<Allergy> | Array<string>,
  athlete: Athlete,
  athlete_medical_alerts: Array<{
    id: number,
    display_name: string,
    severity: string,
  }>,
  availability_status: {
    availability: string,
    unavailable_since: string,
  },
  id: number,
  latest_note: ?LatestNote,
  open_injuries_illnesses: AthleteOpenIssues,
  squad: Array<{ name: string, primary: boolean }>,
};

export type RequestResponse = {
  rows: Array<RosterAthlete>,
  columns: Array<Object>,
  containers: Array<Object>,
  next_id: ?number,
};

export type RequestStatus =
  | 'DORMANT'
  | 'PENDING'
  | 'SUCCESS'
  | 'ERROR'
  | 'UPDATING';

export type RequestState = {
  data: RequestResponse,
  status: RequestStatus,
  error: ?Object,
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
  id: number,
  cells: Array<DataCell>,
  classnames: {
    athlete__row: boolean,
  },
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

export type ReturnType = {
  grid: GridConfig,
  requestStatus: RequestStatus,
  filteredSearchParams: Filters,
  onFetchAthleteRoster: Function,
  onUpdateFilter: Function,
  nextId: ?number,
  isInitialDataLoaded: boolean,
};

export type InitialData = {
  rows: Array<RosterAthlete>,
  columns: Array<Object>,
  containers: Array<Object>,
  next_id: ?number,
};

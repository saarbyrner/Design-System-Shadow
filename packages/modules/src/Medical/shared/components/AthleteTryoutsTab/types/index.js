// @flow
import type {
  TrialRecord,
  Organisation,
} from '@kitman/services/src/services/getAthleteData';

export type Filters = {
  athlete_name: string,
};

export type TryoutAthlete = {
  id: number,
  fullname: string,
  avatar_url: string,
  trial_record: TrialRecord,
  organisations: Array<Organisation>,
};

export type RequestResponse = {
  athletes: Array<TryoutAthlete>,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

export type RequestStatus = 'DORMANT' | 'PENDING' | 'SUCCESS' | 'ERROR';

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
  onFetchTryoutAthletes: Function,
  onUpdateFilter: Function,
};

export type InitialData = {
  athletes: Array<TryoutAthlete>,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

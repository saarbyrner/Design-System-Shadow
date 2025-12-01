// @flow
import type { GridColDef, GridRow } from '@mui/x-data-grid-pro';
import type { Athlete } from '@kitman/modules/src/Medical/shared/types';

export type GridConfig = {
  rows: Array<GridRow>,
  columns: Array<GridColDef>,
  emptyTableText: string,
  id: string,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type PastAthletes = { athletes: Array<Athlete>, meta: Meta };

export type PastAthletesFilters = {
  athlete_name: ?string,
};

export type PastAthletesGridPayload = {
  filters: PastAthletesFilters,
  page: number,
};

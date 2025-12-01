// @flow
import type {
  AthleteOpenIssues,
  Column,
} from '@kitman/modules/src/Medical/rosters/types';

export type GridRow = {
  id: number,
  player_id: string,
  athlete: {
    fullname: string,
    availability: string,
    avatar_url: string,
    position: string,
  },
  availability_status: {
    availability: 'unavailable' | 'available',
    unavailable_since: null,
  },
  availability_comment: string,
  open_injuries_illnesses: AthleteOpenIssues,
  most_recent_coaches_note?: {
    content: string,
    updated_by: {
      id: number,
      fullname: string,
    },
    created_by: {
      id: number,
      fullname: string,
    },
  },
};

export type GridData = {
  columns?: Array<Column>,
  rows: Array<GridRow>,
  next_id: ?number,
};

export type CoachReportFilters = {
  next_id: ?number,
  filters: {
    athlete_name: string,
    positions: Array<number>,
    squads: Array<number>,
    availabilities: [],
    issues: [],
    date: string,
  },
};
export type CoachReportComment = {
  athlete_id: string | number,
  comment: string,
  comment_date: string,
};

export type CoachesNote = { newNoteValue: string, rowId: number };
export type SortModel = Array<{ sort: string, field: string }>;

export type OverviewGridProps = {
  fetchMoreData: () => void,
  rehydrateGrid: () => void,
  addEditComment: (rowData: GridRow, inputValue: ?string) => GridRow,
  dataGridCurrentDate: string,
  grid: GridData,
  isLoading: boolean,
  isReadyForMoreData: boolean,
  coachesReportV2Enabled: boolean,
  coachesReportGridLoaded: () => boolean,
  setRowSelectionModel: (newRowSelectionModel: Array<number>) => void,
  rowSelectionModel: Array<number>,
  setModalIsOpen: (isOpen: boolean) => void,
  isModalOpen: boolean,
  canViewInjuries: boolean,
  canCreateNotes: boolean,
  canViewMedicalAvailability: boolean,
  isInMultiCopyNoteMode: boolean,
  setRequestStatus: (string) => void,
};

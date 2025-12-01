// @flow

import type {
  AthleteOpenIssues,
  Column,
} from '@kitman/modules/src/Medical/rosters/types';
import moment from 'moment';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import type {
  AnnotationForm,
  AnnotationActionsAttributes,
  BulkNoteAnnotationForm,
} from '@kitman/modules/src/Medical/shared/types';
import type { NoteType, RequestStatus } from '../../types';

export type FiltersType = {
  athlete_name: string,
  positions: Array<number>,
  squads: Array<number>,
  availabilities: Array<number>,
  report_date: moment.Moment | string,
  issues: Array<number>,
};

export type Squad = {
  label: string,
  value: number | string,
};

export type CoachesReportPayload = {
  filters: FiltersType,
  next_id: ?number,
};

// When payload is updated only for next_id
export type CoachesReportPayloadNextId = {
  next_id: ?number,
};

export type MedicalNotePayload = {
  annotationable_type: string,
  organisation_annotation_type_id: number,
  annotationable_id: number,
  athlete_id: number,
  title: string,
  annotation_date: string,
  content: string,
  illness_occurrence_ids: Array<number>,
  injury_occurrence_ids: Array<number>,
  chronic_issue_ids: Array<number>,
  restricted_to_doc: boolean,
  restricted_to_psych: boolean,
  attachments_attributes: Array<string>,
  annotation_actions_attributes: AnnotationActionsAttributes,
  scope_to_org: boolean,
};

export type CoachesNotePayload = {
  athleteIds: Array<number>,
  includeCopiedFrom: boolean,
  organisationAnnotationTypes: Array<NoteType>,
  annotationDate: moment.Moment | string,
};
export type CoachesNoteInlinePayload = {
  athleteId: number,
  includeCopiedFrom: boolean,
  organisationAnnotationTypes: Array<string>,
  beforeDate: moment.Moment | string,
};
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
  columns: Array<Column>,
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

export type CoachesNote = { newNoteValue: string, rowId: number };
export type SortModel = Array<{ sort: string, field: string }>;

export type Props = {
  t: Translation,
  permissions: PermissionsType,
  updatePayload: (newFilters: FiltersType) => void,
  handleCopyLastReport: (athleteId: number) => void,
  updateCoachesNotePayLoad: (payload: CoachesNotePayload) => void,
  updateCoachesNoteInlinePayLoad: (payload: CoachesNoteInlinePayload) => void,
  lastCoachesReportNoteData: CoachesNoteInlinePayload,
  isLastCoachesReportNoteSuccess: boolean,
  isLastCoachesReportNoteError: boolean,
  isCoachesNotesFetching: boolean,
  isCoachesNotesSuccess: boolean,
  isCoachesNotesError: boolean,
  grid: GridData,
  rehydrateGrid: () => void,
  updatePayload: (newFilters: FiltersType) => void,
  isLoading: boolean,
  setRowSelectionModel: (newRowSelectionModel: Array<number>) => void,
  rowSelectionModel: Array<number>,
  setModalIsOpen: (isOpen: boolean) => void,
  isModalOpen: boolean,
  canViewInjuries?: boolean,
  canCreateNotes?: boolean,
  canExport?: boolean,
  canViewMedicalIssues?: boolean,
  canViewMedicalAvailability?: boolean,
  isInMultiCopyNoteMode?: boolean,
  requestStatus: RequestStatus,
  setRequestStatus: (string) => void,
  onSetRequestStatus: (string) => void,
  filters: FiltersType,
};
export type OverviewGridProps = {
  grid: GridData,
  updatePayload: (newPayload: CoachesReportPayloadNextId) => void,
  updateCoachesNoteInlinePayLoad: (payload: CoachesNoteInlinePayload) => void,
  lastCoachesReportNoteData: string,
  isLastCoachesReportNoteSuccess: boolean,
  isLastCoachesReportNoteError: boolean,
  fetchNextGridRows: () => void,
  isLoading: boolean,
  dataGridCurrentDate: moment.Moment | string,
  setRowSelectionModel: (newRowSelectionModel: Array<number>) => void,
  rowSelectionModel: Array<number>,
  setModalIsOpen: (isOpen: boolean) => void,
  isModalOpen: boolean,
  canCreateNotes: boolean,
  canViewInjuries: boolean,
  canViewAvailabilityStatus: boolean,
  addBulkMedicalNotes: (payload: BulkNoteAnnotationForm) => void,
  isBulkMedicalNotesSaveError: boolean,
  addMedicalNote: (payload: AnnotationForm) => void,
  editingCellId: number,
  setEditingCellId: (cellId: number) => void,
};

export type ContainerProps = {
  permissions: PermissionsType,
};

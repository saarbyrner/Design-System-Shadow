// @flow
import type { GridColDef } from '@mui/x-data-grid-pro';

export const ASSOCIATION_ORGANISATIONS: Array<GridColDef> = [
  { field: 'organisations', headerName: 'Club', flex: 2, type: 'avatar' },
  { field: 'total_squads', headerName: 'Total Teams', type: 'text' },
  { field: 'total_staff', headerName: 'Total Staff', type: 'text' },
  { field: 'total_athletes', headerName: 'Total Players', type: 'text' },
  { field: 'address', headerName: 'State / Province', type: 'text' },
  {
    field: 'amount_paid',
    headerName: 'Amount paid',
    type: 'currency',
    currency: 'USD',
  },
  {
    field: 'wallet',
    headerName: 'Club wallet',
    type: 'currency',
    currency: 'USD',
  },
];

export const ASSOCIATION_SQUADS: Array<GridColDef> = [
  { field: 'name', headerName: 'Team', type: 'link' },
  { field: 'total_coaches', headerName: 'Total Staff', type: 'text' },
  { field: 'total_athletes', headerName: 'Total Players', type: 'text' },
];

export const ASSOCIATION_ATHLETES: Array<GridColDef> = [
  { field: 'athlete', headerName: 'Player', flex: 1, type: 'avatar' },
  {
    field: 'organisations',
    headerName: 'Club(s)',
    type: 'avatar',
    flex: 1,
  },
  { field: 'id_number', headerName: 'ID Number', type: 'text', flex: 0.45 },
  { field: 'leagues', headerName: 'League(s)', type: 'text' },
  { field: 'date_of_birth', headerName: 'DOB', type: 'text', flex: 0.45 },
  { field: 'position', headerName: 'Position', type: 'text', flex: 0.45 },
  {
    field: 'registration_status',
    headerName: 'Status',
    type: 'status',
    flex: 0.6,
  },
  { field: 'labels', headerName: 'Labels', type: 'labels', flex: 1 },
];

export const ASSOCIATION_ORGANISATION_ATHLETES: Array<GridColDef> =
  ASSOCIATION_ATHLETES;

export const ASSOCIATION_STAFF: Array<GridColDef> = [
  { field: 'user', headerName: 'Coach', flex: 2, type: 'avatar' },
  {
    field: 'organisations',
    headerName: 'Team',
    type: 'avatar',
    flex: 2,
  },
  {
    field: 'leagues',
    headerName: 'League(s)',
    type: 'text',
  },
  { field: 'id_number', headerName: 'ID Number', type: 'text' },
  { field: 'address', headerName: 'State / Province', type: 'text' },
  { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
  { field: 'title', headerName: 'Title', type: 'text' },
  { field: 'registration_status', headerName: 'Status', type: 'status' },
];

export const ASSOCIATION_ORGANISATION_STAFF: Array<GridColDef> =
  ASSOCIATION_STAFF;

export const ATHLETE_REGISTRATION: Array<GridColDef> = [
  { field: 'league', headerName: 'League', type: 'link' },
  { field: 'club', headerName: 'Club', type: 'avatar' },
  { field: 'squad', headerName: 'Squad', type: 'text' },
  { field: 'jersey_no', headerName: 'Jersey No', type: 'text' },
  { field: 'position', headerName: 'Position', type: 'text' },
  { field: 'type', headerName: 'Type', type: 'node' },
  { field: 'registration_status', headerName: 'Status', type: 'status' },
];

export const STAFF_REGISTRATION: Array<GridColDef> = [
  { field: 'league', headerName: 'League', type: 'link' },
  { field: 'title', headerName: 'Title', type: 'text' },
  { field: 'registration_status', headerName: 'Status', type: 'status' },
];

export const ATHLETE_SQUADS: Array<GridColDef> = [
  { field: 'team', headerName: 'Team', type: 'link' },
];

export const ORGANISATION_ATHLETES: Array<GridColDef> = [
  { field: 'athlete', headerName: 'Player', flex: 1, type: 'avatar' },
  { field: 'id_number', headerName: 'ID Number', type: 'text', flex: 0.3 },
  { field: 'teams', headerName: 'Team', type: 'text', flex: 0.5 },
  { field: 'address', headerName: 'State / Province', type: 'text', flex: 0.5 },
  { field: 'date_of_birth', headerName: 'DOB', type: 'text', flex: 0.3 },
  { field: 'jersey_no', headerName: 'Jersey No', type: 'text', flex: 0.3 },
  { field: 'type', headerName: 'Type', type: 'text', flex: 0.5 },
  {
    field: 'registration_status',
    headerName: 'Status',
    type: 'status',
    flex: 0.5,
  },
  { field: 'labels', headerName: 'Labels', type: 'labels', flex: 1 },
];

export const ORGANISATION_STAFF: Array<GridColDef> = [
  { field: 'user', headerName: 'Coach', flex: 2, type: 'avatar' },
  { field: 'id_number', headerName: 'ID Number', type: 'text' },
  { field: 'address', headerName: 'State / Province', type: 'text' },
  { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
  { field: 'title', headerName: 'Title', type: 'text' },
  { field: 'registration_status', headerName: 'Status', type: 'status' },
];

export const ORGANISATION_SQUADS: Array<GridColDef> = [
  { field: 'name', headerName: 'Team', type: 'link' },
  { field: 'total_coaches', headerName: 'Total Staff', type: 'text' },
  { field: 'total_athletes', headerName: 'Total Players', type: 'text' },
];

export const ASSOCIATION_ORGANISATION_ROSTER_HISTORY: Array<GridColDef> = [
  { field: 'club', headerName: 'Club', type: 'avatar' },
  { field: 'league', headerName: 'League', type: 'text' },
  { field: 'squad', headerName: 'Squad', type: 'text' },
  { field: 'joined', headerName: 'Joined', type: 'text' },
  { field: 'left', headerName: 'Left', type: 'text' },
];

export const ORGANISATION_ROSTER_HISTORY: Array<GridColDef> = [
  { field: 'club', headerName: 'Club', type: 'avatar' },
  { field: 'squad', headerName: 'Squad', type: 'text' },
  { field: 'joined', headerName: 'Joined', type: 'text' },
  { field: 'left', headerName: 'Left', type: 'text' },
];

export const REQUIREMENTS: Array<GridColDef> = [
  { field: 'requirement', headerName: 'Requirement', type: 'action' },
  { field: 'status', headerName: 'Status', type: 'status' },
];
const suspended = [
  { field: 'suspended_until', headerName: 'Suspended until', type: 'text' }, // TODO: this will be removed when league-ops-discipline-area-v2 FF is removed
  { field: 'suspended_until', headerName: 'Suspended', type: 'text' },
];
const disciplineStatus = [
  {
    field: 'discipline_status',
    headerName: 'Discipline status',
    type: 'discipline_status',
  },
];

export const DISCIPLINE_ATHLETE: Array<GridColDef> = [
  { field: 'athlete', headerName: 'Player', flex: 2, type: 'avatar' },
  { field: 'organisations', headerName: 'Club', flex: 2, type: 'avatar' },
  { field: 'team', headerName: 'Team', type: 'text' },
  { field: 'jersey_no', headerName: 'Jersey No', type: 'text' },
  { field: 'red_cards', headerName: 'Red cards', type: 'text' },
  { field: 'yellow_cards', headerName: 'Yellow cards', type: 'text' },
  { field: 'total_suspensions', headerName: 'Total suspensions', type: 'text' },
  ...suspended,
  ...disciplineStatus,
];

export const DISCIPLINE_USER: Array<GridColDef> = [
  { field: 'athlete', headerName: 'Staff', flex: 2, type: 'avatar' },
  { field: 'organisations', headerName: 'Club', flex: 2, type: 'avatar' },
  { field: 'team', headerName: 'Team', type: 'text' },
  { field: 'red_cards', headerName: 'Red cards', type: 'text' },
  { field: 'yellow_cards', headerName: 'Yellow cards', type: 'text' },
  { field: 'total_suspensions', headerName: 'Total suspensions', type: 'text' },
  ...suspended,
  ...disciplineStatus,
];

export const HOMEGROWN: Array<GridColDef> = [
  { field: 'title', headerName: 'Title', flex: 1, type: 'text', minWidth: 250 },
  {
    field: 'date_submitted',
    headerName: 'Date submitted',
    flex: 1,
    type: 'text',
    minWidth: 150,
  },
  {
    field: 'submitted_by',
    headerName: 'Submitted by',
    flex: 1,
    type: 'text',
    minWidth: 150,
  },
  {
    field: 'certified_by',
    headerName: 'Certified by',
    flex: 1,
    type: 'text',
    minWidth: 150,
  },
  {
    field: 'documents',
    headerName: 'Documents',
    flex: 1,
    type: 'documents',
    minWidth: 300,
  },
];

export const SUSPENSION_DETAILS: Array<GridColDef> = [
  {
    field: 'duration',
    headerName: 'Duration',
    flex: 1,
    type: 'text',
    minWidth: 250,
  },
  {
    field: 'reason',
    headerName: 'Reason',
    flex: 1,
    type: 'text',
    minWidth: 200,
  },
  {
    field: 'competition',
    headerName: 'Competition',
    flex: 1,
    type: 'node',
    minWidth: 200,
  },
  { field: 'notes', headerName: 'Notes', flex: 2, type: 'text' },
];

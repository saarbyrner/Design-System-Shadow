// @flow
import type { GridColDef } from '@mui/x-data-grid-pro';
import {
  ASSOCIATION_ORGANISATIONS,
  ASSOCIATION_STAFF,
  ATHLETE_REGISTRATION,
  ORGANISATION_ATHLETES,
  ORGANISATION_STAFF,
  ASSOCIATION_ATHLETES,
} from '../mlsNext/columnDefinitions';

export const removeFields = (
  array: Array<GridColDef>,
  fieldsToRemove: Array<string>
): Array<GridColDef> => {
  return array.filter((item) => !fieldsToRemove.includes(item.field));
};

export const NEXT_PRO_ASSOCIATION_ORGANISATIONS: Array<GridColDef> =
  removeFields(ASSOCIATION_ORGANISATIONS, ['amount_paid', 'wallet']);

export const NEXT_PRO_ASSOCIATION_STAFF: Array<GridColDef> = [
  { field: 'user', headerName: 'Staff', flex: 2, type: 'avatar' },
  ...removeFields(ASSOCIATION_STAFF, ['user']),
];
export const NEXT_PRO_ORGANISATION_STAFF: Array<GridColDef> = [
  { field: 'user', headerName: 'Staff', flex: 2, type: 'avatar' },
  ...removeFields(ORGANISATION_STAFF, ['user']),
];

export const NEXT_PRO_ATHLETE_REGISTRATION: Array<GridColDef> = removeFields(
  ATHLETE_REGISTRATION,
  ['type']
);

export const NEXT_PRO_ORGANISATION_ATHLETES: Array<GridColDef> = [
  ...removeFields(ORGANISATION_ATHLETES, [
    'type',
    'registration_status',
    'labels',
  ]),
  { field: 'position', headerName: 'Position', type: 'text' },
  { field: 'registration_status', headerName: 'Status', type: 'status' },
];

export const NEXT_PRO_STAFF_REGISTRATION: Array<GridColDef> = [
  { field: 'league', headerName: 'League', type: 'link' },
  { field: 'club', headerName: 'Club', type: 'avatar' },
  { field: 'squad', headerName: 'Squad', type: 'text' },
  { field: 'title', headerName: 'Title', type: 'text' },
  { field: 'registration_status', headerName: 'Status', type: 'status' },
];

export const NEXT_PRO_ASSOCIATION_ATHLETES: Array<GridColDef> = [
  ...removeFields(ASSOCIATION_ATHLETES, ['labels']),
  {},
];

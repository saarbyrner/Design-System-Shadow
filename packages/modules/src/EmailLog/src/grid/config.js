// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Chip } from '@kitman/playbook/components';
import { formatDateToUserTimezone } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';

export const commonColDef = {
  resizable: false,
  sortable: false,
  filterable: false,
};

export const columns: Array<GridColDef> = [
  {
    ...commonColDef,
    field: 'type',
    width: 200,
    headerName: i18n.t('Type'),
    renderCell: (params) => (
      <span style={{ textTransform: 'uppercase' }}>
        {params.row.kind ?? 'N/A'}
      </span>
    ),
  },
  {
    ...commonColDef,
    field: 'email',
    width: 400,
    maxWidth: 540,
    headerName: i18n.t('Email'),
    valueGetter: (params) => params.row.subject ?? 'N/A',
  },
  {
    ...commonColDef,
    field: 'sentDateAndTime',
    width: 220,
    headerName: i18n.t('Sent date and time'),
    valueGetter: (params) =>
      formatDateToUserTimezone({
        date: moment(params.row.created_at),
        showTimezone: true,
      }) ?? 'N/A',
  },
  {
    ...commonColDef,
    field: 'recipeient',
    width: 200,
    headerName: i18n.t('Recipient'),
    valueGetter: (params) => params.row.recipient ?? 'N/A',
  },

  {
    ...commonColDef,
    field: 'status',
    width: 200,
    headerName: i18n.t('Status'),
    renderCell: (params) => (
      <Chip
        label={params.row.message_status === 'errored' ? 'Failure' : 'Sent'}
        color={params.row.message_status === 'errored' ? 'error' : 'success'}
      />
    ),
  },

  {
    ...commonColDef,
    field: 'distributionType',
    width: 200,
    headerName: i18n.t('Distribution type'),
    renderCell: (params) => (
      <span style={{ textTransform: 'capitalize' }}>
        {params.row?.trigger_kind ?? 'N/A'}
      </span>
    ),
  },
];

// @flow

import i18next from 'i18next';
import { GridColDef } from '@mui/x-data-grid-pro';

export const muiDataGridProps = {
  editMode: undefined,
  hideFooter: true,
  sx: {
    outline: 'none',
    border: 0,
    boxShadow: 0,

    '.MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '.MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-cell:first-of-type':
      {
        paddingLeft: '24px',
      },
    '& .MuiDataGrid-columnSeparator': {
      display: 'none',
    },
  },
  disableColumnMenu: true,
  disableRowSelectionOnClick: true,
};

export const dataGridCustomStyle = {
  ...muiDataGridProps.sx,
  '&, [class^=MuiDataGrid]': {
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
  },
  '&, [class^=MuiDataGrid-row--lastVisible]': {
    borderBottom: 'none',
  },

  '[role=row] .MuiDataGrid-cell span': {
    overflow: 'hidden',
    width: '100%',
    display: 'inline-block',
    textOverflow: 'ellipsis',
  },
  '.MuiDataGrid-virtualScroller': {
    minHeight: '200px',
  },
};

export const columnHeaders: { [key: string]: GridColDef } = {
  player: {
    sortable: false,
    resizable: false,
    field: 'player',
    headerName: i18next.t('Player'),
    width: 400,
    renderCell: (params) => {
      return params.row.player;
    },
  },
  status: {
    sortable: false,
    resizable: false,
    field: 'status',
    headerName: i18next.t('Status'),
    width: 175,
    renderCell: (params) => {
      return params.row.status;
    },
  },
  team: {
    sortable: false,
    resizable: false,
    field: 'team',
    headerName: i18next.t('Team'),
    width: 250,
    renderCell: (params) => {
      return params.row.team;
    },
  },
  rating: {
    sortable: false,
    resizable: false,
    field: 'rating',
    headerName: i18next.t('Individual Fixture Rating'),
    width: 225,
    editable: true,
    type: 'singleSelect',
    renderCell: (params) => {
      return params.row.rating;
    },
  },
  designation: {
    sortable: false,
    resizable: false,
    field: 'designation',
    headerName: i18next.t('Designation'),
    width: 150,
    renderCell: (params) => {
      return params.row.designation;
    },
  },
  jersey: {
    sortable: false,
    resizable: false,
    field: 'jersey',
    headerName: i18next.t('Jersey No.'),
    width: 150,
    renderCell: (params) => {
      return params.row.jersey;
    },
  },
  captain: {
    sortable: false,
    resizable: false,
    field: 'captain',
    headerName: i18next.t('Captain'),
    width: 150,
    renderCell: (params) => {
      return params.row.captain;
    },
  },
  actions: {
    sortable: false,
    resizable: false,
    field: 'actions',
    headerName: '',
    width: null,
    renderCell: (params) => {
      return params.row.actions;
    },
  },
};

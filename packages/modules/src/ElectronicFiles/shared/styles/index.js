// @flow
import { gridClasses } from '@mui/x-data-grid';

export const MUI_DATAGRID_OVERRIDES = {
  keepNonExistentRowsSelected: true,
  disableRowSelectionOnClick: true,
  sx: {
    outline: 'none',
    border: 0,
    boxShadow: 0,
    [`.${gridClasses.row}:not(.${gridClasses.row}--dynamicHeight)>.${gridClasses.cell}`]:
      {
        overflow: 'visible',
      },
    [`.${gridClasses.columnHeader}:focus, .${gridClasses.cell}:focus`]: {
      outline: 'none',
    },
  },
};

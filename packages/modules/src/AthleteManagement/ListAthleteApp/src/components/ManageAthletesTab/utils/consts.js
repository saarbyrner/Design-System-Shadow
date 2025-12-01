// @flow
import { MUI_DATAGRID_OVERRIDES } from '@kitman/modules/src/ElectronicFiles/shared/styles';

export const creationDateHeaderClassName = 'creation-date-header';
export const creationDateCellClassName = 'creation-date-cell';
export const squadsHeaderClassName = 'squads-header';
export const squadsCellClassName = 'squads-cell';

const creationDateWidth = '9rem';
const squadsWidth = '50ch';

export const muiDataGridProps = {
  ...MUI_DATAGRID_OVERRIDES,
  getRowHeight: () => 'auto',
  rowSelection: true,
  disableMultipleRowSelection: false,
  sx: {
    ...MUI_DATAGRID_OVERRIDES.sx,
    '.MuiDataGrid-overlayWrapper': {
      height: '16rem',
    },
    '.MuiDataGrid-toolbarContainer': {
      padding: 0,
    },
    // Have to use !important in the following styles
    // since MUI applies inline styles to the column headers and cells
    [`.${creationDateHeaderClassName}`]: {
      maxWidth: `${creationDateWidth} !important`,
      minWidth: 'unset !important',
    },
    [`.${creationDateCellClassName}`]: {
      width: `${creationDateWidth} !important`,
      minWidth: 'unset !important',
    },
    [`.${squadsHeaderClassName}`]: {
      maxWidth: `${squadsWidth} !important`,
      width: `${squadsWidth} !important`,
      minWidth: 'unset !important',
    },
    [`.${squadsCellClassName}`]: {
      width: `${squadsWidth} !important`,
      maxWidth: `${squadsWidth} !important`,
      minWidth: 'unset !important',
      textOverflow: 'clip',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  },
};

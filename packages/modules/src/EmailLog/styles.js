// @flow

export const dataGridStyles = {
  height: 'calc(100vh - 168px)',
  minWidth: 'calc(100vw - 68px)',
  maxWidth: 'max-content',
  border: 'none',
  '.MuiDataGrid-cell': {
    cursor: 'pointer',
  },
  '.MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '.MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-cell:first-of-type': {
    paddingLeft: '24px',
  },
  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-footerContainer': {
    border: 'none',
  },
};

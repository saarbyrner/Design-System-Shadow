// @flow

export const getRowClass = (params: Object) => {
  switch (params.row.result_type) {
    case 'national':
      return 'MuiDataGrid-row--national ';
    case 'my_club':
      return 'MuiDataGrid-row--my-club ';
    case 'individual':
      return 'MuiDataGrid-row--individual-athlete ';
    default:
      return '';
  }
};

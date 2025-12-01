// @flow
import type { Node } from 'react';
import { DataGrid } from '@kitman/playbook/components';
import GridPagination from '@kitman/modules/src/LeagueOperations/shared/components/GridComponents/GridPagination';

type Column<T> = {
  field: string,
  headerName: string,
  flex: number,
  sortable: boolean,
  minWidth: number,
  renderCell?: (row: T) => Node,
};

type Props<T> = {
  columns: Array<Column<T>>,
  rows: Array<T>,
  totalPages: number,
  page: number,
  isLoading: boolean,
  isFetching: boolean,
  checkboxSelection?: boolean,
  selectedRows?: Array<string>,
  onRowSelectionModelChange?: (newSelection: Array<string>) => void,
  setPage: (page: number) => void,
};

const Grid = <T>({
  columns,
  rows,
  totalPages,
  page,
  isLoading,
  isFetching,
  checkboxSelection = false,
  selectedRows = [],
  onRowSelectionModelChange,
  setPage,
}: Props<T>): Node => {
  return (
    <>
      <DataGrid
        columns={columns}
        rows={rows}
        hideFooter
        loading={isLoading}
        disableRowSelectionOnClick={!checkboxSelection}
        checkboxSelection={checkboxSelection}
        rowSelection={checkboxSelection}
        onRowSelectionModelChange={onRowSelectionModelChange}
        rowSelectionModel={selectedRows}
        sx={{
          border: 0,
          flexGrow: 1,
          ...(checkboxSelection && {
            '& .MuiDataGrid-columnHeader:first-of-type': {
              paddingLeft: '0 !important',
            },
            '& .MuiDataGrid-cell:first-of-type': {
              paddingLeft: '0 !important',
            },
          }),
        }}
      />
      <GridPagination
        totalPages={totalPages}
        activePage={page}
        onChange={setPage}
        disabled={isFetching}
      />
    </>
  );
};

export default Grid;

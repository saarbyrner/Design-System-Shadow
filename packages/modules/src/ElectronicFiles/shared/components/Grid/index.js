// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { DataGrid as MuiDataGrid } from '@kitman/playbook/components';
import type {
  GridRowSelectionModel,
  GridRowParams,
  GridCellParams,
} from '@mui/x-data-grid-pro';
import { gridClasses } from '@mui/x-data-grid';
import type { RequestStatus } from '@kitman/common/src/types';
import type {
  GridConfig,
  Meta,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { MUI_DATAGRID_OVERRIDES } from '@kitman/modules/src/ElectronicFiles/shared/styles';
import { gridPageSize } from '@kitman/modules/src/ElectronicFiles/shared/consts';

type Props = {
  grid: GridConfig,
  meta: Meta,
  onRowClick?: (params: GridCellParams, event: { ignore: boolean }) => void,
  requestStatus: RequestStatus,
  rowSelectionModel?: GridRowSelectionModel,
  setRowSelectionModel?: Function,
  onPaginationModelChange: (
    selectedPage: number,
    selectedPageSize: number
  ) => void,
  showBulkActions?: boolean,
};

const Grid = ({
  grid,
  meta,
  onRowClick,
  requestStatus,
  onPaginationModelChange,
  rowSelectionModel,
  setRowSelectionModel,
  showBulkActions = false,
}: Props) => {
  const pageNumber =
    meta.current_page === 0 ? meta.current_page : meta.current_page - 1;

  return (
    <MuiDataGrid
      checkboxSelection={showBulkActions}
      columns={grid.columns}
      rows={grid.rows}
      rowCount={meta.total_count}
      pagination
      asyncPagination
      pageSize={gridPageSize}
      pageNumber={pageNumber}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[gridPageSize]}
      loading={requestStatus === 'PENDING'}
      noRowsMessage={grid.emptyTableText}
      onRowClick={onRowClick}
      isRowSelectable={(params: GridRowParams) =>
        showBulkActions && !params.row.global
      }
      rowSelection={showBulkActions}
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={
        showBulkActions
          ? (newRowSelectionModel) => {
              setRowSelectionModel?.(newRowSelectionModel);
            }
          : undefined
      }
      {...MUI_DATAGRID_OVERRIDES}
      sx={{
        ...MUI_DATAGRID_OVERRIDES.sx,
        [`.${gridClasses.row}:hover`]: {
          cursor: grid.id === 'electronicFilesGrid' ? 'pointer' : 'inherit',
        },
      }}
    />
  );
};

export const GridTranslated: ComponentType<Props> = withNamespaces()(Grid);
export default Grid;

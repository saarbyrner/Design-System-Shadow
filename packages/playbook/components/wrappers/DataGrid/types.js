// @flow
import type {
  GridApiCommon,
  GridRowParams,
  GridCallbackDetails,
  GridRowScrollEndParams,
  GridPaginationModel,
  MuiEvent,
} from '@mui/x-data-grid-pro';
import { GridColDef, GridRow, DataGridProProps } from '@mui/x-data-grid-pro';

export const PaginationModes = {
  Server: 'server',
  Client: 'client',
};
export type PaginationMode = $Values<typeof PaginationModes>;

export const SortingOrders = {
  Ascending: 'asc',
  Descending: 'desc',
};
export type SortingOrder = $Values<typeof SortingOrders>;

export type GRID_TOOL_BAR_KEYS =
  | 'enableCSV'
  | 'enablePrint'
  | 'showQuickFilter';

export type InitialStateProps = {
  leftPinnedColumns?: Array<string>,
  pageSize?: number,
  rightPinnedColumns?: Array<string>,
};

export type SlotsProps = {
  gridToolBar?: Array<GRID_TOOL_BAR_KEYS>,
  noRowsMessage?: string,
  asyncPagination?: boolean,
  infiniteLoading?: boolean,
};

export type DataGridOptions = {
  apiRef?: GridApiCommon,
  checkboxSelection?: boolean,
  columns: Array<GridColDef>,
  disableRowSelectionOnClick?: boolean,
  pageSizeOptions?: Array<number>,
  pagination?: boolean,
  rows: Array<GridRow>,
  rowCount?: number,
  loading?: boolean,
  slotProps?: Object,
  disableColumnFilter?: boolean,
  disableColumnSelector?: boolean,
  disableDensitySelector?: boolean,
  paginationMode?: PaginationMode,
  paginationModel?: { page: number, pageSize: number },
  onRowsScrollEnd?: (
    params: GridRowScrollEndParams,
    event: MuiEvent<{}>,
    details: GridCallbackDetails
  ) => void,
  infiniteLoadingCall?: (
    nextPage: number,
    pageSize: number
  ) => {} | typeof undefined,
  onPaginationModelChange?: (
    model: GridPaginationModel,
    details: GridCallbackDetails
  ) => void,
  onRowClick?: (
    params: GridRowParams,
    event: SyntheticMouseEvent<HTMLElement>,
    details: GridCallbackDetails
  ) => void,
  pageNumber: number,
  pageSize?: number,
  isCellEditable: () => boolean,
  isRowSelectable: () => boolean,
  rowSelection: boolean,
  disableColumnMenu: boolean,
  disableColumnFilter: boolean,
  disableColumnPinning: boolean,
  disableColumnReorder: boolean,
  disableMultipleColumnsSorting: boolean,
  disableMultipleRowSelection: boolean,
  disableChildrenSorting: boolean,
  hideFooter: boolean,
  disableColumnSelector: boolean,
  disableMultipleColumnsFiltering: boolean,
  ...DataGridProProps,
};

export type DataGridProps = DataGridOptions & SlotsProps & InitialStateProps;

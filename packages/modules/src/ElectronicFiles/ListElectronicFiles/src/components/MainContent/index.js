// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { RequestStatus } from '@kitman/common/src/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Paper } from '@kitman/playbook/components';
import {
  MENU_ITEM,
  selectSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import {
  updatePagination,
  copyPersistedFiltersToStateFilters,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/gridSlice';
import { HeaderTranslated as Header } from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/Header';
import { FiltersTranslated as Filters } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters';
import { BulkActionsTranslated as BulkActions } from '@kitman/modules/src/ElectronicFiles/shared/components/BulkActions';
import { GridTranslated as Grid } from '@kitman/modules/src/ElectronicFiles/shared/components/Grid';
import { DialogTranslated as Dialog } from '@kitman/modules/src/ElectronicFiles/shared/components/Dialog';
import { FILTER_KEY } from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { GridCellParams } from '@mui/x-data-grid-pro';
import useGrid from '@kitman/modules/src/ElectronicFiles/shared/hooks/useGrid';
import { generateRouteUrl } from '@kitman/modules/src/ElectronicFiles/shared/utils';

type Props = {};

const MainContent = () => {
  const dispatch = useDispatch();
  const locationAssign = useLocationAssign();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);

  const {
    isFileListFetching,
    isFileListLoading,
    isFileListSuccess,
    isFileListError,
    onSearch,
    onUpdateFilter,
    grid,
    meta,
  } = useGrid();

  const getRequestStatus = (): RequestStatus => {
    if (isFileListFetching || isFileListLoading) {
      return 'PENDING';
    }
    if (isFileListSuccess) {
      return 'SUCCESS';
    }
    if (isFileListError) {
      return 'FAILURE';
    }
    return null;
  };

  const onRowClick = (params: GridCellParams) => {
    dispatch(copyPersistedFiltersToStateFilters());
    locationAssign(generateRouteUrl({ selectedMenuItem, id: params.id }));
  };

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  return (
    <Paper variant="outlined" sx={{ width: '100%' }} square>
      <Header>
        <Filters
          allowedFilters={[
            FILTER_KEY.search,
            FILTER_KEY.dateRange,
            ...(selectedMenuItem === MENU_ITEM.sent ? [FILTER_KEY.status] : []),
          ]}
          onSearch={(searchString: string) => {
            onSearch(searchString);
            setRowSelectionModel([]);
          }}
          onUpdateFilter={(partialFilter) => {
            onUpdateFilter(partialFilter);
            setRowSelectionModel([]);
          }}
          showRefreshAction
        />
      </Header>
      <BulkActions
        rows={grid.rows.filter((row) => rowSelectionModel.includes(row.id))}
        onBulkAction={() => setRowSelectionModel([])}
      />
      <Box sx={{ width: '100%', height: 600 }}>
        <Grid
          grid={grid}
          meta={meta}
          onRowClick={onRowClick}
          rowSelectionModel={rowSelectionModel}
          setRowSelectionModel={setRowSelectionModel}
          onPaginationModelChange={(selectedPage) => {
            setRowSelectionModel([]);
            dispatch(updatePagination({ page: selectedPage + 1 }));
          }}
          requestStatus={getRequestStatus()}
          showBulkActions={selectedMenuItem === MENU_ITEM.inbox}
        />
      </Box>
      <Dialog />
    </Paper>
  );
};

export const MainContentTranslated: ComponentType<Props> =
  withNamespaces()(MainContent);
export default MainContent;

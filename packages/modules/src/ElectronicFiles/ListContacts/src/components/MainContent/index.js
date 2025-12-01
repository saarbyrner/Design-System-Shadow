// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RequestStatus } from '@kitman/common/src/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { Box, Paper } from '@kitman/playbook/components';
import { updatePagination } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/contactsGridSlice';
import {
  MENU_ITEM,
  selectSelectedMenuItem,
} from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { HeaderTranslated as Header } from '@kitman/modules/src/ElectronicFiles/ListContacts/src/components/Header';
import { FiltersTranslated as Filters } from '@kitman/modules/src/ElectronicFiles/shared/components/Filters';
import { BulkActionsTranslated as BulkActions } from '@kitman/modules/src/ElectronicFiles/shared/components/BulkActions';
import { GridTranslated as Grid } from '@kitman/modules/src/ElectronicFiles/shared/components/Grid';
import { FILTER_KEY } from '@kitman/modules/src/ElectronicFiles/shared/types';
import useContactsGrid from '@kitman/modules/src/ElectronicFiles/ListContacts/src/hooks/useContactsGrid';

type Props = {};

const MainContent = () => {
  const dispatch = useDispatch();
  const selectedMenuItem = useSelector(selectSelectedMenuItem);

  const {
    isContactListFetching,
    isContactListLoading,
    isContactListSuccess,
    isContactListError,
    onSearch,
    grid,
    meta,
  } = useContactsGrid();

  const getRequestStatus = (): RequestStatus => {
    if (isContactListFetching || isContactListLoading) {
      return 'PENDING';
    }
    if (isContactListSuccess) {
      return 'SUCCESS';
    }
    if (isContactListError) {
      return 'FAILURE';
    }
    return null;
  };

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  return (
    <Paper variant="outlined" sx={{ width: '100%' }} square>
      <Header>
        <Filters
          allowedFilters={[FILTER_KEY.search]}
          onSearch={(searchString) => {
            onSearch(searchString);
          }}
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
          rowSelectionModel={rowSelectionModel}
          setRowSelectionModel={setRowSelectionModel}
          onPaginationModelChange={(selectedPage) => {
            dispatch(updatePagination({ page: selectedPage + 1 }));
          }}
          requestStatus={getRequestStatus()}
          showBulkActions={selectedMenuItem === MENU_ITEM.contacts}
        />
      </Box>
    </Paper>
  );
};

export const MainContentTranslated: ComponentType<Props> =
  withNamespaces()(MainContent);
export default MainContent;

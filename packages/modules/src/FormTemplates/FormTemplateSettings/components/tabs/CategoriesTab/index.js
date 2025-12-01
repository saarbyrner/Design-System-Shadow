// @flow

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { useListFormCategories } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/hooks/useListFormCategories';
import { Box, DataGrid, Button, Alert } from '@kitman/playbook/components';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';
import { colors } from '@kitman/common/src/variables';
import {
  getColumns,
  CATEGORY_ROW_KEYS,
} from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/utils/helpers';
import useDeleteCategoryAction from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/hooks/useDeleteCategoryAction';
import { ProductAreaSelectorTranslated as ProductAreaSelector } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/Filters/ProductAreaSelector';
import { SearchFilterTranslated as SearchFilter } from '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/Filters/SearchFilter';
import {
  setIsFormCategoryDrawerOpen,
  setIsDeleteFormCategoryModalOpen,
  setFormCategoryDrawerMode,
  setSelectedFormCategoryId,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';
import FormCategoryDrawer from './CategoriesDrawer';

const CategoriesTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const dispatch = useDispatch();
  const { confirmationModal } = useDeleteCategoryAction();

  const handleEditCategory = (categoryId: number) => {
    dispatch(setSelectedFormCategoryId(categoryId));
    dispatch(setFormCategoryDrawerMode('EDIT'));
    dispatch(setIsFormCategoryDrawerOpen(true));
  };

  const handleDeleteCategory = (categoryId: number) => {
    dispatch(setSelectedFormCategoryId(categoryId));
    dispatch(setIsDeleteFormCategoryModalOpen(true));
  };

  const columns = getColumns({
    onEditClick: handleEditCategory,
    onDeleteClick: handleDeleteCategory,
  });

  const { rows, isLoading, meta } = useListFormCategories(
    currentPage,
    rowsPerPage
  );

  const handleCreateCategory = () => {
    dispatch(setSelectedFormCategoryId(null));
    dispatch(setFormCategoryDrawerMode('CREATE'));
    dispatch(setIsFormCategoryDrawerOpen(true));
  };

  let dataGridContent;

  if (isLoading && rows && rows.length === 0) {
    dataGridContent = (
      <DataGridSkeleton
        rowCount={rowsPerPage}
        columnCount={columns.length} // Use actual column count
        columnWidths={[16, 22, 16, 16, 16, 13]}
      />
    );
  } else if (!isLoading && rows && rows.length === 0) {
    dataGridContent = (
      <Alert severity="info">
        {i18n.t(
          'No categories found. Try adjusting your filters or create a new category.'
        )}
      </Alert>
    );
  } else {
    dataGridContent = (
      <Box
        sx={{
          mt: '-1px', // To align with the filter bar's bottom border
          backgroundColor: colors.white,
          overflowX: 'auto',
        }}
      >
        <DataGrid
          columns={columns}
          pinnedColumns={{ right: [CATEGORY_ROW_KEYS.actions] }}
          rows={rows}
          loading={isLoading}
          pagination
          asyncPagination
          pageNumber={meta.currentPage - 1} // MUI's pages are 0-indexed
          pageSize={rowsPerPage}
          rowCount={meta.totalCount}
          onPaginationModelChange={(nextPage, pageSize) => {
            setCurrentPage(nextPage + 1); // Our pages are 1-indexed
            setRowsPerPage(pageSize);
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          pb: '1rem',
          borderBottom: `1px solid ${colors.neutral_300}`,
        }}
      >
        <Box flexGrow={1} display="flex" gap="0.5rem">
          <SearchFilter />
          <ProductAreaSelector />
        </Box>
        <Button variant="contained" onClick={handleCreateCategory}>
          {i18n.t('Create Category')}
        </Button>
      </Box>
      {dataGridContent}
      {confirmationModal}
      <FormCategoryDrawer />
    </>
  );
};

export default CategoriesTab;

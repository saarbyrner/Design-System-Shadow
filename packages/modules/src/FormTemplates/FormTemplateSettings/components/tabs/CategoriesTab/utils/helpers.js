// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import { GridActionsCellItem } from '@kitman/playbook/components';

import type { GridColDef } from '@mui/x-data-grid-pro';

type Row = {
  id: number,
  created_at: string,
  updated_at: string,
  created_by?: {
    fullname: string,
  },
  [string]: any,
};

export const CATEGORY_ROW_KEYS = {
  name: 'name',
  productArea: 'productArea',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  actions: 'actions',
};

const commonColumnProps = {
  flex: 1,
};

// Column definitions for the DataGrid
export const getColumns = ({
  onEditClick,
  onDeleteClick,
}: {
  onEditClick: (categoryId: number) => void,
  onDeleteClick: (categoryId: number) => void,
}): Array<GridColDef> => {
  const rowActions = [
    {
      id: 'edit',
      text: i18n.t('Edit'),
      onCallAction: (row: Row) => {
        onEditClick(row.id);
      },
      disabled: false,
    },
    {
      id: 'delete',
      text: i18n.t('Delete'),
      onCallAction: (row: Row) => {
        onDeleteClick(row.id);
      },
      disabled: false,
    },
  ];

  const getActions = ({ row }: { row: Row }) => {
    return rowActions.map(({ id: key, text, onCallAction, disabled }) => (
      <GridActionsCellItem
        showInMenu
        label={text}
        onClick={() => onCallAction(row)}
        key={key}
        disabled={disabled}
      />
    ));
  };

  return [
    {
      ...commonColumnProps,
      field: CATEGORY_ROW_KEYS.name,
      headerName: i18n.t('Category'),
      minWidth: 150,
    },
    {
      ...commonColumnProps,
      field: CATEGORY_ROW_KEYS.productArea,
      headerName: i18n.t('Product area'),
      flex: 1.5,
      minWidth: 200,
    },
    {
      ...commonColumnProps,
      field: CATEGORY_ROW_KEYS.createdAt,
      headerName: i18n.t('Created on'),
      minWidth: 150,
      valueGetter: (params) => params.value, // Keep if direct access is fine
      renderCell: (
        { row }: { row: Row } // Ensure row type is FormCategory
      ) => moment(row.createdAt).format('MMM D, YYYY'), // Use created_at from FormCategory type
    },
    {
      ...commonColumnProps,
      field: CATEGORY_ROW_KEYS.updatedAt,
      headerName: i18n.t('Last updated'),
      minWidth: 150,
      valueGetter: (params) => params.value, // Keep if direct access is fine
      renderCell: (
        { row }: { row: Row } // Ensure row type is FormCategory
      ) => moment(row.updatedAt).format('MMM D, YYYY'), // Use updated_at from FormCategory type
    },
    {
      type: 'actions',
      field: CATEGORY_ROW_KEYS.actions,
      getActions,
    },
  ];
};

export const getConfirmDeleteCategoryTranslations = () => ({
  title: i18n.t('Delete category'),
  content: i18n.t(
    'Deleting this category will remove it from usage. No existing forms utilising this category will be affected.'
  ),
  actions: {
    ctaButton: i18n.t('Delete'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getDeleteCategoryToastsText = () => ({
  success: {
    title: i18n.t('Delete successful'),
    description: i18n.t('The category has been deleted successfully.'),
  },
  error: {
    title: i18n.t('Failed to delete category'),
    description: i18n.t('Cannot delete category. Please try again.'),
  },
});

export default getColumns;

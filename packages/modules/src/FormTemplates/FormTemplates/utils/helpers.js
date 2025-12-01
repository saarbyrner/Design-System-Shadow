// @flow
import moment from 'moment';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import {
  GridActionsCellItem,
  GridCellExpand,
  Box,
  Link,
  Typography,
} from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { colors } from '@kitman/common/src/variables';
import type { FormTemplate } from '@kitman/services/src/services/formTemplates/api/types';
import type { EFormsPermissions } from '@kitman/common/src/contexts/PermissionsContext/eForms/types';
import {
  toggleIsFormTemplateDrawerOpen,
  toggleIsAssignAthletesDrawerOpen,
  toggleIsAssignFreeAgentsDrawerOpen,
  setFormTemplateDrawerMode,
  setSelectedFormId,
  setSelectedFormName,
  toggleIsFormTemplateDeleteModalOpen,
  setSelectedFormTemplateId,
} from '../../redux/slices/formTemplatesSlice';

const ROW_KEYS = {
  templateName: 'name',
  fullname: 'fullname',
  version: 'version',
  category: 'category',
  formCategory: 'formCategory',
  productArea: 'productArea',
  editor: 'editor',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
};

const renderDateCell = ({ value }: { value: string }): string =>
  formatStandard({ date: moment(value) });

const renderCell = (params: GridRenderCellParams<string>) =>
  params.row[params.field];

const commonColumnFields = {
  flex: 1,
  renderCell,
};

const renderTemplateNameColumn = ({ row }: GridRenderCellParams<string>) => {
  const { name, id } = row;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link underline="none" href={`/forms/form_templates/${id}`}>
        <Typography variant="subtitle" sx={{ color: colors.grey_300 }}>
          {name}
        </Typography>
      </Link>
    </Box>
  );
};

const renderCellExpand = (params: GridRenderCellParams<any, string>) => {
  return (
    <GridCellExpand
      value={params.value || ''}
      width={params.colDef.computedWidth}
    />
  );
};

export const getColumns = (
  dispatch: Function,
  isDeleteLoading: boolean,
  permissions: EFormsPermissions
): Array<GridColDef> => {
  const templateName: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.templateName,
    headerName: i18n.t('Template'),
    renderCell: renderTemplateNameColumn,
    minWidth: 150,
    flex: 3,
  };

  const templateDescription: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.fullname,
    headerName: i18n.t('Description'),
    renderCell: renderCellExpand,
    minWidth: 200,
    flex: 3,
  };

  const version: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.version,
    headerName: i18n.t('Version'),
    minWidth: 60,
  };

  const productArea: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.productArea,
    headerName: i18n.t('Product Area'),
    valueGetter: (value: { row: FormTemplate }) =>
      value.row.formCategory?.productArea,
    renderCell: ({ value }) => value,
    minWidth: 120,
  };

  const category: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.category,
    headerName: i18n.t('Category'),
    valueGetter: (value: { row: FormTemplate }) => value.row.formCategory?.name,
    renderCell: ({ value }) => value,
    minWidth: 100,
  };

  const editor: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.editor,
    headerName: i18n.t('Created By'),
    valueGetter: (value: { row: FormTemplate }) => value.row.editor?.name,
    renderCell: ({ value }) => value,
    minWidth: 120,
    flex: 1.5,
  };

  const updatedAt: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.updatedAt,
    headerName: i18n.t('Last Updated At'),
    renderCell: renderDateCell,
    minWidth: 100,
  };

  const createdAt: GridColDef = {
    ...commonColumnFields,
    field: ROW_KEYS.createdAt,
    headerName: i18n.t('Created At'),
    renderCell: renderDateCell,
    minWidth: 100,
  };

  const rowActions = [
    {
      id: 'assign_athletes',
      text: i18n.t('Assign Athletes'),
      onCallAction: (row: Object) => {
        dispatch(toggleIsAssignAthletesDrawerOpen());
        dispatch(setSelectedFormId(row.formId));
      },
      disabled: false,
    },
    ...(window.getFlag('pm-eforms-tryout') && permissions.canViewTryout
      ? [
          {
            id: 'assign_free_agent',
            text: i18n.t('Assign to Free Agent'),
            onCallAction: (row: Object) => {
              dispatch(toggleIsAssignFreeAgentsDrawerOpen());
              dispatch(setSelectedFormId(row.formId));
            },
            disabled: false,
          },
        ]
      : []),
    {
      id: 'edit',
      text: i18n.t('Edit'),
      onCallAction: (row: Object) => {
        dispatch(toggleIsFormTemplateDrawerOpen());
        dispatch(setFormTemplateDrawerMode('EDIT'));
        dispatch(setSelectedFormId(row.formId));
      },
      disabled: false,
    },
    {
      id: 'delete',
      text: i18n.t('Delete'),
      onCallAction: (row: Object) => {
        dispatch(toggleIsFormTemplateDeleteModalOpen());
        dispatch(setSelectedFormId(row.formId));
        dispatch(setSelectedFormTemplateId(row.id));
        dispatch(setSelectedFormName(row.name));
      },
      disabled: isDeleteLoading,
    },
  ];

  const getActions = ({ row }: { row: Object }) => {
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

  const actions: GridColDef = {
    type: 'actions',
    field: 'actions',
    getActions,
    minWidth: 40,
    width: 40,
  };

  return [
    templateName,
    templateDescription,
    version,
    productArea,
    category,
    editor,
    updatedAt,
    createdAt,
    actions,
  ];
};

export const getFiltersTranslations = () => ({
  category: i18n.t('Category'),
  search: i18n.t('Search'),
});

export const getGridTranslations = () => ({
  formTemplateDeletionSuccessMessage: i18n.t(
    'Successfully deleted form template'
  ),
  formTemplateDeletionErrorMessage: i18n.t(
    'Failed to delete form template. Please try again'
  ),
  formTemplateDeletionConfirmationMessage: i18n.t(
    'Are you sure you want to delete this form template?'
  ),
});

export const getConfirmDeleteTranslations = (formName: string) => ({
  title: i18n.t('Delete {{title}}', { title: formName }),
  content: i18n.t(
    'Form template cannot be deleted if it has been assigned. Do you want to delete {{title}}?',
    { title: formName }
  ),
  actions: {
    ctaButton: i18n.t('Delete'),
    cancelButton: i18n.t('Cancel'),
  },
});

export const getDeleteToastsText = () => ({
  success: {
    title: i18n.t('Delete successful'),
    description: i18n.t('The form has been deleted successfully.'),
  },
  error: {
    title: i18n.t('Failed to delete. Please try again.'),
    description: i18n.t(
      'Cannot delete assigned forms. Please check assignments.'
    ),
  },
});

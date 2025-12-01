/* eslint-disable camelcase */
// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import type { PermissionsType } from '@kitman/common/src/contexts/PermissionsContext/types';
import {
  FALLBACK_DASH,
  formatCellDate,
  renderFileCell,
  renderStatusCell,
} from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentsBody/utils';
import { ActionMenuTranslated as ActionMenu } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentsBody/components/ActionMenu';
import {
  DataGrid as MuiDataGrid,
  Box,
  Typography,
  Tooltip,
} from '@kitman/playbook/components';
import { getGenericDocumentsFactory } from '@kitman/services/src/services/documents/generic/redux/selectors/genericDocumentsSelectors';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isLoading: boolean,
  isError: boolean,
};

const DocumentsBody = ({ t, isLoading, isError }: I18nProps<Props>) => {
  const { data: permissions }: { data: PermissionsType } =
    useGetPermissionsQuery();

  const genericDocuments = useSelector(getGenericDocumentsFactory());
  const documentsRows = genericDocuments?.map(
    ({
      attachment,
      title,
      organisation_generic_document_categories,
      id,
      document_date,
      document_note,
      expires_at,
      status,
    }) => {
      const categories = organisation_generic_document_categories.length
        ? organisation_generic_document_categories
            .map((category) => category.name)
            .join(',')
        : FALLBACK_DASH;

      return {
        id,
        title,
        category: categories,
        document_date,
        file: {
          filename: attachment?.filename,
          downloadUrl: attachment?.download_url,
        },
        document_note: document_note || FALLBACK_DASH,
        expires_at,
        status,
      };
    }
  );

  const columns = [
    {
      field: 'title',
      headerName: t('Document'),
      flex: 1,
    },
    {
      field: 'category',
      headerName: t('Category'),
      flex: 1,
    },
    {
      field: 'document_date',
      headerName: t('Issue date'),
      flex: 1,
      valueFormatter: (params) => formatCellDate(params?.value),
    },
    {
      field: 'expires_at',
      headerName: t('Expiry date'),
      flex: 1,
      valueFormatter: (params) => formatCellDate(params?.value),
    },
    {
      field: 'file',
      headerName: t('File'),
      flex: 1,
      renderCell: renderFileCell,
    },
    {
      field: 'document_note',
      headerName: t('Notes'),
      flex: 1,
      width: '20px',
      renderCell: (params) => (
        <Tooltip title={params.value} placement="left">
          <span
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
      renderCell: renderStatusCell,
    },
  ];

  if (permissions.settings.canManageStaffUsers) {
    columns.push({
      field: 'actionColumn',
      headerName: '',
      filterable: false,
      aggregable: false,
      align: 'center',
      hideSortIcons: true,
      width: 100,
      renderCell: ({ id }) => <ActionMenu id={id} />,
    });
  }

  return isError ? (
    <Box display="flex" justifyContent="center" alignItems="center" p={4}>
      <Typography variant="body1">
        {t('Error connecting to the database. Please try again')}
      </Typography>
    </Box>
  ) : (
    <MuiDataGrid
      columns={columns}
      rows={documentsRows}
      noRowsMessage={t('No documents found')}
      disableChildrenSorting={false}
      disableColumnFilter
      disableColumnMenu
      disableColumnPinning={false}
      disableColumnReorder={false}
      disableColumnSelector
      disableMultipleColumnsFiltering={false}
      disableMultipleColumnsSorting={false}
      disableMultipleRowSelection={false}
      disableRowSelectionOnClick={false}
      hideFooter
      isCellEditable={() => true}
      isRowSelectable={() => true}
      loading={isLoading}
      rowSelection={false}
    />
  );
};

export const DocumentsBodyTranslated: ComponentType<Props> =
  withNamespaces()(DocumentsBody);
export default DocumentsBody;

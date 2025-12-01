// @flow
import { withNamespaces } from 'react-i18next';
import { DataGrid, Stack, Pagination } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  EmailResponse,
  Meta,
} from '@kitman/services/src/services/notifications/shared/types';
import { dataGridStyles } from '../../styles';
import { columns } from '../grid/config';

const NoRowsOverlay = ({ message }: { message: string }) => (
  <Stack height="100%" width="100%" alignItems="center" justifyContent="center">
    {message}
  </Stack>
);

const PaginationControls = ({
  meta,
  page,
  setPage,
}: {
  meta: Meta,
  page: number,
  setPage: (page: number) => void,
}) =>
  meta?.total_count > 0 && (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 'calc(100vw - 68px)',
        border: 'none',
      }}
    >
      <Pagination
        count={meta.total_pages ?? 1}
        page={page ?? 1}
        onChange={(_, value) => setPage(value)}
        showFirstButton
        showLastButton
        size="large"
      />
    </Stack>
  );

type Props = {
  emails: Array<EmailResponse>,
  isLoading: boolean,
  meta: Meta,
  page: number,
  setPage: (page: number) => void,
  onRowClick: (row: EmailResponse) => void,
};

const EmailDataGrid = ({
  emails = [],
  isLoading,
  t,
  meta,
  page,
  setPage,
  onRowClick,
}: I18nProps<Props>) => {
  return (
    <DataGrid
      sx={dataGridStyles}
      rows={emails}
      columns={columns}
      getRowId={(row) => row.id}
      disableColumnMenu
      loading={isLoading}
      onRowClick={(params) => {
        onRowClick(params.row);
      }}
      pagination
      slots={{
        noRowsOverlay: () => <NoRowsOverlay message={t('No emails found')} />,
        pagination: () => (
          <PaginationControls meta={meta} page={page} setPage={setPage} />
        ),
      }}
    />
  );
};

export const EmailDataGridTranslated = withNamespaces()(EmailDataGrid);
export default EmailDataGrid;

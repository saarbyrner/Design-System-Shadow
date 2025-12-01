// @flow

import { Alert, Box, DataGrid } from '@kitman/playbook/components';
import { useSelector } from 'react-redux';
import { getFilters } from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import { colors } from '@kitman/common/src/variables';
import { useState } from 'react';
import { getFormsColumns } from '@kitman/modules/src/FormAnswerSets/utils/helpers';
import { useSearchFormTemplatesQuery } from '@kitman/services/src/services/formTemplates';
import { initialData } from '@kitman/modules/src/FormTemplates/FormTemplates/utils/hooks';
import type {
  FormTemplate,
  MetaCamelCase,
} from '@kitman/services/src/services/formTemplates/api/types';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { FormSelectorTranslated as FormSelector } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/FormSelector';
import { type FormAnswerSetsState } from '@kitman/modules/src/FormAnswerSets/redux/slices/formAnswerSetsSlice';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';

type Props = {};

const FormsTab = ({ t }: I18nProps<Props>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const filters: FormAnswerSetsState = useSelector(getFilters);

  const {
    data = initialData,
    isLoading,
    isError,
  }: {
    data: { data: Array<FormTemplate>, meta: MetaCamelCase },
    isLoading: boolean,
    isError: boolean,
  } = useSearchFormTemplatesQuery({
    filters: {
      form_id: filters?.form_id,
      assigned_forms_only: true,
    },
    pagination: {
      page: currentPage,
      perPage: rowsPerPage,
    },
  });

  const { data: rows, meta } = data;

  const columns = getFormsColumns();

  const dataGrid = isLoading ? (
    <DataGridSkeleton
      rowCount={rowsPerPage}
      columnCount={2}
      columnWidths={[80, 20]}
    />
  ) : (
    <Box
      sx={{
        border: `1px solid ${colors.neutral_300}`,
        backgroundColor: colors.white,
        overflowX: 'auto',
      }}
    >
      <DataGrid
        columns={columns}
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

  const renderDataGrid = isError ? (
    <Alert severity="error">
      {t('Error fetching form assignments. Please try again')}
    </Alert>
  ) : (
    dataGrid
  );

  return (
    <>
      <Box
        display="flex"
        gap="0.5rem"
        sx={{
          backgroundColor: colors.white,
          padding: '0.5rem',
        }}
      >
        <FormSelector />
      </Box>
      {renderDataGrid}
    </>
  );
};

export const FormsTabTranslated: ComponentType<Props> =
  withNamespaces()(FormsTab);

export default FormsTab;

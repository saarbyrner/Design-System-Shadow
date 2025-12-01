// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { selectAthleteStatusFilter } from '@kitman/modules/src/FormAnswerSets/redux/selectors/formAnswerSetsSelectors';
import { getCompletedColumns } from '@kitman/modules/src/HumanInput/pages/assignedForms/AssignedForms/utils/helpers';
import { Alert, DataGrid, Box } from '@kitman/playbook/components';
import { AthleteStatusFilterTranslated as AthleteStatusFilter } from '@kitman/modules/src/FormAnswerSets/FormAnswerSetsGrid/components/Tabs/Filters/AthleteStatusFilter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useFormAnswerSets } from '@kitman/modules/src/FormAnswerSets/utils/hooks/useFormAnswerSets';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';
import { colors } from '@kitman/common/src/variables';

type Props = {};

const CompletedFormsTab = ({ t }: I18nProps<Props>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const { data: currentUser } = useGetCurrentUserQuery();
  const athleteStatus = useSelector(selectAthleteStatusFilter);

  // TODO: Should have a skip mechanism if current user not loaded
  // TODO: Review with Odhran will BE block requests for other user ids
  // Seems we could just have a bool to say use the current user id on BE rather than supply
  const { rows, isLoading, isError, meta } = useFormAnswerSets(
    currentPage,
    rowsPerPage,
    {
      user_id: currentUser?.id,
      category: 'medical,general', // TODO: categories will become dynamic - it is hardcoded now until the permanent solution is implemented
      form_id: undefined,
      athlete_id: undefined,
      statuses: [],
      date_range: undefined,
      form_category_id: undefined,
    }
  );

  const columns = getCompletedColumns({
    showLatestPDF: athleteStatus === 'free_agent',
  });

  const handlePaginationModelChange = useCallback(
    (nextPage, pageSize) => {
      if (!isLoading) {
        setCurrentPage(nextPage + 1);
        setRowsPerPage(pageSize);
      }
    },
    [isLoading]
  );

  const dataGrid = isLoading ? (
    <DataGridSkeleton
      rowCount={rowsPerPage}
      columnCount={3}
      columnWidths={[46, 27, 27]}
    />
  ) : (
    <DataGrid
      pagination
      asyncPagination
      columns={columns}
      rows={rows}
      loading={isLoading}
      pageNumber={meta?.currentPage - 1}
      pageSize={rowsPerPage}
      rowCount={meta?.totalCount || 0}
      onPaginationModelChange={handlePaginationModelChange}
    />
  );

  const renderDataGrid = isError ? (
    <Alert severity="error">
      {t('Error fetching form assignments. Please try again')}
    </Alert>
  ) : (
    dataGrid
  );

  return (
    <Box
      sx={{
        border: `1px solid ${colors.neutral_300}`,
        backgroundColor: colors.white,
      }}
      width="100%"
    >
      {window.getFlag('pm-eforms-tryout') && (
        <Box
          display="flex"
          gap="0.5rem"
          sx={{
            backgroundColor: 'white',
            padding: '0.5rem',
          }}
        >
          <AthleteStatusFilter isPlayerUsage />
        </Box>
      )}
      {renderDataGrid}
    </Box>
  );
};

export const CompletedFormsTabTranslated: ComponentType<Props> =
  withNamespaces()(CompletedFormsTab);
export default CompletedFormsTab;

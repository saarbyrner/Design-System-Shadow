// @flow

import { useState, useCallback, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import useAppHeaderHeight from '@kitman/common/src/hooks/useAppHeaderHeight';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';
import { colors } from '@kitman/common/src/variables';
import { getColumns } from '@kitman/modules/src/FormAssignments/FormAssignmentsContent/utils/helpers';
import { useFetchAssignedFormsQuery } from '@kitman/services/src/services/humanInput/humanInput';
import { useFetchFormAssignmentsQuery } from '@kitman/services/src/services/formTemplates';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { useDeleteFormAnswersSetAction } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer/utils/hooks';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type {
  FormAssignment,
  AssignmentAthlete,
  FormAssignmentQueryResponse,
} from '@kitman/modules/src/HumanInput/types/forms';
import type { PaginationMeta } from '@kitman/services/src/services/humanInput/api/assignedForms/fetchAssignedForms';
import {
  Box,
  Autocomplete,
  DataGrid,
  Alert,
} from '@kitman/playbook/components';
import { HeaderStartTranslated as Header } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';

type Props = {};

const FormAssignmentsContent = ({ t }: I18nProps<Props>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({ status: null, athleteId: null });
  const locationPathname = useLocationPathname();
  const locationAssign = useLocationAssign();
  const headerHeight = useAppHeaderHeight();
  const formId = locationPathname.split('/')[2] || '';

  const {
    data = {},
    isLoading,
    isError,
  }: {
    data: { data: Array<FormAssignment>, pagination: PaginationMeta },
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useFetchAssignedFormsQuery({
    formId,
    formStatus: filters.status,
    athleteId: filters.athleteId,
    page: currentPage,
    perPage: rowsPerPage,
  });

  // get array of athleteIds for form assignment to populate filter
  const {
    data: athletesData = {},
    isLoading: isFormAssignmentDataLoading,
  }: {
    data: FormAssignmentQueryResponse,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useFetchFormAssignmentsQuery(formId, { skip: !formId });

  const { confirmationModal, openModal } = useDeleteFormAnswersSetAction({
    isDeleteDraftAction: true,
  });

  const { data: assignedFormsData = {}, pagination } = data;
  const athletes =
    athletesData?.athletes?.map((athlete: AssignmentAthlete) => ({
      ...athlete,
      label: athlete.fullname || `${athlete.lastname}, ${athlete.firstname}`,
    })) || [];
  const statuses = [{ id: 'draft', label: t('Draft') }];
  const templateName = assignedFormsData.form_template_name || '';
  const columns = getColumns(locationAssign, openModal);

  const getStatusLabel = (status) =>
    statuses.find((s) => s.id === status)?.label || '';

  const handlePaginationModelChange = useCallback(
    (nextPage, pageSize) => {
      if (!isLoading) {
        setCurrentPage(nextPage + 1);
        setRowsPerPage(pageSize);
      }
    },
    [isLoading]
  );

  const rows = assignedFormsData.form_assignments || [];

  const dataGrid = isLoading ? (
    <DataGridSkeleton
      rowCount={rowsPerPage}
      columnCount={2}
      columnWidths={[80, 20]}
    />
  ) : (
    <Box
      display="flex"
      sx={{ flexGrow: 1, width: '100%', backgroundColor: colors.white }}
    >
      {confirmationModal}
      <DataGrid
        pagination
        asyncPagination
        columns={columns}
        rows={rows}
        loading={isLoading}
        pageNumber={pagination?.current_page - 1}
        pageSize={rowsPerPage}
        rowCount={pagination?.total_count || 0}
        onPaginationModelChange={handlePaginationModelChange}
        noRowsMessage={t('No form assignments found')}
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
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        backgroundColor: colors.white,
        height: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <Box p="1rem">
        <Header
          title={templateName}
          handleBack={() => locationAssign('/forms/form_answers_sets')}
          showStatus={false}
        />
      </Box>
      <Box p="1rem" display="flex" gap="0.5rem">
        <Autocomplete
          value={
            filters.athleteId
              ? athletes.find((athlete) => athlete.id === filters.athleteId)
              : null
          }
          onChange={(event, value) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              athleteId: value?.id || null,
            }));
          }}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disabled={isLoading || isFormAssignmentDataLoading}
          options={athletes}
          renderInput={(params) => renderInput({ params, label: t('Athlete') })}
          size="small"
          sx={{ width: '20rem' }}
        />
        <Autocomplete
          value={getStatusLabel(filters.status)}
          onChange={(event, value) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              status: value?.id || null,
            }));
          }}
          disabled={isLoading}
          options={statuses}
          isOptionEqualToValue={(option, value) => option.id === value}
          renderInput={(params) => renderInput({ params, label: t('Status') })}
          size="small"
          sx={{ width: '20rem' }}
        />
      </Box>
      {renderDataGrid}
    </Box>
  );
};

export const FormAssignmentsContentTranslated: ComponentType<Props> =
  withNamespaces()(FormAssignmentsContent);

export default FormAssignmentsContent;

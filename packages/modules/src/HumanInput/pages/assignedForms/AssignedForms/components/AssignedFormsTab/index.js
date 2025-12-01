// @flow
import { withNamespaces } from 'react-i18next';
import capitalize from 'lodash/capitalize';
import { type ComponentType, useState, useEffect, useCallback } from 'react';

import colors from '@kitman/common/src/variables/colors';
import { useFetchAssignedFormsQuery } from '@kitman/services/src/services/humanInput/humanInput';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  getAssignedColumns,
  formatFormDate,
} from '@kitman/modules/src/HumanInput/pages/assignedForms/AssignedForms/utils/helpers';
import {
  Alert,
  Box,
  Button,
  Chip,
  DataGrid,
  Grid,
  Typography,
} from '@kitman/playbook/components';
import { useDeleteFormAnswersSetAction } from '@kitman/modules/src/HumanInput/pages/genericFormRenderer/GenericFormRenderer/utils/hooks';
import type { FormAssignment } from '@kitman/modules/src/HumanInput/types/forms';
import type { PaginationMeta } from '@kitman/services/src/services/humanInput/api/assignedForms/fetchAssignedForms';
import DataGridSkeleton from '@kitman/modules/src/HumanInput/shared/components/DataGridSkeleton';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {};

const AssignedFormsTab = ({ t }: I18nProps<Props>) => {
  const locationAssign = useLocationAssign();
  const [expandedRowIds, setExpandedRowIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const columns = getAssignedColumns(locationAssign);
  const { confirmationModal, isDeleteLoading, openModal } =
    useDeleteFormAnswersSetAction({ isDeleteDraftAction: true });

  const getDetailPanelContent = useCallback(
    ({ row }) => {
      return row.open_draft_count &&
        Array.isArray(row.latest_drafts) &&
        row.latest_drafts.length > 0 ? (
        <>
          {row.latest_drafts.map((draft) => (
            <Grid
              key={draft.id}
              container
              spacing={1}
              sx={{
                padding: 1,
                borderBottom: `1px solid ${colors.grey_disabled}`,
                justifyContent: 'end',
                alignItems: 'center',
              }}
            >
              <Grid item xs={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">
                    {formatFormDate(draft.date || '')}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip label={capitalize(draft.status) || '-'} />
                </Box>
              </Grid>

              <Grid item xs={5}>
                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      locationAssign(`/forms/form_answers_sets/${draft.id}`);
                    }}
                  >
                    {t('Continue')}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    aria-label="delete"
                    disabled={isDeleteLoading}
                    onClick={() => openModal(draft.id)}
                  >
                    <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ))}
        </>
      ) : null;
    },
    [isDeleteLoading, openModal, t, locationAssign]
  );

  const {
    data = {},
    isLoading,
    isError,
  }: {
    data: { data: Array<FormAssignment>, pagination: PaginationMeta },
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useFetchAssignedFormsQuery({ page: currentPage, perPage: rowsPerPage });

  const { data: assignedFormsData = [], pagination } = data;

  const handlePaginationModelChange = useCallback(
    (nextPage, pageSize) => {
      if (!isLoading) {
        setCurrentPage(nextPage + 1);
        setRowsPerPage(pageSize);
      }
    },
    [isLoading]
  );

  const getExpandedRowIds = useCallback(
    () =>
      assignedFormsData.reduce((acc, row) => {
        if (row.open_draft_count > 0 && row.latest_drafts.length > 0) {
          acc.push(row.id);
        }
        return acc;
      }, []),

    [assignedFormsData]
  );

  useEffect(() => {
    if (assignedFormsData.length > 0) {
      setExpandedRowIds(getExpandedRowIds());
    }
  }, [assignedFormsData, getExpandedRowIds]);

  const dataGrid = isLoading ? (
    <DataGridSkeleton
      rowCount={rowsPerPage}
      columnCount={4}
      columnWidths={[25, 25, 25, 25]}
    />
  ) : (
    <DataGrid
      pagination
      asyncPagination
      columns={columns}
      rows={assignedFormsData}
      loading={isLoading}
      pageNumber={pagination?.current_page - 1}
      pageSize={rowsPerPage}
      rowCount={pagination?.total_count || 0}
      onPaginationModelChange={handlePaginationModelChange}
      getDetailPanelHeight={() => 'auto'}
      getDetailPanelContent={getDetailPanelContent}
      detailPanelExpandedRowIds={expandedRowIds}
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
      {confirmationModal}
      {renderDataGrid}
    </Box>
  );
};

export const AssignedFormsTabTranslated: ComponentType<Props> =
  withNamespaces()(AssignedFormsTab);
export default AssignedFormsTab;

// @flow
import moment from 'moment';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { Box, Button } from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { renderStatusChip } from '@kitman/modules/src/HumanInput/shared/components/HeaderStart/utils';

const commonColumnFields = {
  flex: 1,
  sortable: false,
};

export const formatFormDate = (dateValue: string) => {
  const draftDate = moment(dateValue);

  return draftDate.isValid()
    ? formatStandard({
        date: draftDate,
        showCompleteDate: true,
        showTime: true,
        displayLongDate: true,
      })
    : '';
};

export const getColumns = (
  locationAssign: (url: string) => void,
  handleDeleteDraft: (formAnswerSetId: number) => void
): Array<GridColDef> => {
  const name: GridColDef = {
    ...commonColumnFields,
    field: 'name',
    headerName: i18n.t('Name'),
    label: i18n.t('Name'),
    renderCell: (params: GridRenderCellParams<string>) =>
      `${params.row.athlete.firstname} ${params.row.athlete.lastname}`,
  };

  const date: GridColDef = {
    ...commonColumnFields,
    field: 'lastUpdatedDate',
    headerName: i18n.t('Last updated'),
    label: i18n.t('Last updated'),
    renderCell: (params: GridRenderCellParams<string>) =>
      formatFormDate(params.row.last_completion_date),
  };

  const status: GridColDef = {
    ...commonColumnFields,
    field: 'status',
    label: i18n.t('Status'),
    headerName: i18n.t('Status'),

    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.status === 'draft'
        ? renderStatusChip(params.row.status)
        : null,
  };

  const action: GridColDef = {
    ...commonColumnFields,
    flex: 2,
    align: 'right',
    type: 'actions',
    field: 'actions',
    label: i18n.t('Action'),
    renderCell: (params: GridRenderCellParams<string>) => {
      if (params.row.open_draft_count > 0) {
        const formAnswerSetId = params.row.latest_drafts[0]?.id || '';
        return (
          <Box display="flex" gap="0.5rem" sx={{ overflowX: 'auto' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                locationAssign(`/forms/form_answers_sets/${formAnswerSetId}`);
              }}
            >
              {i18n.t('Continue')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              aria-label="delete"
              disabled={false}
              onClick={() => {
                handleDeleteDraft(formAnswerSetId);
              }}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
            </Button>
          </Box>
        );
      }
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const userId = params.row.athlete?.user_id || '';

            locationAssign(
              `/forms/form_answers_sets/new?formId=${params.row.form.id}&uid=${userId}`
            );
          }}
          disabled={params.row.open_draft_count > 0}
        >
          {i18n.t('Start')}
        </Button>
      );
    },
  };

  return [name, date, status, action];
};

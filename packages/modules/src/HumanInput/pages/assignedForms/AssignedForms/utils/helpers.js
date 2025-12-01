// @flow
import moment from 'moment';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import { type AnswersSet } from '@kitman/services/src/services/formAnswerSets/api/types';

import capitalize from 'lodash/capitalize';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Link,
  Typography,
} from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

const commonColumnFields = {
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

const renderFormsColumn = ({ row }: GridRenderCellParams<string>) => {
  const { id } = row;
  const { name } = row.form;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link underline="none" href={`/forms/form_answers_sets/${id}`}>
        <Typography variant="subtitle" sx={{ color: colors.grey_300 }}>
          {name}
        </Typography>
      </Link>
    </Box>
  );
};

const renderOrganisationColumn = ({ row }: GridRenderCellParams<string>) => {
  const { organisation } = row;
  const { name, logo_full_path: logoFullPath } = organisation || {};

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar alt={name} src={logoFullPath} sx={{ mr: 1 }} />
      <Typography variant="subtitle" sx={{ color: colors.grey_300 }}>
        {name}
      </Typography>
    </Box>
  );
};

export const getAssignedColumns = (
  locationAssign: (url: string) => void
): Array<GridColDef> => {
  const forms: GridColDef = {
    ...commonColumnFields,
    width: 300,
    field: 'forms',
    headerName: i18n.t('Forms'),
    label: i18n.t('Forms'),
    renderCell: (params: GridRenderCellParams<string>) => params.row.form.name,
  };

  const date: GridColDef = {
    ...commonColumnFields,
    width: 200,
    field: 'date',
    headerName: i18n.t('Date'),
    label: i18n.t('Date'),
    renderCell: (params: GridRenderCellParams<string>) =>
      formatFormDate(params.row.last_completion_date),
  };

  const organisation: GridColDef = {
    ...commonColumnFields,
    width: 200,
    field: 'organisation',
    label: i18n.t('Organisation'),
    headerName: i18n.t('Organisation'),
    renderCell: renderOrganisationColumn,
  };

  const status: GridColDef = {
    ...commonColumnFields,
    width: 150,
    field: 'status',
    label: i18n.t('Status'),
    headerName: i18n.t('Status'),
  };

  const action: GridColDef = {
    ...commonColumnFields,
    align: 'right',
    type: 'actions',
    field: 'actions',
    label: i18n.t('Action'),
    flex: 0.5,
    minWidth: 100,
    renderCell: (params: GridRenderCellParams<string>) => (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          locationAssign(
            `/forms/form_answers_sets/new?formId=${params.row.form.id}&oid=${params.row.organisation.id}`
          );
        }}
        disabled={!!params.row.open_draft_count > 0}
      >
        {i18n.t('Start')}
      </Button>
    ),
  };

  return [forms, date, status, organisation, action];
};

export const getCompletedColumns = ({
  showLatestPDF,
}: {
  showLatestPDF: boolean,
}): Array<GridColDef> => {
  const forms: GridColDef = {
    ...commonColumnFields,
    flex: 3,
    field: 'forms',
    headerName: i18n.t('Forms'),
    label: i18n.t('Forms'),
    renderCell: renderFormsColumn,
  };

  const status: GridColDef = {
    ...commonColumnFields,
    flex: 1,
    field: 'status',
    label: i18n.t('Form status'),
    headerName: i18n.t('Form status'),
    renderCell: (params: GridRenderCellParams<string>) => (
      <Chip
        label={capitalize(params.row.status)}
        color="success"
        size="small"
      />
    ),
  };

  const date: GridColDef = {
    ...commonColumnFields,
    flex: 1.8,
    field: 'date',
    headerName: i18n.t('Last edited'),
    label: i18n.t('Last edited'),
    renderCell: (params: GridRenderCellParams<string>) =>
      formatFormDate(params.row.date),
  };

  const latestPDF: GridColDef = {
    ...commonColumnFields,
    field: 'latestPDF',
    headerName: i18n.t('Latest PDF'),
    flex: 1.8,
    minWidth: 60,
    valueGetter: (value: { row: AnswersSet }) =>
      value.row.latestCompletedPdfExport,
    renderCell: ({ row }: GridRenderCellParams<AnswersSet>) => {
      return row.latestCompletedPdfExport?.downloadUrl ? (
        <a
          data-testid="Attachments|AttachmentLink"
          target="_blank"
          href={row.latestCompletedPdfExport.downloadUrl}
          rel="noreferrer"
          css={{
            display: 'inline-block',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            color: colors.grey_200,
            fontWeight: 400,
            '&:visited,&:hover,&:focus,&:active': {
              color: colors.grey_200,
            },
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <i
            css={{
              marginRight: '5px',
              color: colors.grey_300,
              fontSize: '16px',
            }}
            className={getNewContentTypeColorfulIcons(
              row.latestCompletedPdfExport.filetype,
              row.latestCompletedPdfExport.filename,
              false
            )}
          />
          {row.latestCompletedPdfExport.filename}
        </a>
      ) : null;
    },
  };

  const columns = [forms, date, status];
  if (showLatestPDF) {
    columns.push(latestPDF);
  }
  return columns;
};

export const completedFormAnswerSetsInitialData = {
  data: [],
  meta: {
    currentPage: 0,
    nextPage: 0,
    prevPage: 0,
    totalCount: 0,
    totalPages: 0,
  },
};

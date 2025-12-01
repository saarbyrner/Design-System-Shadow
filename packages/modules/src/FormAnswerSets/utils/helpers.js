// @flow

import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import {
  Box,
  Link,
  Typography,
  Button,
  Chip,
} from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import {
  type AnswersSet,
  type FormAnswerSetCompliance,
} from '@kitman/services/src/services/formAnswerSets/api/types';
import _ from 'lodash';
import moment from 'moment';

const COMPLETED_ROW_KEYS = {
  athleteName: 'athleteName',
  formName: 'name',
  productArea: 'productArea',
  category: 'category',
  examiner: 'examiner',
  completionDate: 'completionDate',
  status: 'status',
  latestPDF: 'latestPDF',
};

const renderCell = (params: GridRenderCellParams<string>) =>
  params.row[params.field];

const commonColumnFields = {
  flex: 1,
  renderCell,
};

const renderAthleteNameColumn = ({ row }: GridRenderCellParams<string>) => {
  const { athlete, id } = row;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link underline="none" href={`/forms/form_answers_sets/${id}`}>
        <Typography variant="subtitle" sx={{ color: colors.grey_300 }}>
          {athlete.fullname}
        </Typography>
      </Link>
    </Box>
  );
};

export const getCompletedColumns = ({
  openModal,
  isDeleteLoading,
  canDeleteForms,
  showLatestPDF,
}: {
  openModal: (formAnswerSetId: number) => void,
  isDeleteLoading: boolean,
  canDeleteForms: boolean,
  showLatestPDF: boolean,
}): Array<GridColDef> => {
  const athleteName: GridColDef = {
    flex: 1,
    field: COMPLETED_ROW_KEYS.athleteName,
    headerName: i18n.t('Athlete'),
    renderCell: renderAthleteNameColumn,
    minWidth: 200,
  };

  const formName: GridColDef = {
    flex: 3,
    field: COMPLETED_ROW_KEYS.formName,
    headerName: i18n.t('Form Name'),
    valueGetter: (value: { row: AnswersSet }) => value.row.form.name,
    minWidth: 200,
  };

  const productArea: GridColDef = {
    ...commonColumnFields,
    field: COMPLETED_ROW_KEYS.productArea,
    headerName: i18n.t('Product Area'),
    valueGetter: (value: { row: AnswersSet }) =>
      value.row.form.formCategory?.productArea,
    renderCell: ({ value }) => value,
    minWidth: 80,
  };

  const category: GridColDef = {
    ...commonColumnFields,
    field: COMPLETED_ROW_KEYS.category,
    headerName: i18n.t('Category'),
    valueGetter: (value: { row: AnswersSet }) =>
      value.row.form.formCategory?.name,
    renderCell: ({ value }) => value,
    minWidth: 80,
  };

  const examiner: GridColDef = {
    ...commonColumnFields,
    field: COMPLETED_ROW_KEYS.examiner,
    headerName: i18n.t('Examiner'),
    valueGetter: (value: { row: AnswersSet }) => value.row.editor.fullname,
    minWidth: 200,
  };

  const completionDate: GridColDef = {
    ...commonColumnFields,
    field: COMPLETED_ROW_KEYS.completionDate,
    headerName: i18n.t('Completion Date'),
    valueGetter: (value: { row: AnswersSet }) => value.row.date,
    renderCell: ({ row }: GridRenderCellParams<string>) =>
      moment(row.date).format('MMM D, YYYY'),
    minWidth: 100,
  };

  const status: GridColDef = {
    ...commonColumnFields,
    field: COMPLETED_ROW_KEYS.status,
    headerName: i18n.t('Form Status'),
    renderCell: ({ row }: GridRenderCellParams<string>) =>
      _.upperFirst(row.status),
    minWidth: 60,
  };

  const latestPDF: GridColDef = {
    ...commonColumnFields,
    field: COMPLETED_ROW_KEYS.latestPDF,
    headerName: i18n.t('Latest PDF'),
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

  const action: GridColDef = {
    ...commonColumnFields,
    field: 'actions',
    align: 'right',
    type: 'actions',
    label: i18n.t('Action'),
    minWidth: 80,
    renderCell: (params: GridRenderCellParams<string>) => {
      return (
        <Button
          color="secondary"
          variant="contained"
          disabled={isDeleteLoading}
          onClick={() => openModal(params.row.id)}
          aria-label="delete"
        >
          <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
        </Button>
      );
    },
  };

  const columns = [
    athleteName,
    formName,
    productArea,
    category,
    examiner,
    completionDate,
    status,
  ];
  if (showLatestPDF) {
    columns.push(latestPDF);
  }
  if (canDeleteForms) {
    columns.push(action);
  }
  return columns;
};

const renderTemplateNameColumn = ({ row }: GridRenderCellParams<string>) => {
  const { name, formId } = row;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link underline="none" href={`/forms/${formId}/assignments`}>
        <Typography variant="subtitle" sx={{ color: colors.grey_300 }}>
          {name}
        </Typography>
      </Link>
    </Box>
  );
};

const FORMS_ROW_KEYS = {
  templateName: 'name',
  fullname: 'fullname',
  version: 'version',
  category: 'category',
  editor: 'editor',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
};

export const getFormsColumns = (): Array<GridColDef> => {
  const templateName: GridColDef = {
    ...commonColumnFields,
    field: FORMS_ROW_KEYS.templateName,
    headerName: i18n.t('Template'),
    renderCell: renderTemplateNameColumn,
    flex: 3,
    minWidth: 200,
  };

  const updatedAt: GridColDef = {
    ...commonColumnFields,
    field: FORMS_ROW_KEYS.updatedAt,
    headerName: i18n.t('Last Updated At'),
    renderCell: ({ row }: GridRenderCellParams<string>) =>
      moment(row.updatedAt).format('MMMM DD, YYYY h:mm a'),
    flex: 1.5,
    minWidth: 180,
  };

  return [templateName, updatedAt];
};

const getStatusOrder = (status: string): number => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 4;
    case 'draft':
      return 3;
    case 'not started':
      return 2;
    case 'not assigned':
      return 1;
    default:
      return 0;
  }
};

const getStatusColor = (
  status: string
): 'success' | 'warning' | 'error' | 'default' => {
  const normalizedStatus = status?.toLowerCase().replace(/[_\s-]/g, '');

  switch (normalizedStatus) {
    case 'complete':
      return 'success';
    case 'draft':
    case 'inprogress':
      return 'warning';
    case 'notstarted':
      return 'error';
    case 'notassigned':
      return 'default';
    default:
      return 'default';
  }
};

const formatStatusLabel = (status: string): string => {
  if (!status) return i18n.t('Not assigned');

  const normalizedStatus = status.toLowerCase().replace(/[_\s-]/g, '');

  switch (normalizedStatus) {
    case 'complete':
      return i18n.t('Complete');
    case 'draft':
      return i18n.t('Draft');
    case 'inprogress':
      return i18n.t('In Progress');
    case 'notstarted':
      return i18n.t('Not started');
    case 'notassigned':
      return i18n.t('Not assigned');
    default:
      return _.upperFirst(status);
  }
};

export const getComplianceColumns = (
  onAthleteClick: (id: string) => void
): Array<GridColDef> => {
  const athlete: GridColDef = {
    flex: 2,
    field: 'athleteName',
    headerName: i18n.t('Athlete'),
    minWidth: 300,
    renderCell: ({ row }) => {
      if (row.hierarchyLevel === 1) {
        const dobDisplay = row.athleteDOB
          ? moment(row.athleteDOB).format('MMM DD, YYYY')
          : '';
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => onAthleteClick(row.id)}
          >
            <Typography
              variant="body1"
              sx={{ color: colors.grey_300, fontWeight: 600 }}
            >
              {row.athleteName}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey_400 }}>
              {row.athletePosition}
              {dobDisplay && `, ${dobDisplay}`}
            </Typography>
          </Box>
        );
      }
      if (row.hierarchyLevel === 2) {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
            onClick={() => onAthleteClick(row.id)}
          >
            <Typography variant="body1" sx={{ color: colors.grey_300 }}>
              {row.templateName}
            </Typography>
          </Box>
        );
      }
      if (row.hierarchyLevel === 3) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Link
              underline="none"
              href={`/forms/form_answers_sets/${row.answerSetId}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: colors.grey_300,
                '&:hover': {
                  color: colors.grey_200,
                },
              }}
            >
              <KitmanIcon
                name={KITMAN_ICON_NAMES.AssignmentOutlinedIcon}
                sx={{ fontSize: '1.25rem' }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: colors.grey_400,
                  fontWeight: 300,
                }}
              >
                {row.templateName}
              </Typography>
            </Link>
          </Box>
        );
      }
      return null;
    },
  };

  const lastUpdated: GridColDef = {
    flex: 1.5,
    field: 'lastUpdated',
    headerName: i18n.t('Last Updated'),
    minWidth: 180,
    renderCell: ({ row }) => {
      if (row.hierarchyLevel === 1 || row.hierarchyLevel === 2) {
        return '';
      }
      if (row.hierarchyLevel === 3) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography
              variant="body2"
              sx={{ color: colors.grey_400, fontWeight: 300 }}
            >
              {row.lastUpdate
                ? moment(row.lastUpdate).format('MMM DD, YYYY h:mm a')
                : ''}
            </Typography>
          </Box>
        );
      }
      return null;
    },
  };

  const status: GridColDef = {
    flex: 1,
    field: 'status',
    headerName: i18n.t('Status'),
    minWidth: 150,
    renderCell: ({ row }) => {
      if (row.hierarchyLevel === 1) {
        const completed = row.statusCompleted || 0;
        const total = row.statusTotal || 0;

        // set chip color based on completion ratio
        let chipColor: 'error' | 'warning' | 'success';
        if (completed === total) {
          chipColor = 'success';
        } else if (completed === 0) {
          chipColor = 'error';
        } else {
          chipColor = 'warning';
        }

        return (
          <Chip
            label={`${completed}/${total}`}
            color={chipColor}
            variant="filled"
            size="small"
          />
        );
      }
      if (row.hierarchyLevel === 2 || row.hierarchyLevel === 3) {
        const statusValue = row.status || 'Not assigned';
        const statusColor = getStatusColor(statusValue);
        const statusLabel = formatStatusLabel(statusValue);

        return (
          <Chip
            label={statusLabel}
            color={statusColor}
            variant="filled"
            size="small"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        );
      }
      return null;
    },
    sortComparator: (v1, v2, cellParams1, cellParams2) => {
      const row1 = cellParams1.row;
      const row2 = cellParams2.row;

      if (row1.hierarchyLevel === 1 && row2.hierarchyLevel === 1) {
        const ratio1 = (row1.statusCompleted || 0) / (row1.statusTotal || 1);
        const ratio2 = (row2.statusCompleted || 0) / (row2.statusTotal || 1);
        return ratio2 - ratio1;
      }

      if (
        (row1.hierarchyLevel === 2 || row1.hierarchyLevel === 3) &&
        (row2.hierarchyLevel === 2 || row2.hierarchyLevel === 3)
      ) {
        const order1 = getStatusOrder(row1.status || 'Not assigned');
        const order2 = getStatusOrder(row2.status || 'Not assigned');
        return order2 - order1;
      }

      return 0;
    },
  };

  return [athlete, lastUpdated, status];
};

export const transformDataForTree = (data: Array<FormAnswerSetCompliance>) => {
  const treeRows = [];

  data.forEach((athleteData) => {
    const fullname = athleteData.athlete.fullname;
    const position = athleteData.athlete.position?.name || 'Unknown';
    const dob = athleteData.athlete.dateOfBirth;
    const level1Id = `athlete-${athleteData.athlete.id}`;

    treeRows.push({
      id: level1Id,
      athleteName: fullname,
      athletePosition: position,
      athleteDOB: dob,
      statusCompleted: athleteData.status.completed,
      statusTotal: athleteData.status.total,
      path: [level1Id],
      hierarchyLevel: 1,
    });

    athleteData.formTemplates.forEach((formTemplate) => {
      const level2Id = `${level1Id}/template-${formTemplate.id}`;

      treeRows.push({
        id: level2Id,
        athleteName: fullname,
        athletePosition: position,
        athleteDOB: dob,
        templateName: formTemplate.name,
        status: formTemplate.status,
        lastUpdate: formTemplate.lastUpdate,
        path: [level1Id, level2Id],
        hierarchyLevel: 2,
      });

      if (
        formTemplate.formAnswersSets &&
        formTemplate.formAnswersSets.length > 0
      ) {
        formTemplate.formAnswersSets.forEach((answerSet) => {
          const level3Id = `${level2Id}/answerset-${answerSet.id}`;
          treeRows.push({
            id: level3Id,
            athleteName: fullname,
            athletePosition: position,
            athleteDOB: dob,
            templateName: formTemplate.name,
            status: answerSet.status,
            lastUpdate: answerSet.updatedAt,
            path: [level1Id, level2Id, level3Id],
            hierarchyLevel: 3,
            isAnswerSet: true,
            answerSetId: answerSet.id,
          });
        });
      }
    });
  });

  return treeRows;
};

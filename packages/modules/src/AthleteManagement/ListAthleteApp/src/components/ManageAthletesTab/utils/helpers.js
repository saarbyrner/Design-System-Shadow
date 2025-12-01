// @flow
import moment from 'moment';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { GridRowSelectionModel } from '@mui/x-data-grid';

import {
  Link,
  Box,
  Avatar,
  Typography,
  Chip,
  Stack,
} from '@kitman/playbook/components';
import i18n from '@kitman/common/src/utils/i18n';
import type { FullLabelResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { colors } from '@kitman/common/src/variables';
import type { SearchAthleteProfile } from '@kitman/modules/src/UserMovement/shared/types';
import buildCellContent from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/utils/cellBuilder';
import {
  creationDateHeaderClassName,
  squadsHeaderClassName,
  creationDateCellClassName,
  squadsCellClassName,
} from './consts';

const ROW_KEYS = {
  athlete: 'athlete',
  assigned_to: 'assigned_to',
  email: 'email',
  date_of_birth: 'date_of_birth',
  id: 'id',
  username: 'username',
  position: 'position',
  career_status: 'career_status',
  squads: 'squads',
  created: 'created',
  labels: 'labels',
  athlete_game_status: 'athlete_game_status',
};

export const generateAthletePageHref = (id: number) =>
  window.featureFlags['form-based-athlete-profile']
    ? `/athletes/${id}/profile`
    : `/settings/athletes/${id}/edit`;

const renderDateCell = (date: string): string =>
  formatStandard({ date: moment(date) });

const renderPlayerColumn = ({ row }: GridRenderCellParams<string>) => {
  const { avatar, name, id } = row;

  const href = generateAthletePageHref(id);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar src={avatar} alt={name} key={id} />
      <Link underline="none" href={href} sx={{ ml: 1 }}>
        <Typography variant="subtitle" sx={{ color: colors.grey_300 }}>
          {name}
        </Typography>
      </Link>
    </Box>
  );
};

const renderLabelsCell = ({ row }: GridRenderCellParams<string>) => {
  const { labels } = row;
  return labels ? (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 1, md: 2 }}
      sx={{ overflow: 'auto', textOverflow: 'ellipsis' }}
    >
      {labels.map(({ id, name, color }) => (
        <Chip
          key={id}
          label={name}
          size="small"
          sx={{ backgroundColor: color }}
        />
      ))}
    </Stack>
  ) : null;
};

const renderCell = (params: GridRenderCellParams<string>) =>
  params.row[params.field];

const commonColumnFields = {
  flex: 1,
  renderCell,
};

const athleteColumn: GridColDef = {
  field: ROW_KEYS.athlete,
  headerName: i18n.t('Player'),
  flex: 1,
  valueGetter: (value: { row: SearchAthleteProfile }) => value.row.name,
  renderCell: renderPlayerColumn,
};

const assignedToColumn: GridColDef = {
  field: ROW_KEYS.assigned_to,
  headerName: i18n.t('Assigned To'),
  ...commonColumnFields,
  renderCell: ({ row }) =>
    buildCellContent({ row_key: ROW_KEYS.assigned_to }, row), // Reusing LO's grid's logic for now
};

const emailColumn: GridColDef = {
  field: ROW_KEYS.email,
  headerName: i18n.t('Email'),
  ...commonColumnFields,
};

const dateOfBirthColumn: GridColDef = {
  field: ROW_KEYS.date_of_birth,
  headerName: i18n.t('DOB'),
  ...commonColumnFields,
  renderCell: ({ row }) => renderDateCell(row[ROW_KEYS.date_of_birth]),
};

const idColumn: GridColDef = {
  field: ROW_KEYS.id,
  headerName: i18n.t('Athlete ID'),
  ...commonColumnFields,
};

const usernameColumn: GridColDef = {
  field: ROW_KEYS.username,
  headerName: i18n.t('Username'),
  ...commonColumnFields,
};

const positionColumn: GridColDef = {
  field: ROW_KEYS.position,
  headerName: i18n.t('Roster Position'),
  ...commonColumnFields,
};

const careerStatusColumn: GridColDef = {
  field: ROW_KEYS.career_status,
  headerName: i18n.t('Career Status'),
  ...commonColumnFields,
  renderCell: ({ row }) =>
    buildCellContent({ row_key: ROW_KEYS.career_status }, row), // Reusing LO's grid's logic for now
};

const squadsColumn: GridColDef = {
  field: ROW_KEYS.squads,
  headerName: i18n.t('Squads'),
  ...commonColumnFields,
  cellClassName: squadsCellClassName,
  headerClassName: squadsHeaderClassName,
};

const creationDateColumn: GridColDef = {
  field: ROW_KEYS.created,
  headerName: i18n.t('Creation Date'),
  ...commonColumnFields,
  renderCell: ({ row }) => renderDateCell(row[ROW_KEYS.created]),
  cellClassName: creationDateCellClassName,
  headerClassName: creationDateHeaderClassName,
};

const labelsColumn: GridColDef = {
  field: ROW_KEYS.labels,
  headerName: i18n.t('Labels'),
  ...commonColumnFields,
  renderCell: renderLabelsCell,
};

export const availabilityStatus: GridColDef = {
  field: ROW_KEYS.athlete_game_status,
  headerName: i18n.t('Availability Status'),
  ...commonColumnFields,
  renderCell: ({ row }) =>
    buildCellContent({ row_key: ROW_KEYS.athlete_game_status }, row), // Reusing LO's grid's logic for now
};

export const associationAdminColumns = [
  athleteColumn,
  assignedToColumn,
  emailColumn,
  dateOfBirthColumn,
  idColumn,
  usernameColumn,
  positionColumn,
  careerStatusColumn,
];

export const nonAssociationAdminColumns = [
  athleteColumn,
  usernameColumn,
  positionColumn,
  squadsColumn,
  creationDateColumn,
];

export const getMuiCols = (
  isAssociationAdmin: boolean,
  canViewLabels: boolean,
  canManageGameStatus: boolean
) => {
  let columns;
  if (isAssociationAdmin) {
    columns = [
      ...associationAdminColumns,
      ...(canManageGameStatus ? [availabilityStatus] : []),
    ];
  } else {
    columns = [
      ...nonAssociationAdminColumns,
      ...(canManageGameStatus ? [availabilityStatus] : []),
      ...(canViewLabels ? [labelsColumn] : []),
    ];
  }

  return columns;
};

export const getPreselectedLabelsForSelectedIds = (
  data: Array<SearchAthleteProfile>,
  selection: GridRowSelectionModel
) => {
  const selectedRowsData: Array<SearchAthleteProfile> = [];

  selection.forEach((selected) => {
    const selectedRow = data.find((row) => row.id === selected);
    if (selectedRow) {
      selectedRowsData.push(selectedRow);
    }
  });

  const unionLabels = selectedRowsData.reduce(
    (acc: Array<FullLabelResponse>, selectedRowData: SearchAthleteProfile) => {
      const selectedRowDataLabels = selectedRowData.labels || [];

      return [...acc, ...selectedRowDataLabels];
    },
    []
  );

  return unionLabels.reduce((acc, currentLabel) => {
    const targetLabel = acc.find((item) => item.id === currentLabel.id);

    if (!targetLabel) {
      acc.push(currentLabel);
    }
    return acc;
  }, []);
};

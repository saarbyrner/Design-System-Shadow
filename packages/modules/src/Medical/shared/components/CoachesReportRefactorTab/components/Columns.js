// @flow
import i18n from '@kitman/common/src/utils/i18n';
import {
  Box,
  Avatar,
  Typography,
  Tooltip,
  AvailabilityLabel,
} from '@kitman/playbook/components';
import { TextLink } from '@kitman/components';
import { keyboardkeys } from '@kitman/common/src/variables';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
// This style file will be copied over and updated when old tab is removed - pointless to duplicate
import {
  v2styles as styles,
  commonStyles,
} from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/styles';
import type { GridRow } from '../types';
import { cellNotBeingEditedValue, navigationKeys } from '../utils/utils';

export const handleOnCellClick = (
  { row }: { row: GridRenderCellParams },
  editingCellId: number,
  setEditingCellId: (id: number) => void,
  setRichTextEditorIsInFocus: (focus: boolean) => void
) => {
  const { id } = row;
  if (editingCellId !== id) {
    setRichTextEditorIsInFocus(false);
    setEditingCellId(id);
  }
};

export const athleteFormatter = ({ row }: { row: GridRenderCellParams }) => {
  return (
    <Box sx={styles.athleteCell} data-testid="coachesReport|AthleteCell">
      <Avatar
        src={row.athlete.avatar_url}
        variant="circle"
        sx={{
          height: '2rem',
          width: '2rem',
          marginRight: '1.25rem',
          '&:first-of-type': {
            marginRight: '0rem',
          },
        }}
      />
      <Box sx={styles.athleteDetailsContainer}>
        <TextLink
          text={row.athlete.fullname}
          href={`/medical/athletes/${row.id}`}
          kitmanDesignSystem
        />
        <Typography
          component="span"
          data-testid="positionRow"
          sx={commonStyles.position}
        >
          {row.player_id
            ? `${row.player_id} - ${row.athlete.position}`
            : row.athlete.position}
        </Typography>
      </Box>
    </Box>
  );
};

export const openIssuesFormatter = ({ row }: { row: GridRenderCellParams }) => {
  return row.open_injuries_illnesses || [];
};
type CoachesReportColumns = {
  setRichTextEditorIsInFocus: (focus: boolean) => void,
  editingCellId: number,
  canViewInjuries: boolean,
  canViewAvailabilityStatus: boolean,
  setEditingCellId: (id: number) => void,
  rowSelectionModel: Array<number>,
  renderNoteCell: (
    isEditing: boolean,
    noteCellContent: string
  ) => React$Element<'div'> | null,
};

type ValueGetterParams = {
  row: {
    updated_by?: string,
  },
};

export const getColumns = ({
  setRichTextEditorIsInFocus,
  editingCellId,
  canViewInjuries,
  canViewAvailabilityStatus,
  setEditingCellId,
  rowSelectionModel,
  renderNoteCell,
}: CoachesReportColumns) => [
  {
    field: 'athlete',
    valueGetter: (params: { row: GridRow }) => params.row.athlete.fullname,
    headerName: i18n.t('Athlete'),
    renderCell: athleteFormatter,
    flex: 0.8,
    editable: false,
    sortable: true,
  },
  ...(canViewAvailabilityStatus
    ? [
        {
          field: 'availability_status',
          valueGetter: (params: Object) =>
            params.row?.availability_status?.availability,
          renderCell: ({ row }: { row: GridRenderCellParams }) => (
            <AvailabilityLabel status={row?.availability_status} />
          ),
          headerName: i18n.t('Availability status'),
          flex: 0.8,
          editable: false,
          sortable: true,
        },
      ]
    : []),
  ...(canViewInjuries
    ? [
        {
          field: 'open_injuries_illnesses',
          dataField: 'open_injuries_illnesses',
          headerName: i18n.t('Open Injury/ Illness'),
          renderCell: openIssuesFormatter,
          flex: 1.2,
          editable: false,
          sortable: false,
        },
      ]
    : []),
  {
    field: 'most_recent_coaches_note',
    dataField: 'most_recent_coaches_note',
    renderCell: ({ row }: { row: GridRenderCellParams }) => {
      const isEditing = editingCellId === row.id;
      const noteCellContent = row.most_recent_coaches_note || '';
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            outline: 'none',
          }}
          onClick={() =>
            handleOnCellClick(
              { row },
              editingCellId,
              setEditingCellId,
              setRichTextEditorIsInFocus
            )
          }
        >
          <Box
            onKeyDown={(event) => {
              if (navigationKeys.includes(event.key)) {
                event.stopPropagation();
                return false;
              }
              if (event.key === keyboardkeys.esc) {
                setEditingCellId(cellNotBeingEditedValue);
              }
              return false;
            }}
          >
            {editingCellId === cellNotBeingEditedValue ? (
              <Tooltip
                title={
                  rowSelectionModel?.length > 1
                    ? i18n.t('Bulk note creation mode on')
                    : i18n.t('Add note')
                }
              >
                <Box>{renderNoteCell(isEditing, noteCellContent)}</Box>
              </Tooltip>
            ) : (
              renderNoteCell(isEditing, noteCellContent)
            )}
          </Box>
        </Box>
      );
    },
    headerName: i18n.t('Note'),
    flex: 1.2,
    editable: false,
    sortable: true,
  },
  {
    field: 'updated_by',
    valueGetter: (params: ValueGetterParams) => params.row?.updated_by,
    dataField: 'updated_by',
    headerName: i18n.t('Updated by'),
    flex: 1,
    editable: false,
    sortable: true,
  },
];

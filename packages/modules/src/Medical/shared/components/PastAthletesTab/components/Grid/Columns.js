// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import buildCellContent from '@kitman/modules/src/Medical/shared/components/PastAthletesTab/components/Grid/Cells';

export const FIELD_KEY = {
  player: 'player',
  player_id: 'player_id',
  departed_date: 'departed_date',
  open_injury_illness: 'open_injury_illness',
};

const renderCell = ({ params }: { params: GridRenderCellParams }) =>
  buildCellContent({
    field: params.field,
    row: params.row,
  });

export const getColumn = ({
  field,
  headerName,
  flex = 0.3,
}: {
  field: $Keys<typeof FIELD_KEY>,
  headerName: string,
  flex?: number,
}) => ({
  field,
  headerName,
  flex,
  visible: true,
  sortable: false,
  renderCell: (params: GridRenderCellParams) => renderCell({ params }),
});

export const getPlayerColumn = () =>
  getColumn({
    field: FIELD_KEY.player,
    headerName: i18n.t('Athlete'),
  });

export const getPlayerIdColumn = () =>
  getColumn({
    field: FIELD_KEY.player_id,
    headerName: i18n.t('Player ID'),
  });

export const getDepartedDateColumn = () =>
  getColumn({
    field: FIELD_KEY.departed_date,
    headerName: i18n.t('Departed date'),
  });

export const getOpenInjuryIllnessColumn = () =>
  getColumn({
    field: FIELD_KEY.open_injury_illness,
    headerName: i18n.t('Open Injury/ Illness'),
    flex: 1,
  });

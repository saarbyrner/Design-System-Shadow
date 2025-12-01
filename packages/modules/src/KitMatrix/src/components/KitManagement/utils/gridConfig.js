// @flow
import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import type { Kit } from '@kitman/modules/src/KitMatrix/shared/types';
import { Box, Typography } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import capitalize from 'lodash/capitalize';
import EquipmentCell from '@kitman/modules/src/KitMatrix/src/components/EquipmentCell';
import TruncatedTextWithTooltip from './TruncatedTextWithTooltip';

export const commonColDef = {
  sortable: false,
  resizable: false,
};
export const FALLBACK_DASH = '-';

const FallbackTypography = () => <Typography>{FALLBACK_DASH}</Typography>;

// Function to create columns with proper i18n support
export const createColumns = (t: (key: string) => string) => [
  {
    ...commonColDef,
    field: 'club',
    headerName: t('Club'),
    flex: 1,
    minWidth: 180,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.organisation) {
        return <FallbackTypography />;
      }
      const imageSrc = params.row.organisation?.logo_full_path;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src={imageSrc}
            alt={params.row.organisation?.name}
            style={{ width: 24, height: 24, borderRadius: 4 }}
          />
          <Typography>{params.row.organisation?.name}</Typography>
        </Box>
      );
    },
  },
  {
    ...commonColDef,
    field: 'name',
    headerName: t('Kit name'),
    flex: 1,
    minWidth: 160,
    renderCell: (params: GridRenderCellParams<Kit>) => (
      <TruncatedTextWithTooltip
        text={params.row?.name || ''}
        sx={{
          fontFamily: 'Open Sans',
          fontSize: '14px',
          fontWeight: '600',
          lineHeight: '20px',
          color: colors.grey_200,
        }}
      />
    ),
  },
  {
    ...commonColDef,
    field: 'season',
    headerName: t('Season'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => (
      <Typography>
        {params.row?.league_season?.name || FALLBACK_DASH}
      </Typography>
    ),
  },
  {
    ...commonColDef,
    field: 'type',
    headerName: t('Type'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.type) return <FallbackTypography />;
      return <Typography>{capitalize(params.row.type)}</Typography>;
    },
  },
  {
    ...commonColDef,
    field: 'league',
    headerName: t('League'),
    flex: 1,
    minWidth: 160,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.division?.name) return <FallbackTypography />;
      return <Typography>{params.row.division.name}</Typography>;
    },
  },
  {
    ...commonColDef,
    field: 'color',
    headerName: t('Color'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      return (
        <Box
          sx={{
            width: 30,
            height: 30,
            border: `1px solid ${colors.grey_300_50}`,
            borderRadius: '8px',
            backgroundColor: params?.row?.color,
          }}
        />
      );
    },
  },
  {
    ...commonColDef,
    field: 'jersey',
    headerName: t('Jersey'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.jersey) return <FallbackTypography />;
      return (
        <EquipmentCell
          color={params.row.jersey.colorName}
          imageUrl={params.row.jersey.image.url}
          type="jersey"
        />
      );
    },
  },
  {
    ...commonColDef,
    field: 'shorts',
    headerName: t('Shorts'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.shorts) return <FallbackTypography />;
      return (
        <EquipmentCell
          color={params.row.shorts.colorName}
          imageUrl={params.row.shorts.image.url}
          type="shorts"
        />
      );
    },
  },
  {
    ...commonColDef,
    field: 'socks',
    headerName: t('Socks'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.socks) return <FallbackTypography />;
      return (
        <EquipmentCell
          color={params.row.socks.colorName}
          imageUrl={params.row.socks.image.url}
          type="socks"
        />
      );
    },
  },
  {
    ...commonColDef,
    field: 'linked_fixtures',
    headerName: t('Linked fixtures'),
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Kit>) => {
      if (!params.row.games_count) return <FallbackTypography />;
      return <Typography>{params.row.games_count}</Typography>;
    },
  },
];

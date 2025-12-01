// @flow

import i18n from '@kitman/common/src/utils/i18n';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Box } from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import capitalize from 'lodash/capitalize';
import EquipmentCell from '../components/EquipmentCell';
import style from '../../style';
import Club from '../components/Club';

export const commonColDef = {
  sortable: false,
  resizable: false,
};

export const columnHeaders: { [key: string]: GridColDef } = {
  club: {
    ...commonColDef,
    field: 'club',
    headerName: i18n.t('Club'),
    width: 250,
    renderCell: (params) => {
      if (!params.row.organisation) {
        return <span css={style.club}>--</span>;
      }
      const imageSrc = params.row.organisation.logo_full_path;

      return <Club imageSrc={imageSrc} name={params.row.organisation.name} />;
    },
  },
  name: {
    ...commonColDef,
    field: 'name',
    headerName: i18n.t('Kit Name'),
    width: 200,
    renderCell: (params) => {
      return <span css={style.kitName}>{params.row.name}</span>;
    },
  },
  type: {
    ...commonColDef,
    field: 'type',
    headerName: i18n.t('Type'),
    width: 120,
    renderCell: (params) => {
      if (!params.row.type) return <span>--</span>;
      return <span>{capitalize(params.row.type)}</span>;
    },
  },
  division: {
    ...commonColDef,
    field: 'division',
    headerName: i18n.t('League'),
    width: 120,
    renderCell: (params) => {
      if (!params.row.division?.name) return <span>--</span>;
      return <span>{params.row.division.name}</span>;
    },
  },
  color: {
    ...commonColDef,
    field: 'color',
    headerName: i18n.t('Color'),
    width: 60,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            width: 30,
            height: 30,
            border: `1px solid ${colors.grey_300_50}`,
            borderRadius: '8px',
            backgroundColor: params.row.color.toLowerCase(),
          }}
        />
      );
    },
  },
  jersey: {
    ...commonColDef,
    field: 'jersey',
    headerName: i18n.t('Jersey'),
    width: 125,
    renderCell: (params) => {
      return (
        <EquipmentCell
          color={params.row.jersey.colorName}
          imageUrl={params.row.jersey.image.url}
          type="jersey"
        />
      );
    },
  },
  shorts: {
    ...commonColDef,
    field: 'shorts',
    headerName: i18n.t('Shorts'),
    width: 125,
    renderCell: (params) => {
      return (
        <EquipmentCell
          color={params.row.shorts.colorName}
          imageUrl={params.row.shorts.image.url}
          type="shorts"
        />
      );
    },
  },
  socks: {
    ...commonColDef,
    field: 'socks',
    headerName: i18n.t('Socks'),
    width: 125,
    renderCell: (params) => {
      return (
        <EquipmentCell
          color={params.row.socks.colorName}
          imageUrl={params.row.socks.image.url}
          type="socks"
        />
      );
    },
  },
  linkedFixtures: {
    ...commonColDef,
    field: 'games_count',
    headerName: i18n.t('Linked fixtures'),
    width: 135,
    align: 'center',
  },
  status: {
    ...commonColDef,
    field: 'status',
    headerName: i18n.t('Status'),
    width: 90,
  },
};

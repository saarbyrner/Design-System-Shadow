// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { FixtureForm } from '@kitman/modules/src/MatchDay/shared/types';

export const officialRoleEnumLike = {
  Referee: 'referee',
  AssistantReferee1: 'assistant_referee_1',
  AssistantReferee2: 'assistant_referee_2',
  FourthReferee: 'fourth_referee',
  ReserveAR: 'reserve_ar',
  Var: 'var',
  Avar: 'avar',
};

export const playerKindEnumLike = {
  HomePlayer: 'home_player',
  HomeGoalkeeper: 'home_goalkeeper',
  Referee: 'referee',
  AwayPlayer: 'away_player',
  AwayGoalkeeper: 'away_goalkeeper',
};

export const defaultFormState = {
  matchNumber: null,
  date: null,
  time: null,
  kickTime: null,
  locationId: null,
  tvChannelIds: [],
  tvContactIds: [],
};

export const defaultFixtureFormState: FixtureForm = Object.freeze({
  matchId: null,
  competition: null,
  round: null,
  timezone: null,
  date: null,
  kickTime: null,
  homeTeam: null,
  awayTeam: null,
  homeSquad: null,
  awaySquad: null,
  location: null,
  tvChannelIds: [],
  tvContactIds: [],
  [officialRoleEnumLike.Referee]: null,
  [officialRoleEnumLike.AssistantReferee1]: null,
  [officialRoleEnumLike.AssistantReferee2]: null,
  [officialRoleEnumLike.FourthReferee]: null,
  [officialRoleEnumLike.ReserveAR]: null,
  [officialRoleEnumLike.Var]: null,
  [officialRoleEnumLike.Avar]: null,
  matchDirectorId: null,
});

export const commonColDef = {
  sortable: false,
  resizable: false,
};

export const columnHeaders: { [key: string]: GridColDef } = {
  role: {
    ...commonColDef,
    field: 'role',
    headerName: i18n.t('Role'),
    width: 300,
    renderCell: (params) => {
      return <b>{params.row.role}</b>;
    },
  },
  name: {
    ...commonColDef,
    field: 'name',
    headerName: i18n.t('Name'),
    width: 300,
    renderCell: (params) => {
      return <span>{params.row.name ?? '-'}</span>;
    },
  },
  phone: {
    ...commonColDef,
    field: 'phone',
    headerName: i18n.t('Phone'),
    width: 250,
    renderCell: (params) => {
      return <span>{params.row.phone ?? '-'}</span>;
    },
  },
  email: {
    ...commonColDef,
    field: 'email',
    headerName: i18n.t('Email'),
    width: 250,
    renderCell: (params) => {
      return <span>{params.row.email ?? '-'}</span>;
    },
  },
};

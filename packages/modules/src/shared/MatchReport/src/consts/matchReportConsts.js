// @flow

export const MATCH_REPORT_TABS = {
  PLAYERS: 'players',
  STAFF: 'staff',
  FORM: 'form',
};

export const defaultTeamPitchInfo = {
  home: {
    formation: null,
    formationCoordinates: {},
    positions: [],
    inFieldPlayers: {},
    players: [],
    listPlayers: [],
    staff: [],
  },
  away: {
    formation: null,
    formationCoordinates: {},
    positions: [],
    inFieldPlayers: {},
    players: [],
    listPlayers: [],
    staff: [],
  },
};

export const TOAST_ANIMATION_DURATION = 2000;

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type MatchDayEmailPanelMode = 'DMN' | 'DMR';

export type MatchDayEmailPanelState = {
  panel: {
    isOpen: boolean,
    mode: MatchDayEmailPanelMode,
  },
};

export type MatchDayTemplateMatchDetails = {
  assistant_referee_1: string,
  assistant_referee_2: string,
  reserve_ar?: string,
  date: string,
  avar: string,
  fourth_referee: string,
  kick_time: string,
  match_no: string,
  referee: string,
  time: string,
  timestamp: string,
  tv: string,
  var: string,
  venue: string,
};

export type MatchDayRosterTemplateAthlete = {
  name: string,
  position: string,
  position_order: number,
  jersey_number: number,
  captain: boolean,
  kitman_id?: string,
  avatar?: string,
  date_of_birth?: string,
};

export type MatchDayRosterTemplateBenchPersonnel = {
  name: string,
  role: string,
  user_order?: number,
  avatar?: string,
};

export type MatchDayRosterTemplateTeam = {
  name: string,
  logo_url: string,
  formation: string,
  starters: Array<MatchDayRosterTemplateAthlete>,
  substitutes: Array<MatchDayRosterTemplateAthlete>,
  bench_personnel: Array<MatchDayRosterTemplateBenchPersonnel>,
};

export type MatchDayRosterTemplateData = {
  logo_url: string,
  match_details: MatchDayTemplateMatchDetails,
  home: MatchDayRosterTemplateTeam,
  away: MatchDayRosterTemplateTeam,
};

type MatchDayNoticeTemplateTeam = {
  logo_url: string,
  name: string,
};

type MatchDayNoticeTemplateGameContact = {
  game_day_role: string,
  name: string,
  cell_phone: string,
  email: string,
};

type MatchDayNoticeKit = {
  url: string,
  color: string,
};

type MatchDayNoticeKitMatrix = {
  jersey: MatchDayNoticeKit,
  shorts: MatchDayNoticeKit,
  socks: MatchDayNoticeKit,
};

export type MatchDayNoticeTemplateData = {
  logo_url: string,
  match_details: MatchDayTemplateMatchDetails,
  home: MatchDayNoticeTemplateTeam,
  away: MatchDayNoticeTemplateTeam,
  game_contacts: Array<MatchDayNoticeTemplateGameContact>,
  kits: {
    away_goalkeeper: MatchDayNoticeKitMatrix,
    away_player: MatchDayNoticeKitMatrix,
    home_goalkeeper: MatchDayNoticeKitMatrix,
    home_player: MatchDayNoticeKitMatrix,
    referee: MatchDayNoticeKitMatrix,
  },
};

export const initialState: MatchDayEmailPanelState = {
  panel: {
    isOpen: false,
    mode: 'DMN',
  },
};

export type OnSetPanelState = {
  payload: {
    isOpen: boolean,
    mode: MatchDayEmailPanelMode,
  },
};

export const REDUCER_KEY: string = 'matchDayEmailSlice';

const matchDayEmailSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: MatchDayEmailPanelState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
      state.panel.mode = action.payload?.mode;
    },
    onReset: () => initialState,
  },
});

export const { onTogglePanel, onReset } = matchDayEmailSlice.actions;
export default matchDayEmailSlice;

// @flow
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type {
  GameActivity,
  TeamsPitchInfo,
} from '@kitman/common/src/types/GameEvent';
import type {
  PitchViewInitialState,
  Field,
  Formation,
  Team,
  FormationCoordinates,
  PlayerWithPosition,
} from '@kitman/common/src/types/PitchView';
import { defaultTeamPitchInfo } from '@kitman/modules/src/shared/MatchReport/src/consts/matchReportConsts';

export const initialState: PitchViewInitialState = {
  field: {
    id: 0,
    name: '',
    width: 0,
    height: 0,
    columns: 0,
    rows: 0,
    cellSize: 0,
  },
  team: {
    inFieldPlayers: {},
    players: [],
  },
  teams: defaultTeamPitchInfo,
  selectedFormation: null,
  selectedGameFormat: null,
  formationCoordinates: {},
  activeEventSelection: '',
  pitchActivities: [],
  selectedPitchPlayer: null,
  isLoading: false,
};

const pitchViewSlice = createSlice({
  name: 'pitchView',
  initialState,
  reducers: {
    setField: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: Field }>
    ) => {
      state.field = {
        ...state.field,
        ...(action.payload || {}),
      };
    },
    setSelectedGameFormat: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: ?OrganisationFormat }>
    ) => {
      state.selectedGameFormat = action.payload;
    },
    setSelectedFormation: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: ?Formation }>
    ) => {
      state.selectedFormation = action.payload;
    },
    setTeam: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: Team }>
    ) => {
      state.team = action.payload;
    },
    setTeams: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: TeamsPitchInfo }>
    ) => {
      state.teams = action.payload;
    },
    setFormationCoordinates: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: FormationCoordinates }>
    ) => {
      state.formationCoordinates = action.payload;
    },
    setActiveEventSelection: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: string }>
    ) => {
      state.activeEventSelection = action.payload;
    },
    setPitchActivities: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: Array<GameActivity> }>
    ) => {
      state.pitchActivities = action.payload;
    },
    setSelectedPitchPlayer: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: ?PlayerWithPosition }>
    ) => {
      state.selectedPitchPlayer = action.payload;
    },
    setIsLoading: (
      state: PitchViewInitialState,
      action: PayloadAction<{ payload: boolean }>
    ) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setField,
  setSelectedGameFormat,
  setSelectedFormation,
  setTeam,
  setTeams,
  setFormationCoordinates,
  setActiveEventSelection,
  setPitchActivities,
  setSelectedPitchPlayer,
  setIsLoading,
} = pitchViewSlice.actions;
export default pitchViewSlice;

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  MatchMonitorSlice,
  OnUpdateAction,
} from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/types';

export const initialState: MatchMonitorSlice = {
  existingUserPanel: {
    isOpen: false,
  },
  newUserFormPanel: {
    isOpen: false,
  },
  registeredPlayerImageModal: {
    isOpen: false,
  },
  unregisteredPlayer: {
    firstname: '',
    lastname: '',
    date_of_birth: null,
    registration_status: null,
    notes: '',
    venue_type: 'home',
  },
  matchMonitorReport: {
    game_monitor_report_athletes: [],
    game_monitor_report_unregistered_athletes: [],
    notes: '',
    monitor_issue: false,
    submitted_by_id: null,
    updated_at: null,
  },
};

export const REDUCER_KEY: string = 'matchMonitorSlice';

const matchMonitorSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onToggleExistingUserPanel: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      state.existingUserPanel.isOpen = action.payload.isOpen;
    },
    onToggleNewUserFormPanel: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      state.newUserFormPanel.isOpen = action.payload.isOpen;
    },
    onToggleRegisteredPlayerImageModal: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      state.registeredPlayerImageModal.isOpen = action.payload.isOpen;
    },
    onSetUnregisteredPlayer: (state, action: PayloadAction<OnUpdateAction>) => {
      state.unregisteredPlayer = {
        ...state.unregisteredPlayer,
        ...action.payload,
      };
    },
    onSetUnregisteredPlayers: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      const { payload: unregisteredPlayer } = action;
      state.matchMonitorReport.game_monitor_report_unregistered_athletes = [
        ...state.matchMonitorReport.game_monitor_report_unregistered_athletes,
        unregisteredPlayer,
      ];
      state.unregisteredPlayer = initialState.unregisteredPlayer;
    },
    onRemoveUnregisteredPlayer: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      const { payload: index } = action;
      state.matchMonitorReport.game_monitor_report_unregistered_athletes.splice(
        index,
        1
      );
    },
    onChangeRegisteredPlayer: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      const { athlete_id: athleteId, checked } = action.payload;
      const index =
        state.matchMonitorReport.game_monitor_report_athletes.findIndex(
          // eslint-disable-next-line camelcase
          ({ athlete_id }) => athlete_id === athleteId
        );
      state.matchMonitorReport.game_monitor_report_athletes[index].compliant =
        checked;
    },
    onMatchMonitorReportChange: (
      state,
      action: PayloadAction<OnUpdateAction>
    ) => {
      state.matchMonitorReport = {
        ...state.matchMonitorReport,
        ...action.payload,
      };
    },
    onSetNotes: (state, action: PayloadAction<OnUpdateAction>) => {
      const { payload: notes } = action;
      state.matchMonitorReport.notes = notes;
    },
    onReset: () => initialState,
    onResetUnregisteredPlayerForm: (state) => {
      state.unregisteredPlayer = initialState.unregisteredPlayer;
    },
  },
});

export const {
  onToggleExistingUserPanel,
  onToggleNewUserFormPanel,
  onToggleRegisteredPlayerImageModal,
  onSetUnregisteredPlayer,
  onSetUnregisteredPlayers,
  onReset,
  onResetUnregisteredPlayerForm,
  onRemoveUnregisteredPlayer,
  onSetNotes,
  onMatchMonitorReportChange,
  onChangeRegisteredPlayer,
} = matchMonitorSlice.actions;

export default matchMonitorSlice;

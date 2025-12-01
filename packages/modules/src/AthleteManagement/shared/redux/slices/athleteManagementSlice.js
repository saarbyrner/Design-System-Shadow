// @flow
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GridRowSelectionModel } from '@mui/x-data-grid';

export type BulkActionsData = {
  selectedAthleteIds: Array<{ id: number, userId: number }>,
  selectedSquadIds: Array<number>,
  originalSelectedLabelIds: Array<number>, // original copy needed to compare changes in labels selection
  selectedLabelIds: Array<number>,
  availabilityStatusId?: number,
  shouldRemovePrimarySquad: boolean,
  originalStatus?: string,
  selectedStatus?: string,
};

export type AthleteManagementState = {
  statuses: { activeStatus: string, careerStatus: string },
  panels: {
    wellBeingReminderModal: boolean,
    trainingSessionReminderModal: boolean,
  },
  bulkActions: BulkActionsData,
  searchQuery: string,
};

export const initialState: AthleteManagementState = {
  statuses: { activeStatus: '', careerStatus: '' },
  panels: {
    wellBeingReminderModal: false,
    trainingSessionReminderModal: false,
  },
  bulkActions: {
    selectedAthleteIds: [],
    selectedSquadIds: [],
    originalSelectedLabelIds: [],
    selectedLabelIds: [],
    shouldRemovePrimarySquad: false,
  },
  searchQuery: '',
};

export const REDUCER_KEY: string = 'athleteManagementSlice';

const athleteManagementSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetStatuses: (
      state: AthleteManagementState,
      action: PayloadAction<{ activeStatus: string, careerStatus: string }>
    ) => {
      state.statuses = action.payload;
    },
    onToggleShowWellBeingModal: (state: AthleteManagementState) => {
      state.panels.wellBeingReminderModal =
        !state.panels.wellBeingReminderModal;
    },
    onToggleTrainingSessionReminderModal: (state: AthleteManagementState) => {
      state.panels.trainingSessionReminderModal =
        !state.panels.trainingSessionReminderModal;
    },
    onReset: () => initialState,
    onUpdateSelectedAthleteIds: (
      state: AthleteManagementState,
      action: PayloadAction<GridRowSelectionModel>
    ) => {
      state.bulkActions.selectedAthleteIds = action.payload;
    },
    onUpdateSelectedSquadIds: (
      state: AthleteManagementState,
      action: PayloadAction<Array<number>>
    ) => {
      state.bulkActions.selectedSquadIds = action.payload;
    },
    onUpdateOriginalSelectedLabelIds: (
      state: AthleteManagementState,
      action: PayloadAction<Array<number>>
    ) => {
      state.bulkActions.originalSelectedLabelIds = action.payload;
    },
    onUpdateSelectedLabelIds: (
      state: AthleteManagementState,
      action: PayloadAction<Array<number>>
    ) => {
      state.bulkActions.selectedLabelIds = action.payload;
    },
    onUpdateShouldRemovePrimarySquad: (
      state: AthleteManagementState,
      action: PayloadAction<boolean>
    ) => {
      state.bulkActions.shouldRemovePrimarySquad = action.payload;
    },
    onUpdateSearchQuery: (
      state: AthleteManagementState,
      action: PayloadAction<string>
    ) => {
      state.searchQuery = action.payload;
    },
    onUpdateOriginalStatus: (
      state: AthleteManagementState,
      action: PayloadAction<Array<number>>
    ) => {
      state.bulkActions.originalStatus = action.payload;
    },
    onUpdateSelectedStatus: (
      state: AthleteManagementState,
      action: PayloadAction<Array<string>>
    ) => {
      state.bulkActions.selectedStatus = action.payload;
    },
  },
});

export const {
  onSetStatuses,
  onReset,
  onToggleShowWellBeingModal,
  onToggleTrainingSessionReminderModal,
  onUpdateSelectedAthleteIds,
  onUpdateSelectedSquadIds,
  onUpdateShouldRemovePrimarySquad,
  onUpdateSearchQuery,
  onUpdateSelectedLabelIds,
  onUpdateOriginalSelectedLabelIds,
  onUpdateOriginalStatus,
  onUpdateSelectedStatus,
} = athleteManagementSlice.actions;

export default athleteManagementSlice;

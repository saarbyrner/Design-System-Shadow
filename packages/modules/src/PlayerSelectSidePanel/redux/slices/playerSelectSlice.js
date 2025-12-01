// @flow
import { createSlice } from '@reduxjs/toolkit';

export type PlayerSelectFilters = 'injured' | 'not_injured';
export type PlayerSelectGroups = 'position';
type SetFiltersAction = {
  payload: Array<PlayerSelectFilters>,
};
type SetGroupingAction = {
  payload: Array<PlayerSelectGroups>,
};

export type PlayerSelectSlice = {
  isPlayerSelectOpen: boolean,
  filters: Array<PlayerSelectFilters>,
  grouping: Array<PlayerSelectGroups>,
};

const initialState: PlayerSelectSlice = {
  isPlayerSelectOpen: false,
  filters: [],
  grouping: [],
};

const playerSelectSlice = createSlice({
  name: 'playerSelectSlice',
  initialState,
  reducers: {
    onOpenPlayerSelect: (state: PlayerSelectSlice) => {
      state.isPlayerSelectOpen = true;
    },
    onClosePlayerSelect: () => initialState,
    onUpdateFilters: (state: PlayerSelectSlice, action: SetFiltersAction) => {
      state.filters = action.payload;
    },
    onUpdateGrouping: (state: PlayerSelectSlice, action: SetGroupingAction) => {
      state.grouping = action.payload;
    },
  },
});

export const {
  onOpenPlayerSelect,
  onClosePlayerSelect,
  onUpdateFilters,
  onUpdateGrouping,
} = playerSelectSlice.actions;

export default playerSelectSlice;

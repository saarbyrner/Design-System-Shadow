// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Event } from '@kitman/common/src/types/Event';

export type AssignStaffState = {
  panel: {
    isOpen: boolean,
    game?: Event,
  },
};

export const initialState: AssignStaffState = {
  panel: {
    isOpen: false,
  },
};

type OnSetPanelState = {
  payload: {
    isOpen: boolean,
    game?: Event,
  },
};

export const REDUCER_KEY: string = 'LeagueFixtures.fixture.staff.slice.create';

const assigStaffSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: AssignStaffState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
      state.panel.game = action.payload.game;
    },
    onReset: () => initialState,
  },
});

export const { onTogglePanel, onReset } = assigStaffSlice.actions;
export default assigStaffSlice;

// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ExternalAccessState = {
  panel: {
    isOpen: boolean,
    gameId?: number
  },
};

export const initialState: ExternalAccessState = {
  panel: {
    isOpen: false
  },
};

type OnSetPanelState = {
  payload: {
    isOpen: boolean,
    gameId?: number
  },
};

export const REDUCER_KEY: string = 'LeagueFixtures.fixture.slice.create';

const externalAccessSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: ExternalAccessState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
      state.panel.gameId = action.payload.gameId
    },
    onReset: () => initialState,
  },
});

export const { onTogglePanel, onReset } = externalAccessSlice.actions;
export default externalAccessSlice;

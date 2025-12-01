// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type CreateFixtureState = {
  panel: {
    isOpen: boolean,
  },
};

export const initialState: CreateFixtureState = {
  panel: {
    isOpen: false,
  },
};

type OnSetPanelState = {
  payload: {
    isOpen: boolean,
  },
};

export const REDUCER_KEY: string = 'LeagueOperations.fixture.slice.create';

const createFixtureSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: CreateFixtureState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
    },
    onReset: () => initialState,
  },
});

export const { onTogglePanel, onReset } = createFixtureSlice.actions;
export default createFixtureSlice;

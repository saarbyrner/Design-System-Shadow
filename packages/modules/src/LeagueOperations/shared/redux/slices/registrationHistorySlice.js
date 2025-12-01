// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type RegistrationHistoryState = {
  panel: {
    isOpen: boolean,
  },
};

export const initialState: RegistrationHistoryState = {
  panel: {
    isOpen: false,
  },
};
type OnSetPanelState = {
  payload: {
    isOpen: boolean,
  },
};

export const REDUCER_KEY: string =
  'LeagueOperations.registration.slice.history';

const registrationHistorySlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: RegistrationHistoryState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
    },
  },
});

export const { onTogglePanel, onReset } = registrationHistorySlice.actions;
export default registrationHistorySlice;

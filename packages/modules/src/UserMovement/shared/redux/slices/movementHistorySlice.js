// @flow
import { createSlice } from '@reduxjs/toolkit';

export type ElementOpenState = {
  isOpen: boolean,
};

export type MovementHistoryState = {
  drawer: ElementOpenState,
};

export const initialState: MovementHistoryState = {
  drawer: {
    isOpen: false,
  },
};

export const REDUCER_KEY: string = 'UserMovement.slice.history';

const movementHistorySlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onReset: () => initialState,
    onToggleDrawer: (state: MovementHistoryState) => {
      state.drawer.isOpen = !state.drawer.isOpen;
    },
  },
});

export const { onReset, onToggleDrawer } = movementHistorySlice.actions;
export default movementHistorySlice;

// @flow
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  GamePeriodStorage,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';

/* ------------ eventPeriod ACTIONS ------------ */
export type setUnsavedEventPeriodsAction = {
  payload: Object[],
};

export type setSavedEventPeriodsAction = {
  payload: GamePeriod[],
};

const initialState: GamePeriodStorage = {
  localEventPeriods: [],
  apiEventPeriods: [],
};

const eventPeriodsSlice = createSlice({
  name: 'eventPeriods',
  initialState,
  reducers: {
    setUnsavedEventPeriods: (
      state: GamePeriodStorage,
      action: PayloadAction<setUnsavedEventPeriodsAction>
    ) => {
      state.localEventPeriods = action.payload;
    },
    setSavedEventPeriods: (
      state: GamePeriodStorage,
      action: PayloadAction<setSavedEventPeriodsAction>
    ) => {
      state.localEventPeriods = action.payload;
      state.apiEventPeriods = action.payload;
    },
  },
});

export const { setUnsavedEventPeriods, setSavedEventPeriods } =
  eventPeriodsSlice.actions;
export default eventPeriodsSlice;

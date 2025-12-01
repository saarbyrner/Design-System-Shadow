// @flow
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Event } from '@kitman/common/src/types/Event';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';

export type GameEventsState = {
  event: ?Event,
  matchDayView: string,
};

export type setEventDataAction = {
  payload: Event,
};
export type toggleMatchDayViewAction = {
  payload: string,
};

export const initialState = {
  event: {},
  matchDayView: mailingList.Dmn,
};
export const REDUCER_KEY: string = 'gameEvent';

const planningEventSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    setPlanningEventData: (
      state: GameEventsState,
      action: PayloadAction<setEventDataAction>
    ) => {
      state.event = action.payload.event;
    },
    toggleMatchDayView: (
      state: GameEventsState,
      action: PayloadAction<toggleMatchDayViewAction>
    ) => {
      state.matchDayView = action.payload;
    },
  },
});

export const { setPlanningEventData, toggleMatchDayView } =
  planningEventSlice.actions;
export default planningEventSlice;

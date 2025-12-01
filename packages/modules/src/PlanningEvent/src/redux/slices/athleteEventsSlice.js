// @flow
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  AthleteEventV2,
  AthleteEventStorage,
} from '@kitman/common/src/types/Event';

/* ------------ AthleteEvents ACTIONS ------------ */
export type SetAllAthleteEventsAction = {
  payload: Array<AthleteEventV2>,
};

export type UpdateAthleteEventAction = {
  payload: AthleteEventV2,
};

const initialState: AthleteEventStorage = { apiAthleteEvents: [] };

const athleteEventsSlice = createSlice({
  name: 'athleteEvents',
  initialState,
  reducers: {
    setApiAthleteEvents: (
      state: AthleteEventStorage,
      action: PayloadAction<SetAllAthleteEventsAction>
    ) => {
      state.apiAthleteEvents = action.payload;
    },
    updateAthleteEvent: (
      state: AthleteEventStorage,
      action: PayloadAction<UpdateAthleteEventAction>
    ) => {
      const foundAthleteEventIndex = state.apiAthleteEvents.findIndex(
        (athleteEvent) => athleteEvent.id === action.payload.id
      );
      state.apiAthleteEvents[foundAthleteEventIndex] = action.payload;
    },
  },
});

export const { setApiAthleteEvents, updateAthleteEvent } =
  athleteEventsSlice.actions;
export default athleteEventsSlice;

// @flow
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  AthletePlayTime,
  AthletePlayTimesStorage,
} from '@kitman/common/src/types/GameEvent';

/* ------------ athletePlayTimes ACTIONS ------------ */
export type SetUnsavedAthletePlayTimesAction = {
  payload: Array<AthletePlayTime>,
};

export type SetSavedAthletePlayTimesAction = {
  payload: Array<AthletePlayTime>,
};

const initialState: AthletePlayTimesStorage = {
  localAthletePlayTimes: [],
  apiAthletePlayTimes: [],
};

const athletePlayTimesSlice = createSlice({
  name: 'athletePlayTimes',
  initialState,
  reducers: {
    setUnsavedAthletePlayTimes: (
      state: AthletePlayTimesStorage,
      action: PayloadAction<SetUnsavedAthletePlayTimesAction>
    ) => {
      state.localAthletePlayTimes = action.payload;
    },
    setSavedAthletePlayTimes: (
      state: AthletePlayTimesStorage,
      action: PayloadAction<SetSavedAthletePlayTimesAction>
    ) => {
      state.localAthletePlayTimes = action.payload;
      state.apiAthletePlayTimes = action.payload;
    },
  },
});

export const { setUnsavedAthletePlayTimes, setSavedAthletePlayTimes } =
  athletePlayTimesSlice.actions;
export default athletePlayTimesSlice;

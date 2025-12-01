// @flow
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type {
  GameActivity,
  GameActivityStorage,
} from '@kitman/common/src/types/GameEvent';

/* ------------ gameActivities ACTIONS ------------ */
export type setUnsavedGameActivitiesAction = {
  payload: Array<GameActivity>,
};

export type setSavedGameActivitiesAction = {
  payload: Array<GameActivity>,
};

export type setLocalAndApiGameActivitiesAction = {
  payload: GameActivityStorage,
};

const initialState: GameActivityStorage = {
  localGameActivities: [],
  apiGameActivities: [],
};

const gameActivitiesSlice = createSlice({
  name: 'gameActivities',
  initialState,
  reducers: {
    setUnsavedGameActivities: (
      state: GameActivityStorage,
      action: PayloadAction<setUnsavedGameActivitiesAction>
    ) => {
      state.localGameActivities = action.payload;
    },
    setSavedGameActivities: (
      state: GameActivityStorage,
      action: PayloadAction<setSavedGameActivitiesAction>
    ) => {
      state.localGameActivities = action.payload;
      state.apiGameActivities = action.payload;
    },
    setLocalAndApiGameActivities: (
      state: GameActivityStorage,
      action: PayloadAction<setLocalAndApiGameActivitiesAction>
    ) => {
      state.localGameActivities = action.payload?.localGameActivities;
      state.apiGameActivities = action.payload?.apiGameActivities;
    },
  },
});

export const {
  setUnsavedGameActivities,
  setSavedGameActivities,
  setLocalAndApiGameActivities,
} = gameActivitiesSlice.actions;
export default gameActivitiesSlice;

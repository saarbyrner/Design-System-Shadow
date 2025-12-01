// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { SearchAthleteProfile } from '../../types';

export type MovementProfileState = {
  id: ?number,
  profile: ?SearchAthleteProfile,
};

export const initialState: MovementProfileState = {
  id: null,
  profile: null,
};
type OnSetProfile = {
  payload: {
    profile: SearchAthleteProfile,
  },
};

type OnSetId = {
  payload: {
    id: number,
  },
};

export const REDUCER_KEY: string = 'UserMovement.slice.profile';

const movementProfileSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetId: (state: MovementProfileState, action: PayloadAction<OnSetId>) => {
      state.id = action.payload.id;
    },
    onSetProfile: (
      state: MovementProfileState,
      action: PayloadAction<OnSetProfile>
    ) => {
      state.profile = action.payload.profile;
    },

    onReset: () => initialState,
  },
});

export const { onSetProfile, onSetId, onReset } = movementProfileSlice.actions;
export default movementProfileSlice;

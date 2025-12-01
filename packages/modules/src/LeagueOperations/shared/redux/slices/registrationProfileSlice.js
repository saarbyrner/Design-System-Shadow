// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RegistrationProfileState = {
  id: ?number,
  profile: ?User,
};

export const initialState: RegistrationProfileState = {
  id: null,
  profile: null,
};
type OnSetProfile = {
  payload: {
    profile: User,
  },
};

type OnSetId = {
  payload: {
    id: number,
  },
};

export const REDUCER_KEY: string =
  'LeagueOperations.registration.slice.profile';

const registrationProfileSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetId: (
      state: RegistrationProfileState,
      action: PayloadAction<OnSetId>
    ) => {
      state.id = action.payload.id;
    },
    onSetProfile: (
      state: RegistrationProfileState,
      action: PayloadAction<OnSetProfile>
    ) => {
      state.profile = action.payload.profile;
    },

    onReset: () => initialState,
  },
});

export const { onSetProfile, onSetId, onReset } =
  registrationProfileSlice.actions;
export default registrationProfileSlice;

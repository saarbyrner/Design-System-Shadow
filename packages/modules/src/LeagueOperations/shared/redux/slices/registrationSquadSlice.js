// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { Squad } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RegistrationSquadState = {
  id: ?number,
  squad: ?Squad,
};

export const initialState: RegistrationSquadState = {
  id: null,
  squad: null,
};
type OnSetSquad = {
  payload: {
    squad: Squad,
  },
};

type OnSetId = {
  payload: {
    id: number,
  },
};

export const REDUCER_KEY: string = 'LeagueOperations.registration.slice.squad';

const registrationSquadSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetId: (
      state: RegistrationSquadState,
      action: PayloadAction<OnSetId>
    ) => {
      state.id = action.payload.id;
    },
    onSetSquad: (
      state: RegistrationSquadState,
      action: PayloadAction<OnSetSquad>
    ) => {
      state.squad = action.payload.squad;
    },
    onReset: () => initialState,
  },
});

export const { onSetSquad, onSetId, onReset } = registrationSquadSlice.actions;
export default registrationSquadSlice;

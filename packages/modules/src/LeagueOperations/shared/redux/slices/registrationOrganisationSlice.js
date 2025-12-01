// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Organisation } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RegistrationOrganisationState = {
  id: ?number,
  organisation: ?Organisation,
};

export const initialState: RegistrationOrganisationState = {
  id: null,
  organisation: null,
};
type OnSetOrganisation = {
  payload: {
    organisation: Organisation,
  },
};

type OnSetId = {
  payload: {
    id: number,
  },
};

export const REDUCER_KEY: string =
  'LeagueOperations.registration.slice.organisation';

const registrationOrganisationSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetId: (
      state: RegistrationOrganisationState,
      action: PayloadAction<OnSetId>
    ) => {
      state.id = action.payload.id;
    },
    onSetOrganisation: (
      state: RegistrationOrganisationState,
      action: PayloadAction<OnSetOrganisation>
    ) => {
      state.organisation = action.payload.organisation;
    },

    onReset: () => initialState,
  },
});

export const { onSetOrganisation, onSetId, onReset } =
  registrationOrganisationSlice.actions;
export default registrationOrganisationSlice;

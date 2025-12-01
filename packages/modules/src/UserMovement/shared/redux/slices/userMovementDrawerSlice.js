// @flow

/**
 * @deprecated
 * This is only alive as is being actively tested by NFL in demo accounts for medical trial
 * It will be removed in the next few weeks
 */

import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AttachedTransformedFile } from '@kitman/common/src/utils/fileHelper';
import type { MovementType, SearchAthleteProfile } from '../../types';

export type MovementFormState = {
  user_id: ?string,
  transfer_type: ?MovementType,
  join_organisation_ids: Array<number>,
  leave_organisation_ids: Array<number>,
  joined_at: string,
  attachment_attributes?: AttachedTransformedFile,
};

export type MovementDrawer = {
  isOpen: boolean,
};

export type UserMovementDrawerState = {
  drawer: MovementDrawer,
  step: number,
  form: MovementFormState,
  profile: ?SearchAthleteProfile,
};

const getInitialState = (): UserMovementDrawerState => ({
  drawer: {
    isOpen: false,
  },
  step: 0,
  form: {
    user_id: null,
    transfer_type: null,
    join_organisation_ids: [],
    leave_organisation_ids: [],
    joined_at: moment().format(dateTransferFormat),
  },
  profile: null,
});

type OnSetDrawerStepAction = {
  payload: {
    step: number,
  },
};

type OnSetProfile = {
  payload: {
    profile: SearchAthleteProfile,
  },
};

type OnUpdateMovementFormAction = {
  payload: $Shape<MovementFormState>,
};

export const REDUCER_KEY: string = 'userMovementDrawerSlice';

const userMovementDrawerSlice = createSlice({
  name: REDUCER_KEY,
  initialState: getInitialState(),
  reducers: {
    onSetProfile: (
      state: UserMovementDrawerState,
      action: PayloadAction<OnSetProfile>
    ) => {
      state.profile = action.payload.profile;
    },
    onToggleDrawer: (state: UserMovementDrawerState) => {
      state.drawer.isOpen = !state.drawer.isOpen;
    },
    onUpdateMovementForm: (
      state: UserMovementDrawerState,
      action: PayloadAction<OnUpdateMovementFormAction>
    ) => {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },
    onUpdateTime: (state: UserMovementDrawerState) => {
      const now = moment();
      state.form.joined_at = now.format(dateTransferFormat);
    },
    onSetDrawerStep: (
      state: UserMovementDrawerState,
      action: PayloadAction<OnSetDrawerStepAction>
    ) => {
      state.step = action.payload.step;
    },
    onReset: () => getInitialState(),
  },
});

export const {
  onSetProfile,
  onReset,
  onToggleDrawer,
  onUpdateMovementForm,
  onSetDrawerStep,
  onUpdateTime,
} = userMovementDrawerSlice.actions;
export default userMovementDrawerSlice;

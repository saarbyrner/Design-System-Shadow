// @flow
import { createSelector } from '@reduxjs/toolkit';
import type { Store } from '@kitman/modules/src/UserMovement/shared/types/index';

import type {
  MovementFormState,
  MovementDrawer,
} from '../slices/userMovementDrawerSlice';

import { REDUCER_KEY } from '../slices/userMovementDrawerSlice';

import { MEDICAL_TRIAL, MEDICAL_TRIAL_V2 } from '../../constants';

export const getDrawerState = (state: Store): MovementDrawer =>
  state[REDUCER_KEY].drawer;

export const getFormState = (state: Store): MovementFormState =>
  state[REDUCER_KEY].form;

export const getStep = (state: Store): number => state[REDUCER_KEY].step;

export const getAthleteProfile = (state: Store): number =>
  state[REDUCER_KEY].profile;

// Intentionally watching for MEDICAL_TRIAL
// We only support MEDICAL_TRIAL for this feature
export const getIsNextDisabledFactory = (): boolean => {
  return createSelector([getFormState], (formState) => {
    return (
      (formState.transfer_type !== MEDICAL_TRIAL &&
        formState.transfer_type !== MEDICAL_TRIAL_V2) ||
      !formState.user_id ||
      !formState.transfer_type ||
      formState.join_organisation_ids.length === 0 ||
      formState.leave_organisation_ids.length === 0
    );
  });
};

// @flow
import type {
  Store,
  MovementOrganisation,
} from '@kitman/modules/src/UserMovement/shared/types/index';
import { createSelector } from '@reduxjs/toolkit';
import type { UserData } from '@kitman/services/src/services/fetchUserData';

import { userMovementApi } from '../services';

import type { MovementProfileState } from '../slices/movementProfileSlice';

import { REDUCER_KEY } from '../slices/movementProfileSlice';

export const getProfileResult = (params: {
  include_athlete: boolean,
  userId: number,
}) => userMovementApi.endpoints.fetchUserData.select(params);

export const getUserProfile = (params: {
  include_athlete: boolean,
  userId: number,
}): UserData =>
  createSelector([getProfileResult(params)], (profile) => profile.data);

export const getProfile = (state: Store): MovementProfileState =>
  state[REDUCER_KEY].profile;

export const getId = (state: Store): number => state[REDUCER_KEY].id;

export const getMovementFromOrganisationFactory = (
  id: number,
  params: {
    include_athlete: boolean,
    userId: number,
  }
): MovementOrganisation => {
  return createSelector([getUserProfile(params)], (profile) =>
    profile?.athlete?.organisations.find((org) => org.id === id)
  );
};

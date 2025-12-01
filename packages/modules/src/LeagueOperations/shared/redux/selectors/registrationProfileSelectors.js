// @flow
import type {
  User,
  Store,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { REDUCER_KEY } from '../slices/registrationProfileSlice';

export const getProfile = (state: Store): User => state[REDUCER_KEY].profile;

export const getId = (state: Store): number => state[REDUCER_KEY].id;

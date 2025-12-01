// @flow
import type {
  Store,
  Squad,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { REDUCER_KEY } from '../slices/registrationSquadSlice';

export const getSquad = (state: Store): Squad => state[REDUCER_KEY].squad;

export const getId = (state: Store): number => state[REDUCER_KEY].id;

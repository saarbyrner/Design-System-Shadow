// @flow
import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import { REDUCER_KEY } from '../slices/registrationOrganisationSlice';

export const getOrganisation = (state: Store): Organisation =>
  state[REDUCER_KEY].organisation;

export const getId = (state: Store): number => state[REDUCER_KEY].id;

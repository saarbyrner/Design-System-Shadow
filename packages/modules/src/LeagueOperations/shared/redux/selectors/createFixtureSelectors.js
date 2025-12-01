// @flow
import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { REDUCER_KEY } from '../slices/createFixtureSlice';
import { sharedGetIsPanelOpen } from './sharedSelectors';

export const getIsPanelOpen = (state: Store): boolean =>
  sharedGetIsPanelOpen(state, REDUCER_KEY);

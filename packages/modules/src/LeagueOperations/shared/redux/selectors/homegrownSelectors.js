// @flow

import type { Store } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/homegrownSlice';

export const getIsHomegrownPanelOpen = (state: Store): boolean =>
  state[REDUCER_KEY].homegrownPanel.isOpen;

export const getHomegrownSubmission = (state: Store): boolean =>
  state[REDUCER_KEY].homegrownSubmission;

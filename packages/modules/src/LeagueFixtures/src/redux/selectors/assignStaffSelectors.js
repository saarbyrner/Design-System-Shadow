// @flow
import type { Event } from '@kitman/common/src/types/Event';
import { REDUCER_KEY } from '../slices/AssignStaffSlice';
import type { AssignStaffState } from '../slices/AssignStaffSlice';

type AssignStaffReducerState = {
  [typeof REDUCER_KEY]: AssignStaffState,
};
export const getIsPanelOpen = (state: AssignStaffReducerState): boolean =>
  state[REDUCER_KEY].panel.isOpen;

export const getGame = (state: AssignStaffReducerState): ?Event => {
  return state[REDUCER_KEY].panel?.game;
};

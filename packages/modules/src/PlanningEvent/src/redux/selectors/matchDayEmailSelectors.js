// @flow
import type { Store } from '@kitman/modules/src/PlanningEvent/src/redux/types/store';
import { REDUCER_KEY, initialState } from '../slices/matchDayEmailSlice';
import type { MatchDayEmailPanelMode } from '../slices/matchDayEmailSlice';

export const getIsPanelOpen = (state: Store): boolean => {
  return state[REDUCER_KEY]?.panel?.isOpen || false;
};

export const getMatchDayEmailMode = (state: Store): MatchDayEmailPanelMode =>
  state[REDUCER_KEY]?.panel?.mode || initialState.panel.mode;

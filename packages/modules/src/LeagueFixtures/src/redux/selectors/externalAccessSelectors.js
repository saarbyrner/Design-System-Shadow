// @flow
import { REDUCER_KEY } from '../slices/ExternalAccessSlice';

//  TODO update Object later
export const getIsPanelOpen = (state: Object): boolean =>
  state[REDUCER_KEY].panel.isOpen;

export const getGameId = (state: Object): number =>
  state[REDUCER_KEY].panel?.gameId;


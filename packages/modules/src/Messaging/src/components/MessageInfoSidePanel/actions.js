// @flow
import type { Action } from './types';

export const openMessageInfoSidePanel = (messageIndex: number): Action => ({
  type: 'OPEN_MESSAGE_INFO_SIDE_PANEL',
  payload: {
    messageIndex,
  },
});

export const closeMessageInfoSidePanel = (): Action => ({
  type: 'CLOSE_MESSAGE_INFO_SIDE_PANEL',
});

// @flow
import type { Action } from './types';

export const openChannelCreationSidePanel = (): Action => ({
  type: 'OPEN_CHANNEL_CREATION_SIDE_PANEL',
});

export const closeChannelCreationSidePanel = (): Action => ({
  type: 'CLOSE_CHANNEL_CREATION_SIDE_PANEL',
});

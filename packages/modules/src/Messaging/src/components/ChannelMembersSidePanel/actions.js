// @flow
import type { Action } from './types';

export const openChannelMembersSidePanel = (): Action => ({
  type: 'OPEN_CHANNEL_MEMBERS_SIDE_PANEL',
});

export const closeChannelMembersSidePanel = (): Action => ({
  type: 'CLOSE_CHANNEL_MEMBERS_SIDE_PANEL',
});

export const channelMembersUpdateInProgress = (): Action => ({
  type: 'CHANNEL_MEMBERS_UPDATE_IN_PROGRESS',
});

export const channelMembersUpdateComplete = (): Action => ({
  type: 'CHANNEL_MEMBERS_UPDATE_COMPLETE',
});

export const channelMembersUpdateFailed = (): Action => ({
  type: 'CHANNEL_MEMBERS_UPDATE_FAILED',
});

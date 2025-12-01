// @flow

export type ChannelMembersUpdateStatus =
  | 'IDLE'
  | 'IN_PROGRESS'
  | 'COMPLETE'
  | 'FAILED';

type openChannelMembersSidePanel = {
  type: 'OPEN_CHANNEL_MEMBERS_SIDE_PANEL',
};

type closeChannelMembersSidePanel = {
  type: 'CLOSE_CHANNEL_MEMBERS_SIDE_PANEL',
};

type channelMembersUpdateInProgress = {
  type: 'CHANNEL_MEMBERS_UPDATE_IN_PROGRESS',
};

type channelMembersUpdateComplete = {
  type: 'CHANNEL_MEMBERS_UPDATE_COMPLETE',
};

type channelMembersUpdateFailed = {
  type: 'CHANNEL_MEMBERS_UPDATE_FAILED',
};

export type Action =
  | openChannelMembersSidePanel
  | closeChannelMembersSidePanel
  | channelMembersUpdateInProgress
  | channelMembersUpdateComplete
  | channelMembersUpdateFailed;

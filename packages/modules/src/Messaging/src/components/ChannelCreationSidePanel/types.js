// @flow

export type CreationStatus =
  | 'IDLE'
  | 'CHECKING_NAME'
  | 'CREATING'
  | 'FAILURE_NAME_IN_USE'
  | 'FAILURE_GENERAL_ERROR';

type openChannelCreationSidePanel = {
  type: 'OPEN_CHANNEL_CREATION_SIDE_PANEL',
};

type closeChannelCreationSidePanel = {
  type: 'CLOSE_CHANNEL_CREATION_SIDE_PANEL',
};

export type Action =
  | openChannelCreationSidePanel
  | closeChannelCreationSidePanel;

// @flow

type openChannelSettingsSidePanel = {
  type: 'OPEN_CHANNEL_SETTINGS_SIDE_PANEL',
};

type closeChannelSettingsSidePanel = {
  type: 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL',
};

type channelSettingsUpdatedIcon = {
  type: 'CHANNEL_SETTINGS_UPDATED_ICON',
  payload: {
    channelIconUrl: string,
  },
};

type channelSettingsUpdateInProgress = {
  type: 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS',
};

type channelSettingsUpdateComplete = {
  type: 'CHANNEL_SETTINGS_UPDATE_COMPLETE',
};

type channelSettingsUpdateFailed = {
  type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
  payload: {
    reason:
      | 'FAILURE_NAME_IN_USE'
      | 'OTHER_ERROR'
      | 'FAILURE_MUTE_NOTIFICATIONS',
  },
};

type channelSettingsUploadingIconStarted = {
  type: 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED',
  payload: {
    filename: string,
  },
};

type channelSettingsUploadingIconFailure = {
  type: 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE',
  payload: {
    filename: string,
  },
};

type channelSettingsUploadingIconSuccess = {
  type: 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS',
  payload: {
    filename: string,
  },
};

type channelSettingsClearToast = {
  type: 'CHANNEL_SETTINGS_CLEAR_TOAST',
  payload: {
    id: number | string,
  },
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

export type SettingsSidePanelStatus =
  | 'IDLE'
  | 'UPLOADING_IMAGE'
  | 'SAVING'
  | 'FAILURE_NAME_IN_USE';

export type Action =
  | openChannelSettingsSidePanel
  | closeChannelSettingsSidePanel
  | channelSettingsUpdatedIcon
  | channelSettingsUpdateInProgress
  | channelSettingsUpdateComplete
  | channelSettingsUpdateFailed
  | channelSettingsUploadingIconStarted
  | channelSettingsUploadingIconFailure
  | channelSettingsUploadingIconSuccess
  | channelSettingsClearToast
  | hideAppStatus;

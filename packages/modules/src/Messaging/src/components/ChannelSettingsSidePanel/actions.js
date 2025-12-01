// @flow
import type { Action } from './types';

export const openChannelSettingsSidePanel = (): Action => ({
  type: 'OPEN_CHANNEL_SETTINGS_SIDE_PANEL',
});

export const closeChannelSettingsSidePanel = (): Action => ({
  type: 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL',
});

export const channelSettingsUpdateInProgress = (): Action => ({
  type: 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS',
});

export const channelSettingsUpdateComplete = (): Action => ({
  type: 'CHANNEL_SETTINGS_UPDATE_COMPLETE',
});

export const channelSettingsUpdateFailed = (
  reason: 'FAILURE_NAME_IN_USE' | 'OTHER_ERROR' | 'FAILURE_MUTE_NOTIFICATIONS'
): Action => ({
  type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
  payload: {
    reason,
  },
});

export const channelSettingsUploadingIconStarted = (
  filename: string
): Action => ({
  type: 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED',
  payload: {
    filename,
  },
});

export const channelSettingsUploadingIconFailure = (
  filename: string
): Action => ({
  type: 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE',
  payload: {
    filename,
  },
});

export const channelSettingsUploadingIconSuccess = (
  filename: string
): Action => ({
  type: 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS',
  payload: {
    filename,
  },
});

export const channelSettingsClearToast = (id: string): Action => ({
  type: 'CHANNEL_SETTINGS_CLEAR_TOAST',
  payload: {
    id,
  },
});

export const channelSettingsUpdatedIcon = (channelIconUrl: string): Action => ({
  type: 'CHANNEL_SETTINGS_UPDATED_ICON',
  payload: {
    channelIconUrl,
  },
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

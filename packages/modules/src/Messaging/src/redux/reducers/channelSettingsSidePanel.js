// @flow
import type { Action as ChannelSettingsSidePanelActions } from '../../components/ChannelSettingsSidePanel/types';
import type { channelSettingsSidePanelState } from '../../types';

export default (
  state: channelSettingsSidePanelState = {},
  action: ChannelSettingsSidePanelActions
): channelSettingsSidePanelState => {
  switch (action.type) {
    case 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL': {
      return {
        ...state,
        channelIconUrl: null,
        status: 'IDLE',
      };
    }

    case 'CHANNEL_SETTINGS_UPDATED_ICON': {
      return {
        ...state,
        channelIconUrl: action.payload.channelIconUrl,
      };
    }

    case 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED': {
      return {
        ...state,
        status: 'UPLOADING_IMAGE',
      };
    }

    case 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS': {
      return {
        ...state,
        status: 'SAVING',
      };
    }

    case 'CHANNEL_SETTINGS_UPDATE_COMPLETE':
    case 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE':
    case 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS': {
      return {
        ...state,
        status: 'IDLE',
      };
    }

    case 'CHANNEL_SETTINGS_UPDATE_FAILED': {
      return {
        ...state,
        status:
          action.payload.reason === 'FAILURE_NAME_IN_USE'
            ? 'FAILURE_NAME_IN_USE'
            : 'SOMETHING',
      };
    }

    default:
      return state;
  }
};

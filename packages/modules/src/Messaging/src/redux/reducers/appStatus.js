// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Action as ChannelSettingsSidePanelActions } from '../../components/ChannelSettingsSidePanel/types';
import type { appStatusState } from '../../types';

export default (
  state: appStatusState = {},
  action: ChannelSettingsSidePanelActions
): appStatusState => {
  switch (action.type) {
    case 'HIDE_APP_STATUS':
    case 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL': {
      return {
        ...state,
        status: null,
        message: null,
      };
    }
    case 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS': {
      return {
        ...state,
        status: 'loading',
        message: null,
      };
    }
    case 'CHANNEL_SETTINGS_UPDATE_COMPLETE': {
      return {
        ...state,
        status: 'success',
        message: i18n.t('Channel updated'),
      };
    }
    case 'CHANNEL_SETTINGS_UPDATE_FAILED': {
      const getMessage = () => {
        switch (action.payload.reason) {
          case 'FAILURE_NAME_IN_USE':
            return i18n.t('Channel name in use');
          case 'FAILURE_MUTE_NOTIFICATIONS':
            return i18n.t('Failed to update notification settings');
          default:
            return i18n.t('Channel update failed');
        }
      };

      return {
        ...state,
        status: 'error',
        message: getMessage(),
      };
    }
    default:
      return state;
  }
};

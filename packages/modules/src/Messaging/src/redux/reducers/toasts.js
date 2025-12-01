// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Action as ChannelSettingsSidePanelActions } from '../../components/ChannelSettingsSidePanel/types';
import type { toastsState } from '../../types';

export default (
  state: toastsState = {},
  action: ChannelSettingsSidePanelActions
): toastsState => {
  switch (action.type) {
    case 'CHANNEL_SETTINGS_CLEAR_TOAST': {
      return {
        ...state,
        toastItems: state.toastItems.filter(
          (toast) => toast.id !== action.payload.id
        ),
      };
    }
    case 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED': {
      return {
        ...state,
        toastItems: [
          ...state.toastItems,
          {
            text: i18n.t('Preparing channel avatar'),
            status: 'PROGRESS',
            id: action.payload.filename,
          },
        ],
      };
    }

    case 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE': {
      const updatedToasts = state.toastItems.map((toast) =>
        toast.id === action.payload.filename
          ? {
              ...toast,
              text: i18n.t('Preparing channel avatar failed'),
              status: 'ERROR',
            }
          : toast
      );
      return {
        ...state,
        toastItems: updatedToasts,
      };
    }

    case 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS': {
      const updatedToasts = state.toastItems.map((toast) =>
        toast.id === action.payload.filename
          ? {
              ...toast,
              text: i18n.t('Channel avatar ready to save'),
              status: 'SUCCESS',
            }
          : toast
      );
      return {
        ...state,
        toastItems: updatedToasts,
      };
    }

    default:
      return state;
  }
};

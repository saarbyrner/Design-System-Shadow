// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Store, Action, ToastState, AppStatusState } from '../types';

export const manageUsers = (state: Store = {}, action: Action): Store => {
  switch (action.type) {
    case 'PROFILE_PHOTO_URL_UPDATED': {
      return {
        ...state,
        currentUser: { ...state.currentUser, avatar_url: action.payload.url },
      };
    }

    default:
      return state;
  }
};

export const manageUserProfileImage = (
  state: ToastState = {},
  action: Action
): ToastState => {
  switch (action.type) {
    case 'OPEN_IMAGE_UPLOAD_MODAL': {
      return {
        ...state,
        toasts: [],
        imageUploadModalOpen: true,
      };
    }

    case 'CLOSE_IMAGE_UPLOAD_MODAL': {
      return {
        ...state,
        imageUploadModalOpen: false,
      };
    }

    case 'PROFILE_PHOTO_UPLOAD_SUCCESS': {
      const updatedToasts = state.toasts.map((toast) =>
        toast.id === action.payload.filename
          ? {
              ...toast,
              text: i18n.t('Profile photo updated'),
              status: 'SUCCESS',
            }
          : toast
      );
      return {
        ...state,
        toasts: updatedToasts,
        status: 'IDLE',
      };
    }

    case 'PROFILE_PHOTO_UPLOAD_IN_PROGRESS': {
      const updatedToasts = [
        {
          text: i18n.t('Uploading photo'),
          status: 'PROGRESS',
          id: action.payload.filename,
        },
      ];
      return {
        ...state,
        toasts: updatedToasts,
        status: 'IN_PROGRESS',
      };
    }

    case 'PROFILE_PHOTO_UPLOAD_FAILURE': {
      const updatedToasts = state.toasts.map((toast) =>
        toast.id === action.payload.filename
          ? {
              ...toast,
              text: i18n.t('Uploading photo failed'),
              status: 'ERROR',
            }
          : toast
      );
      return {
        ...state,
        toasts: updatedToasts,
        status: 'IDLE',
      };
    }

    case 'REMOVE_PROFILE_PHOTO_UPLOAD_TOAST': {
      const updatedToasts = state.toasts.filter(
        (toast) => toast.id !== action.payload.toastId
      );
      return {
        ...state,
        toasts: updatedToasts,
      };
    }

    default:
      return state;
  }
};

export const appStatus = (state: AppStatusState = {}, action: Action) => {
  switch (action.type) {
    case 'SAVE_USER_FORM_FAILURE':
      return {
        status: 'error',
        message: null,
      };
    case 'SAVE_USER_FORM_STARTED_STATE': {
      return {
        status: 'loading',
        message: null,
      };
    }
    case 'SAVE_USER_FORM_SUCCESS_STATE': {
      return {
        status: 'success',
        message: null,
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        status: null,
        message: null,
      };
    }
    default:
      return state;
  }
};

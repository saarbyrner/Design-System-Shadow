// @flow
import type { ToastItem } from '@kitman/components/src/types';

export type User = {
  athlete_id: ?number,
  created: string,
  created_by: number,
  email: string,
  firstname: string,
  group_id: number,
  id: number,
  is_active: boolean,
  is_admin: boolean,
  kitman_super_admin: boolean,
  lastname: string,
  locale: string,
  mobile_number: {
    country: ?number,
    national_number: ?number,
  },
  mobile_number_verified: ?number,
  permission_group_id: number,
  squad_id: ?number,
  timezone: ?string,
  updated: string,
  user_role_id: ?number,
  username: string,
  avatar_url: ?string,
};

export type Store = {
  currentUser: User,
  currentPassword: string,
  newPassword: string,
  newPasswordAgain: string,
};

export type AppStatusState = {
  message: ?string,
  status: ?string,
};

export type PhotoUploadState = 'IDLE' | 'IN_PROGRESS';

export type ToastState = {
  toasts: Array<ToastItem>,
  status: PhotoUploadState,
  imageUploadModalOpen: boolean,
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type saveUserFormSuccess = {
  type: 'SAVE_USER_FORM_SUCCESS',
};

type saveUserFormFailure = {
  type: 'SAVE_USER_FORM_FAILURE',
};

type profilePhotoURLUpdated = {
  type: 'PROFILE_PHOTO_URL_UPDATED',
  payload: {
    url: string,
  },
};

type profilePhotoUploadSuccess = {
  type: 'PROFILE_PHOTO_UPLOAD_SUCCESS',
  payload: {
    filename: string,
  },
};

type profilePhotoUploadInProgress = {
  type: 'PROFILE_PHOTO_UPLOAD_IN_PROGRESS',
  payload: {
    filename: string,
  },
};

type profilePhotoUploadFailure = {
  type: 'PROFILE_PHOTO_UPLOAD_FAILURE',
  payload: {
    filename: string,
  },
};

type removeProfilePhotoToast = {
  type: 'REMOVE_PROFILE_PHOTO_UPLOAD_TOAST',
  payload: {
    toastId: number | string,
  },
};

type openImageUploadModal = {
  type: 'OPEN_IMAGE_UPLOAD_MODAL',
};

type closeImageUploadModal = {
  type: 'CLOSE_IMAGE_UPLOAD_MODAL',
};

type saveUserFormStartedState = {
  type: 'SAVE_USER_FORM_STARTED_STATE',
};

type saveUserFormSuccessState = {
  type: 'SAVE_USER_FORM_SUCCESS_STATE',
};

export type Action =
  | serverRequest
  | hideAppStatus
  | saveUserFormStartedState
  | saveUserFormSuccess
  | saveUserFormSuccessState
  | saveUserFormFailure
  | removeProfilePhotoToast
  | profilePhotoURLUpdated
  | profilePhotoUploadSuccess
  | profilePhotoUploadInProgress
  | profilePhotoUploadFailure
  | openImageUploadModal
  | closeImageUploadModal;

type Dispatch = (action: Action) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

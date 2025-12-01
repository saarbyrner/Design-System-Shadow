// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types';

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const saveUserFormStartedState = (): Action => ({
  type: 'SAVE_USER_FORM_STARTED_STATE',
});

export const saveUserFormFailure = (): Action => ({
  type: 'SAVE_USER_FORM_FAILURE',
});

export const saveUserFormSuccessState = (): Action => ({
  type: 'SAVE_USER_FORM_SUCCESS_STATE',
});

export const saveUserFormStarted =
  (): ThunkAction => (dispatch: (action: Action) => Action) => {
    dispatch(saveUserFormStartedState());
    dispatch(serverRequest());
  };

export const saveUserFormSuccess =
  (): ThunkAction => (dispatch: (action: Action) => Action) => {
    dispatch(saveUserFormSuccessState());
    setTimeout(() => {
      dispatch(hideAppStatus());
      window.location.reload();
    }, 1000);
  };

export const removeProfilePhotoToast = (toastId: number | string): Action => ({
  type: 'REMOVE_PROFILE_PHOTO_UPLOAD_TOAST',
  payload: {
    toastId,
  },
});

export const openImageUploadModal = (): Action => ({
  type: 'OPEN_IMAGE_UPLOAD_MODAL',
});

export const closeImageUploadModal = (): Action => ({
  type: 'CLOSE_IMAGE_UPLOAD_MODAL',
});

export const profilePhotoUploadSuccess = (filename: string): Action => ({
  type: 'PROFILE_PHOTO_UPLOAD_SUCCESS',
  payload: {
    filename,
  },
});

export const profilePhotoUploadInProgress = (filename: string): Action => ({
  type: 'PROFILE_PHOTO_UPLOAD_IN_PROGRESS',
  payload: {
    filename,
  },
});

export const profilePhotoUploadFailure = (filename: string): Action => ({
  type: 'PROFILE_PHOTO_UPLOAD_FAILURE',
  payload: {
    filename,
  },
});

export const profilePhotoURLUpdated = (url: string): Action => ({
  type: 'PROFILE_PHOTO_URL_UPDATED',
  payload: {
    url,
  },
});

export const submitImage =
  (file: File, url: string): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    return new Promise<void>((resolve: (value: any) => void) => {
      dispatch(profilePhotoUploadInProgress(file.name));

      const formData = new FormData();
      formData.append('user[avatar]', file);

      $.ajax({
        type: 'PATCH',
        enctype: 'multipart/form-data',
        url,
        headers: {
          'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
        },
        data: formData,
        contentType: false,
        processData: false,
        cache: false,
      })
        .done((response) => {
          if (response && response.success === true) {
            dispatch(profilePhotoURLUpdated(response.uri));
            dispatch(profilePhotoUploadSuccess(file.name));
          } else {
            dispatch(profilePhotoUploadFailure(file.name));
          }
          resolve();
        })
        .fail(() => {
          dispatch(profilePhotoUploadFailure(file.name));
        });
    });
  };

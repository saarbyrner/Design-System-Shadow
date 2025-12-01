import { manageUsers, manageUserProfileImage, appStatus } from '../reducer';

describe('Manage Users reducer', () => {
  const defaultState = {
    currentUser: { avatar_url: null },
    currentPassword: '',
    newPassword: '',
    newPasswordAgain: '',
  };

  it('returns correct state on PROFILE_PHOTO_URL_UPDATED', () => {
    const action = {
      type: 'PROFILE_PHOTO_URL_UPDATED',
      payload: { url: 'http://www.kitman.com/someImage.png' },
    };

    const nextState = manageUsers(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      currentUser: {
        ...defaultState.currentUser,
        avatar_url: 'http://www.kitman.com/someImage.png',
      },
    });
  });
});

describe('Manage User Profile reducer', () => {
  const defaultState = {
    status: 'IDLE',
    imageUploadModalOpen: false,
    toasts: [],
  };

  it('returns correct state on OPEN_IMAGE_UPLOAD_MODAL', () => {
    const action = {
      type: 'OPEN_IMAGE_UPLOAD_MODAL',
    };

    const nextState = manageUserProfileImage(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      imageUploadModalOpen: true,
    });
  });

  it('returns correct state on CLOSE_IMAGE_UPLOAD_MODAL', () => {
    const action = {
      type: 'CLOSE_IMAGE_UPLOAD_MODAL',
    };

    const openState = { ...defaultState, imageUploadModalOpen: true };
    const nextState = manageUserProfileImage(openState, action);
    expect(nextState).toEqual({
      ...defaultState,
      imageUploadModalOpen: false,
    });
  });

  it('returns correct state on PROFILE_PHOTO_UPLOAD_IN_PROGRESS', () => {
    const action = {
      type: 'PROFILE_PHOTO_UPLOAD_IN_PROGRESS',
      payload: { filename: 'someImage.png' },
    };

    const nextState = manageUserProfileImage(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      toasts: [
        {
          id: 'someImage.png',
          text: 'Uploading photo',
          status: 'PROGRESS',
        },
      ],
      status: 'IN_PROGRESS',
    });
  });

  it('returns correct state on PROFILE_PHOTO_UPLOAD_SUCCESS', () => {
    const action = {
      type: 'PROFILE_PHOTO_UPLOAD_SUCCESS',
      payload: { filename: 'someImage.png' },
    };

    const inprogressState = {
      ...defaultState,
      status: 'IN_PROGRESS',
      toasts: [
        {
          id: 'someImage.png',
          text: 'Uploading photo',
          status: 'PROGRESS',
        },
      ],
    };
    const nextState = manageUserProfileImage(inprogressState, action);
    expect(nextState).toEqual({
      ...defaultState,
      toasts: [
        {
          id: 'someImage.png',
          text: 'Profile photo updated',
          status: 'SUCCESS',
        },
      ],
      status: 'IDLE',
    });
  });

  it('returns correct state on PROFILE_PHOTO_UPLOAD_FAILURE', () => {
    const action = {
      type: 'PROFILE_PHOTO_UPLOAD_FAILURE',
      payload: { filename: 'someImage.png' },
    };

    const inprogressState = {
      ...defaultState,
      status: 'IN_PROGRESS',
      toasts: [
        {
          id: 'someImage.png',
          text: 'Uploading photo',
          status: 'PROGRESS',
        },
      ],
    };
    const nextState = manageUserProfileImage(inprogressState, action);
    expect(nextState).toEqual({
      ...defaultState,
      toasts: [
        {
          id: 'someImage.png',
          text: 'Uploading photo failed',
          status: 'ERROR',
        },
      ],
      status: 'IDLE',
    });
  });

  it('returns correct state on REMOVE_PROFILE_PHOTO_UPLOAD_TOAST', () => {
    const action = {
      type: 'REMOVE_PROFILE_PHOTO_UPLOAD_TOAST',
      payload: { toastId: 'someImage.png' },
    };

    const successState = {
      ...defaultState,
      status: 'IDLE',
      toasts: [
        {
          id: 'someImage.png',
          text: 'Profile photo updated',
          status: 'SUCCESS',
        },
      ],
    };
    const nextState = manageUserProfileImage(successState, action);
    expect(nextState).toEqual({
      ...defaultState,
      toasts: [],
      status: 'IDLE',
    });
  });
});

describe('AppStatus reducer', () => {
  const defaultState = {
    status: null,
    message: null,
  };

  it('returns correct state on SAVE_USER_FORM_FAILURE', () => {
    const action = {
      type: 'SAVE_USER_FORM_FAILURE',
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
    });
  });

  it('returns correct state on SAVE_USER_FORM_STARTED_STATE', () => {
    const action = {
      type: 'SAVE_USER_FORM_STARTED_STATE',
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns correct state on SAVE_USER_FORM_SUCCESS_STATE', () => {
    const action = {
      type: 'SAVE_USER_FORM_SUCCESS_STATE',
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'success',
      message: null,
    });
  });

  it('returns correct state on HIDE_APP_STATUS', () => {
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: null,
      message: null,
    });
  });
});

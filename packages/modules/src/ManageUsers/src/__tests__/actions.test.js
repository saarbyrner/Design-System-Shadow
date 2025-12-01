import $ from 'jquery';
import {
  saveUserFormStarted,
  saveUserFormSuccess,
  saveUserFormFailure,
  serverRequest,
  hideAppStatus,
  removeProfilePhotoToast,
  openImageUploadModal,
  closeImageUploadModal,
  profilePhotoUploadSuccess,
  profilePhotoUploadFailure,
  profilePhotoUploadInProgress,
  profilePhotoURLUpdated,
  saveUserFormStartedState,
  saveUserFormSuccessState,
  submitImage,
} from '../actions';

jest.mock('jquery', () => {
  const mock$ = jest.fn(() => ({
    attr: jest.fn(() => 'mock-csrf-token'),
  }));
  mock$.ajax = jest.fn();
  return mock$;
});

describe('Manage Users Actions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('has the correct action SAVE_USER_FORM_STARTED_STATE', () => {
    const expectedAction = {
      type: 'SAVE_USER_FORM_STARTED_STATE',
    };

    expect(saveUserFormStartedState()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_USER_FORM_SUCCESS_STATE', () => {
    const expectedAction = {
      type: 'SAVE_USER_FORM_SUCCESS_STATE',
    };

    expect(saveUserFormSuccessState()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_USER_FORM_STARTED', () => {
    const thunk = saveUserFormStarted();
    const dispatcher = jest.fn();
    thunk(dispatcher);
    const expectedAction = {
      type: 'SAVE_USER_FORM_STARTED_STATE',
    };

    expect(dispatcher).toHaveBeenCalledWith(expectedAction);
    expect(dispatcher).toHaveBeenCalledWith(serverRequest());
  });

  it('has the correct action SAVE_USER_FORM_SUCCESS', () => {
    const thunk = saveUserFormSuccess();
    const dispatcher = jest.fn();
    thunk(dispatcher);
    jest.advanceTimersByTime(1000);
    const expectedAction = {
      type: 'SAVE_USER_FORM_SUCCESS_STATE',
    };

    expect(dispatcher).toHaveBeenCalledWith(expectedAction);
    expect(dispatcher).toHaveBeenCalledWith(hideAppStatus());
  });

  it('has the correct action SAVE_USER_FORM_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_USER_FORM_FAILURE',
    };

    expect(saveUserFormFailure()).toEqual(expectedAction);
  });

  it('has the correct action REMOVE_PROFILE_PHOTO_UPLOAD_TOAST', () => {
    const expectedAction = {
      type: 'REMOVE_PROFILE_PHOTO_UPLOAD_TOAST',
      payload: {
        toastId: 'toastID',
      },
    };

    expect(removeProfilePhotoToast('toastID')).toEqual(expectedAction);
  });

  it('has the correct action OPEN_IMAGE_UPLOAD_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_IMAGE_UPLOAD_MODAL',
    };

    expect(openImageUploadModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_IMAGE_UPLOAD_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_IMAGE_UPLOAD_MODAL',
    };

    expect(closeImageUploadModal()).toEqual(expectedAction);
  });

  it('has the correct action PROFILE_PHOTO_UPLOAD_SUCCESS', () => {
    const expectedAction = {
      type: 'PROFILE_PHOTO_UPLOAD_SUCCESS',
      payload: {
        filename: 'somefile.jpg',
      },
    };

    expect(profilePhotoUploadSuccess('somefile.jpg')).toEqual(expectedAction);
  });

  it('has the correct action PROFILE_PHOTO_UPLOAD_IN_PROGRESS', () => {
    const expectedAction = {
      type: 'PROFILE_PHOTO_UPLOAD_IN_PROGRESS',
      payload: {
        filename: 'somefile.jpg',
      },
    };

    expect(profilePhotoUploadInProgress('somefile.jpg')).toEqual(
      expectedAction
    );
  });

  it('has the correct action PROFILE_PHOTO_UPLOAD_FAILURE', () => {
    const expectedAction = {
      type: 'PROFILE_PHOTO_UPLOAD_FAILURE',
      payload: {
        filename: 'somefile.jpg',
      },
    };

    expect(profilePhotoUploadFailure('somefile.jpg')).toEqual(expectedAction);
  });

  it('has the correct action PROFILE_PHOTO_URL_UPDATED', () => {
    const expectedAction = {
      type: 'PROFILE_PHOTO_URL_UPDATED',
      payload: {
        url: 'http://www.someimage.com/test.jpg',
      },
    };

    expect(profilePhotoURLUpdated('http://www.someimage.com/test.jpg')).toEqual(
      expectedAction
    );
  });

  describe('submitImage thunk', () => {
    beforeEach(() => {
      $.ajax.mockClear();
    });

    it('dispatches correct actions on successful image upload', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockUrl = 'http://example.com/upload';
      const mockFilename = 'uploaded-file.jpg';
      const mockUri = 'http://example.com/uploaded.jpg';

      $.ajax.mockImplementation(() => ({
        done: (callback) => {
          callback({ success: true, filename: mockFilename, uri: mockUri });
          return { fail: () => {} };
        },
        fail: () => {},
      }));

      const dispatcher = jest.fn();
      const thunk = submitImage(mockFile, mockUrl);
      thunk(dispatcher);

      expect(dispatcher).toHaveBeenCalledWith(
        profilePhotoUploadInProgress(mockFile.name)
      );
      expect(dispatcher).toHaveBeenCalledWith(profilePhotoURLUpdated(mockUri));
      expect(dispatcher).toHaveBeenCalledWith(
        profilePhotoUploadSuccess(mockFile.name)
      );
    });

    it('dispatches correct actions on failed image upload', () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockUrl = 'http://example.com/upload';

      $.ajax.mockImplementation(() => ({
        done: () => ({
          fail: (callback) => {
            callback();
          },
        }),
        fail: (callback) => {
          callback();
        },
      }));

      const dispatcher = jest.fn();
      const thunk = submitImage(mockFile, mockUrl);
      thunk(dispatcher);

      expect(dispatcher).toHaveBeenCalledWith(
        profilePhotoUploadInProgress(mockFile.name)
      );
      expect(dispatcher).toHaveBeenCalledWith(
        profilePhotoUploadFailure(mockFile.name)
      );
    });
  });
});

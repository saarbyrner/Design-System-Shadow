import {
  openChannelSettingsSidePanel,
  closeChannelSettingsSidePanel,
  channelSettingsUpdateInProgress,
  channelSettingsUpdateComplete,
  channelSettingsUpdateFailed,
  channelSettingsUpdatedIcon,
  channelSettingsUploadingIconStarted,
  channelSettingsUploadingIconFailure,
  channelSettingsUploadingIconSuccess,
  channelSettingsClearToast,
  hideAppStatus,
} from '../actions';

describe('Channel Settings Side Panel Actions', () => {
  it('has the correct action OPEN_CHANNEL_SETTINGS_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_CHANNEL_SETTINGS_SIDE_PANEL',
    };
    expect(openChannelSettingsSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_CHANNEL_SETTINGS_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL',
    };
    expect(closeChannelSettingsSidePanel()).toEqual(expectedAction);
  });

  it('has the correct action channelSettingsUpdateInProgress', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS',
    };
    expect(channelSettingsUpdateInProgress()).toEqual(expectedAction);
  });

  it('has the correct action channelSettingsUpdateComplete', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPDATE_COMPLETE',
    };
    expect(channelSettingsUpdateComplete()).toEqual(expectedAction);
  });

  it('has the correct action channelSettingsUpdateFailed', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
      payload: {
        reason: 'FAILURE_NAME_IN_USE',
      },
    };
    expect(channelSettingsUpdateFailed('FAILURE_NAME_IN_USE')).toEqual(
      expectedAction
    );
  });

  it('has the correct action channelSettingsUpdateFailed with notification error', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
      payload: {
        reason: 'FAILURE_MUTE_NOTIFICATIONS',
      },
    };
    expect(channelSettingsUpdateFailed('FAILURE_MUTE_NOTIFICATIONS')).toEqual(
      expectedAction
    );
  });

  it('has the correct action channelSettingsUpdatedIcon', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPDATED_ICON',
      payload: {
        channelIconUrl: 'url',
      },
    };
    expect(channelSettingsUpdatedIcon('url')).toEqual(expectedAction);
  });

  it('has the correct action hideAppStatus', () => {
    const expectedAction = {
      type: 'HIDE_APP_STATUS',
    };
    expect(hideAppStatus()).toEqual(expectedAction);
  });

  it('has the correct action channelSettingsUploadingIconStarted', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED',
      payload: {
        filename: 'some file',
      },
    };
    expect(channelSettingsUploadingIconStarted('some file')).toEqual(
      expectedAction
    );
  });

  it('has the correct action channelSettingsUploadingIconFailure', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE',
      payload: {
        filename: 'some file',
      },
    };
    expect(channelSettingsUploadingIconFailure('some file')).toEqual(
      expectedAction
    );
  });

  it('has the correct action channelSettingsUploadingIconSuccess', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS',
      payload: {
        filename: 'some file',
      },
    };
    expect(channelSettingsUploadingIconSuccess('some file')).toEqual(
      expectedAction
    );
  });

  it('has the correct action channelSettingsClearToast', () => {
    const expectedAction = {
      type: 'CHANNEL_SETTINGS_CLEAR_TOAST',
      payload: {
        id: 'some id',
      },
    };
    expect(channelSettingsClearToast('some id')).toEqual(expectedAction);
  });
});

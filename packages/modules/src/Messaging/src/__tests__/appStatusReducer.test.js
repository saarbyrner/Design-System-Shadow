import appStatus from '../redux/reducers/appStatus';

describe('Chat App Status Reducer', () => {
  const defaultState = {
    message: null,
    status: null,
  };

  it('returns correct state on HIDE_APP_STATUS', () => {
    const action = {
      type: 'HIDE_APP_STATUS',
    };

    const nextState = appStatus(
      {
        message: 'some error we want to clear',
        status: 'error',
      },
      action
    );
    expect(nextState).toEqual({
      ...defaultState,
    });
  });

  it('returns correct state on CLOSE_CHANNEL_SETTINGS_SIDE_PANEL', () => {
    const action = {
      type: 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL',
    };

    const nextState = appStatus(
      {
        message: 'some error we want to clear',
        status: 'error',
      },
      action
    );
    expect(nextState).toEqual({
      ...defaultState,
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATE_IN_PROGRESS', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATE_IN_PROGRESS',
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'loading',
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATE_COMPLETE', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATE_COMPLETE',
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'success',
      message: 'Channel updated',
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATE_FAILED with name in use', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
      payload: {
        reason: 'FAILURE_NAME_IN_USE',
      },
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
      message: 'Channel name in use',
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATE_FAILED with other error', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
      payload: {
        reason: 'OTHER_ERROR',
      },
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
      message: 'Channel update failed',
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATE_FAILED with notification error', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
      payload: {
        reason: 'FAILURE_MUTE_NOTIFICATIONS',
      },
    };

    const nextState = appStatus(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'error',
      message: 'Failed to update notification settings',
    });
  });
});

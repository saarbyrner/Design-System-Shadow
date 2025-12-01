import toasts from '../redux/reducers/toasts';

describe('Chat Toasts Reducer', () => {
  const defaultState = {
    toastItems: [],
  };

  const inProgressState = {
    toastItems: [
      {
        text: 'Preparing channel avatar',
        status: 'PROGRESS',
        id: 'file1',
      },
    ],
  };

  it('returns correct state on CHANNEL_SETTINGS_UPLOADING_ICON_STARTED', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPLOADING_ICON_STARTED',
      payload: {
        filename: 'file1',
      },
    };

    const nextState = toasts(defaultState, action);
    expect(nextState).toEqual({
      ...inProgressState,
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPLOADING_ICON_FAILURE',
      payload: {
        filename: 'file1',
      },
    };

    const nextState = toasts(inProgressState, action);
    expect(nextState).toEqual({
      toastItems: [
        {
          text: 'Preparing channel avatar failed',
          status: 'ERROR',
          id: 'file1',
        },
      ],
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPLOADING_ICON_SUCCESS',
      payload: {
        filename: 'file1',
      },
    };

    const nextState = toasts(inProgressState, action);
    expect(nextState).toEqual({
      toastItems: [
        {
          text: 'Channel avatar ready to save',
          status: 'SUCCESS',
          id: 'file1',
        },
      ],
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_CLEAR_TOAST', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_CLEAR_TOAST',
      payload: {
        id: 'file1',
      },
    };

    const nextState = toasts(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
    });
  });
});

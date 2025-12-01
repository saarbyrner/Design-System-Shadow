import channelSettingsSidePanel from '../redux/reducers/channelSettingsSidePanel';

describe('Chat Channel Settings SidePanel Reducer', () => {
  const defaultState = {
    channelIconUrl: 'someURL',
    status: 'IDLE',
  };

  it('returns correct state on CLOSE_CHANNEL_SETTINGS_SIDE_PANEL', () => {
    const action = {
      type: 'CLOSE_CHANNEL_SETTINGS_SIDE_PANEL',
    };

    const nextState = channelSettingsSidePanel(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      channelIconUrl: null,
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATED_ICON', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATED_ICON',
      payload: { channelIconUrl: 'updatedUrl' },
    };

    const nextState = channelSettingsSidePanel(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      channelIconUrl: 'updatedUrl',
    });
  });

  it('returns correct state on CHANNEL_SETTINGS_UPDATE_FAILED', () => {
    const action = {
      type: 'CHANNEL_SETTINGS_UPDATE_FAILED',
      payload: { reason: 'FAILURE_NAME_IN_USE' },
    };

    const nextState = channelSettingsSidePanel(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      status: 'FAILURE_NAME_IN_USE',
    });
  });
});

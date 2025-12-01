import {
  openChannelMembersSidePanel,
  closeChannelMembersSidePanel,
  channelMembersUpdateInProgress,
  channelMembersUpdateComplete,
  channelMembersUpdateFailed,
} from '../actions';

describe('Channel Members Side Panel Actions', () => {
  it('should create an action to open the side panel', () => {
    const expectedAction = { type: 'OPEN_CHANNEL_MEMBERS_SIDE_PANEL' };
    expect(openChannelMembersSidePanel()).toEqual(expectedAction);
  });

  it('should create an action to close the side panel', () => {
    const expectedAction = { type: 'CLOSE_CHANNEL_MEMBERS_SIDE_PANEL' };
    expect(closeChannelMembersSidePanel()).toEqual(expectedAction);
  });

  it('should create an action for when member updates are in progress', () => {
    const expectedAction = { type: 'CHANNEL_MEMBERS_UPDATE_IN_PROGRESS' };
    expect(channelMembersUpdateInProgress()).toEqual(expectedAction);
  });

  it('should create an action for when member updates are complete', () => {
    const expectedAction = { type: 'CHANNEL_MEMBERS_UPDATE_COMPLETE' };
    expect(channelMembersUpdateComplete()).toEqual(expectedAction);
  });

  it('should create an action for when member updates have failed', () => {
    const expectedAction = { type: 'CHANNEL_MEMBERS_UPDATE_FAILED' };
    expect(channelMembersUpdateFailed()).toEqual(expectedAction);
  });
});

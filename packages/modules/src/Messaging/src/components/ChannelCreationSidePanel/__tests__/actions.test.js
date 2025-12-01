import {
  openChannelCreationSidePanel,
  closeChannelCreationSidePanel,
} from '../actions';

describe('Channel Creation Side Panel Actions', () => {
  it('should create an action to open the channel creation side panel', () => {
    const expectedAction = {
      type: 'OPEN_CHANNEL_CREATION_SIDE_PANEL',
    };
    expect(openChannelCreationSidePanel()).toEqual(expectedAction);
  });

  it('should create an action to close the channel creation side panel', () => {
    const expectedAction = {
      type: 'CLOSE_CHANNEL_CREATION_SIDE_PANEL',
    };
    expect(closeChannelCreationSidePanel()).toEqual(expectedAction);
  });
});

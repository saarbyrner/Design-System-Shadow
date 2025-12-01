import {
  openMessageInfoSidePanel,
  closeMessageInfoSidePanel,
} from '../actions';

describe('Message Info Side Panel Actions', () => {
  it('has the correct action OPEN_MESSAGE_INFO_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_MESSAGE_INFO_SIDE_PANEL',
      payload: {
        messageIndex: 1,
      },
    };
    expect(openMessageInfoSidePanel(1)).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_MESSAGE_INFO_SIDE_PANEL', () => {
    const expectedAction = {
      type: 'CLOSE_MESSAGE_INFO_SIDE_PANEL',
    };
    expect(closeMessageInfoSidePanel()).toEqual(expectedAction);
  });
});

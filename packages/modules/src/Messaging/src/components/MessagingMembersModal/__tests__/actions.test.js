import {
  openMessagingMembersModal,
  closeMessagingMembersModal,
} from '../actions';

describe('Messaging Members Modal Actions', () => {
  it('has the correct action CLOSE_MESSAGING_MEMBERS_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_MESSAGING_MEMBERS_MODAL',
    };

    expect(closeMessagingMembersModal()).toEqual(expectedAction);
  });

  it('has the correct action OPEN_MESSAGING_MEMBERS_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_MESSAGING_MEMBERS_MODAL',
    };

    expect(openMessagingMembersModal()).toEqual(expectedAction);
  });
});

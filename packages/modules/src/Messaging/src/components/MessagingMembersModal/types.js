// @flow

type openMessagingMembersModal = {
  type: 'OPEN_MESSAGING_MEMBERS_MODAL',
};

type closeMessagingMembersModal = {
  type: 'CLOSE_MESSAGING_MEMBERS_MODAL',
};

export type Action = openMessagingMembersModal | closeMessagingMembersModal;

type Dispatch = (action: Action) => any;
export type ThunkAction = (dispatch: Dispatch) => any;

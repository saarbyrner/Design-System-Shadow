// @flow
import type { Action } from './types';

export const openMessagingMembersModal = (): Action => ({
  type: 'OPEN_MESSAGING_MEMBERS_MODAL',
});

export const closeMessagingMembersModal = (): Action => ({
  type: 'CLOSE_MESSAGING_MEMBERS_MODAL',
});

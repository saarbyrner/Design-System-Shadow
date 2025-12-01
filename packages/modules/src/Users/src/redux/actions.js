// @flow
import type { Action, User, AssignVisibilityModal } from '../types';

export const setSearchText = (text: string): Action => ({
  type: 'SET_SEARCH',
  payload: text,
});

export const setActiveUsers = (users: Array<User>): Action => ({
  type: 'SET_ACTIVE_USERS',
  payload: users,
});

export const setInactiveUsers = (users: Array<User>): Action => ({
  type: 'SET_INACTIVE_USERS',
  payload: users,
});

export const setAssignVisibilityModal = (
  modal: AssignVisibilityModal
): Action => ({
  type: 'SET_ASSIGN_VISIBILITY_MODAL',
  payload: modal,
});

// @flow
import type { State, User, Users, AssignVisibilityModal } from '../types';
import { extractFullName } from '../utils';

type UserSelector = (State) => Users;

const filterUserFactory = (text: string) => {
  return (user: User) => {
    return (
      extractFullName(user).toUpperCase().indexOf(text.toUpperCase()) > -1 ||
      user.username.toUpperCase().indexOf(text.toUpperCase()) > -1
    );
  };
};

export const getSearchText: (State) => string = (state: State) =>
  state.userReducer.searchText;

export const getUsers: UserSelector = (state: State) =>
  state.userReducer.users.filter(filterUserFactory(getSearchText(state)));

export const getInactiveUsers: UserSelector = (state: State) => {
  return state.userReducer.inactiveUsers.filter(
    filterUserFactory(getSearchText(state))
  );
};

export const getAllActiveUsers: UserSelector = (state: State) =>
  state.userReducer.users;

export const getInactiveUsersWithVisibilityIssues: UserSelector = (
  state: State
) => {
  return state.userReducer.inactiveUsers.filter(
    (user) =>
      user.orphaned_annotation_ids && user.orphaned_annotation_ids.length
  );
};

export const getAssignVisibilityModal: (State) => AssignVisibilityModal = (
  state: State
) => state.userReducer.assignVisibilityModal;

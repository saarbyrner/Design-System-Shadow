// @flow

export type User = {
  id: number,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  created: string,
  role: string,
  updated: string,
  current: boolean,
  avatar: ?string,
  orphaned_annotation_ids: Array<number>,
  access_locked: boolean,
  // TODO define other fields
};

export type Users = Array<User>;

export type AssignVisibilityModal = {
  open: boolean,
  user: ?User,
};

export type State = {
  userReducer: {
    searchText: string,
    users: Users,
    inactiveUsers: Users,
    assignVisibilityModal: AssignVisibilityModal,
  },
};

type setSearch = {
  type: 'SET_SEARCH',
  payload: string,
};

type setActiveUsers = {
  type: 'SET_ACTIVE_USERS',
  payload: Array<User>,
};

type setInactiveUsers = {
  type: 'SET_INACTIVE_USERS',
  payload: Array<User>,
};

type setAssignVisibilityModal = {
  type: 'SET_ASSIGN_VISIBILITY_MODAL',
  payload: AssignVisibilityModal,
};

export type Action =
  | setSearch
  | setActiveUsers
  | setInactiveUsers
  | setAssignVisibilityModal;

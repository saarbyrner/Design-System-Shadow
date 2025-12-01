// @flow
import type { State, Action } from '../types';

const userReducer = (state: State = {}, action: Action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...state,
        searchText: action.payload,
      };
    case 'SET_ACTIVE_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'SET_INACTIVE_USERS':
      return {
        ...state,
        inactiveUsers: action.payload,
      };
    case 'SET_ASSIGN_VISIBILITY_MODAL':
      return {
        ...state,
        assignVisibilityModal: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;

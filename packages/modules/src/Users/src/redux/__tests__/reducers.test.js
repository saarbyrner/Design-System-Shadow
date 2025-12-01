import usersReducer from '../reducers';

describe('users bundle reducers', () => {
  const defaultState = {
    searchText: '',
    users: [],
    inactiveUsers: [],
  };

  const mockUser = {
    id: 1,
    username: 'johndoe1',
    current: false,
    created: '2023-01-01',
    updated: '2023-01-02',
    avatar: 'user1.jpg',
    firstname: 'John',
    lastname: 'Doe',
    email: 'johndoe@gmail.com',
    role: 'Account Admin',
    orphaned_annotation_ids: [1, 2],
  };

  it('returns correct state on SET_SEARCH', () => {
    const action = {
      type: 'SET_SEARCH',
      payload: 'abc123',
    };

    const nextState = usersReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      searchText: 'abc123',
    });
  });

  it('returns correct state on SET_ACTIVE_USERS', () => {
    const action = {
      type: 'SET_ACTIVE_USERS',
      payload: [mockUser],
    };

    const nextState = usersReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      users: [mockUser],
    });
  });

  it('returns correct state on SET_INACTIVE_USERS', () => {
    const action = {
      type: 'SET_INACTIVE_USERS',
      payload: [mockUser],
    };

    const nextState = usersReducer(defaultState, action);
    expect(nextState).toEqual({
      ...defaultState,
      inactiveUsers: [mockUser],
    });
  });
});

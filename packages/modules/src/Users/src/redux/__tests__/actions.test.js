import { setSearchText, setActiveUsers, setInactiveUsers } from '../actions';

describe('users bundle actions', () => {
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

  it('has the correct action SET_SEARCH', () => {
    const expectedAction = {
      type: 'SET_SEARCH',
      payload: 'abc123',
    };

    expect(setSearchText('abc123')).toEqual(expectedAction);
  });

  it('has the correct action SET_ACTIVE_USERS', () => {
    const expectedAction = {
      type: 'SET_ACTIVE_USERS',
      payload: [mockUser],
    };

    expect(setActiveUsers([mockUser])).toEqual(expectedAction);
  });

  it('has the correct action SET_INACTIVE_USERS', () => {
    const expectedAction = {
      type: 'SET_INACTIVE_USERS',
      payload: [mockUser],
    };

    expect(setInactiveUsers([mockUser])).toEqual(expectedAction);
  });
});

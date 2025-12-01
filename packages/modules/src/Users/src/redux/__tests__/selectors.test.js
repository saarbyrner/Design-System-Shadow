import {
  getSearchText,
  getUsers,
  getInactiveUsers,
  getAllActiveUsers,
  getInactiveUsersWithVisibilityIssues,
} from '../selectors';

describe('users bundle selectors', () => {
  const mockUsers = [
    {
      id: 1,
      firstname: 'Denny',
      lastname: 'Claughton',
      username: 'dclaughton0',
    },
    {
      id: 2,
      firstname: 'Bridgette',
      lastname: 'Kield',
      username: 'bkield1',
    },
    {
      id: 3,
      firstname: 'Amargo',
      lastname: 'Solon',
      username: 'asolon2',
    },
    {
      id: 4,
      firstname: 'Johny',
      lastname: 'Hurne',
      username: 'jhurne3',
    },
    {
      id: 5,
      firstname: 'Cesare',
      lastname: 'Burde',
      username: 'cburde4',
    },
  ];

  const userWithVisibilityIssues = {
    id: 6,
    firstname: 'Denny',
    lastname: 'Claughton',
    username: 'dclaughton0',
    orphaned_annotation_ids: [1, 2],
  };

  const defaultState = {
    userReducer: {
      searchText: '',
      users: [],
      inactiveUsers: [],
    },
  };

  describe('getSearchText selector', () => {
    it('can return the correct searchText', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          searchText: 'abc123',
        },
      };

      expect(getSearchText(state)).toEqual('abc123');
    });
  });

  describe('getUsers selector', () => {
    it('returns the users list', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          users: [...mockUsers],
        },
      };

      expect(getUsers(state)).toEqual(mockUsers);
    });

    it('returns the users filtering search text by name', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          users: [...mockUsers],
          searchText: 'Johny Hurne',
        },
      };

      expect(getUsers(state)).toEqual([
        {
          id: 4,
          firstname: 'Johny',
          lastname: 'Hurne',
          username: 'jhurne3',
        },
      ]);
    });

    it('returns the users filtering search text by username', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          users: [...mockUsers],
          searchText: 'asolon2',
        },
      };

      expect(getUsers(state)).toEqual([
        {
          id: 3,
          firstname: 'Amargo',
          lastname: 'Solon',
          username: 'asolon2',
        },
      ]);
    });
  });

  describe('getInactiveUsers selector', () => {
    it('returns the inactive users list', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          inactiveUsers: [...mockUsers],
        },
      };

      expect(getInactiveUsers(state)).toEqual(mockUsers);
    });

    it('returns the users filtering search text by name', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          inactiveUsers: [...mockUsers],
          searchText: 'Johny Hurne',
        },
      };

      expect(getInactiveUsers(state)).toEqual([
        {
          id: 4,
          firstname: 'Johny',
          lastname: 'Hurne',
          username: 'jhurne3',
        },
      ]);
    });

    it('returns the users filtering search text by username', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          inactiveUsers: [...mockUsers],
          searchText: 'asolon2',
        },
      };

      expect(getInactiveUsers(state)).toEqual([
        {
          id: 3,
          firstname: 'Amargo',
          lastname: 'Solon',
          username: 'asolon2',
        },
      ]);
    });
  });

  describe('getAllActiveUsers selector', () => {
    it('returns the all users list', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          users: [...mockUsers],
        },
      };

      expect(getAllActiveUsers(state)).toEqual(mockUsers);
    });

    it('returns all users despite filtering search text by name', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          users: [...mockUsers],
          searchText: 'Johny Hurne',
        },
      };

      expect(getAllActiveUsers(state)).toEqual(mockUsers);
    });

    it('returns all users despite filtering search text by username', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          users: [...mockUsers],
          searchText: 'asolon2',
        },
      };

      expect(getAllActiveUsers(state)).toEqual(mockUsers);
    });
  });

  describe('getUsersWithVisibilityIssues selector', () => {
    it('returns the inactive users list', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          inactiveUsers: [...mockUsers, userWithVisibilityIssues],
        },
      };

      expect(getInactiveUsersWithVisibilityIssues(state)).toEqual([
        userWithVisibilityIssues,
      ]);
    });

    it('returns users with visibility issues despite filtering search text by name', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          inactiveUsers: [...mockUsers, userWithVisibilityIssues],
          searchText: 'Johny Hurne',
        },
      };

      expect(getInactiveUsersWithVisibilityIssues(state)).toEqual([
        userWithVisibilityIssues,
      ]);
    });

    it('returns users with visibility issues despite filtering search text by username', () => {
      const state = {
        userReducer: {
          ...defaultState.userReducer,
          inactiveUsers: [...mockUsers, userWithVisibilityIssues],
          searchText: 'asolon2',
        },
      };

      expect(getInactiveUsersWithVisibilityIssues(state)).toEqual([
        userWithVisibilityIssues,
      ]);
    });
  });
});

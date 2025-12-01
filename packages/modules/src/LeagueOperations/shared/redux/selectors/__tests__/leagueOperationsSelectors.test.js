import {
  MOCK_CURRENT_USER,
  MOCK_PERMISSIONS,
  USER_TYPE_ASSERTIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';

import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
  getCurrentUser,
} from '../leagueOperationsSelectors';

const MOCK_STATE = {
  globalApi: {
    queries: {
      'getPermissions(undefined)': {
        data: {
          ...MOCK_PERMISSIONS,
        },
      },
      'getCurrentUser(undefined)': {
        data: {
          ...MOCK_CURRENT_USER,
        },
      },
    },
  },
};

describe('[leagueOperationsApi & globalApi] - selectors', () => {
  test('getRegistrationPermissions()', () => {
    const selector = getRegistrationPermissions();
    expect(selector(MOCK_STATE)).toStrictEqual(MOCK_PERMISSIONS.registration);
  });

  test('getCurrentUser()', () => {
    const selector = getCurrentUser();
    expect(selector(MOCK_STATE)).toStrictEqual(MOCK_CURRENT_USER);
  });

  test.each(USER_TYPE_ASSERTIONS)(
    'getRegistrationUserTypeFactory() for $userType',
    (userType) => {
      const localState = {
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                ...MOCK_PERMISSIONS,
              },
            },
            'getCurrentUser(undefined)': {
              data: {
                ...MOCK_CURRENT_USER,
                registration: {
                  ...MOCK_CURRENT_USER.registration,
                  user_type: userType,
                },
              },
            },
          },
        },
      };

      const selector = getRegistrationUserTypeFactory();
      expect(selector(localState)).toStrictEqual(userType);
    }
  );
});

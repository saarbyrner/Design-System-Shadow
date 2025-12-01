import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';

import { getCurrentUser } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import {
  MOCK_CURRENT_USER,
  MOCK_GLOBAL_API,
} from '../../../__tests__/test_utils';
import useProfileId from '../useProfileId';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getCurrentUser: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.profile': {},
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

const mockSelectors = () => {
  getCurrentUser.mockReturnValue(() => MOCK_CURRENT_USER);
};

describe('useProfileId', () => {
  describe('initial state', () => {
    beforeEach(() => {
      mockSelectors();
      MOCK_GLOBAL_API();
    });
    it('has initial state', () => {
      const result = renderHook(() => useProfileId(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });
  describe('when viewing your own profile', () => {
    const useDispatchMock = jest.fn();

    beforeEach(() => {
      mockSelectors();
      defaultStore.dispatch = useDispatchMock;
      useGetCurrentUserQuery.mockReturnValue({
        data: {
          ...MOCK_CURRENT_USER,
          registration: { user_type: null },
        },
      });
    });

    it('uses the current user id to fetch data', () => {
      const expectedAthleteId = MOCK_CURRENT_USER.id;
      renderHook(() => useProfileId(), {
        wrapper,
      });
      expect(useDispatchMock).toHaveBeenCalledWith({
        payload: {
          id: expectedAthleteId,
        },
        type: 'LeagueOperations.registration.slice.profile/onSetId',
      });
    });
  });

  describe('when viewing a user profile', () => {
    const useDispatchMock = jest.fn();

    beforeEach(() => {
      defaultStore.dispatch = useDispatchMock;

      delete window.location;
      window.location = new URL(
        'http://localhost/registration/profile?id=162786'
      );
    });

    it('uses the url params id to fetch data', () => {
      const expectedAthleteId = '162786';
      renderHook(() => useProfileId(), {
        wrapper,
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(2, {
        payload: {
          id: expectedAthleteId,
        },
        type: 'LeagueOperations.registration.slice.profile/onSetId',
      });
    });
  });
});

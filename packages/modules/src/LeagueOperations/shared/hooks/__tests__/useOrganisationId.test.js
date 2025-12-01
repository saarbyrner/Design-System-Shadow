import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';

import { getCurrentOrganisation } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import {
  MOCK_REGISTRATION_ORGANISATION,
  MOCK_GLOBAL_API,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import useOrganisationId from '../useOrganisationId';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getCurrentOrganisation: jest.fn(),
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
  'LeagueOperations.registration.api.organisation': {},
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

const mockSelectors = () => {
  getCurrentOrganisation.mockReturnValue(() => MOCK_REGISTRATION_ORGANISATION);
};

describe('useOrganisationId', () => {
  describe('initial state', () => {
    beforeEach(() => {
      mockSelectors();
      MOCK_GLOBAL_API();
    });
    it('has initial state', () => {
      const result = renderHook(() => useOrganisationId(), {
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
      useGetOrganisationQuery.mockReturnValue({
        data: {
          ...MOCK_REGISTRATION_ORGANISATION,
          registration: { user_type: null },
        },
      });
      useGetPermissionsQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
    });

    it('uses the current organisation id to fetch data', () => {
      const expectedOrganisationId = MOCK_REGISTRATION_ORGANISATION.id;
      renderHook(() => useOrganisationId(), {
        wrapper,
      });
      expect(useDispatchMock).toHaveBeenNthCalledWith(2, {
        payload: {
          id: expectedOrganisationId,
        },
        type: 'LeagueOperations.registration.slice.organisation/onSetId',
      });
    });
  });

  describe('when viewing a user profile', () => {
    const useDispatchMock = jest.fn();

    beforeEach(() => {
      defaultStore.dispatch = useDispatchMock;

      delete window.location;
      window.location = new URL(
        'http://localhost/registration/organisation?id=115'
      );
    });

    it('uses the url params id to fetch data', () => {
      const expectedOrganisationId = '115';
      renderHook(() => useOrganisationId(), {
        wrapper,
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(2, {
        payload: {
          id: expectedOrganisationId,
        },
        type: 'LeagueOperations.registration.slice.organisation/onSetId',
      });
    });
  });
});

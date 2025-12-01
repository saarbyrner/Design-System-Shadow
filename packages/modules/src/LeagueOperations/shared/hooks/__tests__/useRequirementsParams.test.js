import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  globalApi,
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetActiveSquadQuery,
  useGetPreferencesQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { getCurrentUserResult } from '@kitman/common/src/redux/global/selectors';
import { getCurrentUser } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';
import { useFetchRegistrationRequirementsProfileFormQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import useRequirementsParams from '../useRequirementsParams';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getCurrentUserResult: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getCurrentUser: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi'
    ),
    useFetchRegistrationProfileQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi'
    ),
    useFetchRegistrationRequirementsProfileFormQuery: jest.fn(),
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
  'LeagueOperations.registration.api.form': {
    useFetchRegistrationRequirementsProfileFormQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.profile': {
    useFetchRegistrationProfileQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

const mockRTKState = () => {
  useFetchRegistrationProfileQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  useGetActiveSquadQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  useGetOrganisationQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  useGetPermissionsQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  useGetPreferencesQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  useGetCurrentUserQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: {},
  });
  globalApi.endpoints.getCurrentUser.select = () => jest.fn();
  getCurrentUser.mockReturnValue(() => ({ id: 123 }));
  getCurrentUserResult.mockReturnValue({ id: 123 });
};

describe('useRequirementsParams', () => {
  describe('initial state', () => {
    beforeEach(() => {
      mockRTKState();
    });
    it('has initial state', () => {
      const result = renderHook(() => useRequirementsParams(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });
  describe('loading state', () => {
    beforeEach(() => {
      mockRTKState();
      useFetchRegistrationProfileQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: {},
      });
    });
    it('has initial state', () => {
      const result = renderHook(() => useRequirementsParams(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });
  describe('failure state', () => {
    beforeEach(() => {
      mockRTKState();
      useFetchRegistrationProfileQuery.mockReturnValue({
        isLoading: false,
        isError: true,
        isSuccess: false,
        data: {},
      });
    });
    it('has initial state', () => {
      const result = renderHook(() => useRequirementsParams(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(true);
    });
  });

  describe("when viewing a user's requirement", () => {
    const useDispatchMock = jest.fn();

    beforeEach(() => {
      useFetchRegistrationProfileQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: {},
      });
      defaultStore.dispatch = useDispatchMock;

      delete window.location;
      window.location = new URL(
        'http://localhost/registration/requirements?id=123&requirement_id=123'
      );
    });

    it('correctly sets the requirement params', () => {
      renderHook(() => useRequirementsParams(), {
        wrapper,
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
        payload: {
          userId: 123,
          requirementId: '123',
        },
        type: 'LeagueOperations.registration.slice.requirements/onSetRequirementParams',
      });
    });
  });
});

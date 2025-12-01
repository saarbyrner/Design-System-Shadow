import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import { useFetchRegistrationRequirementsProfileFormQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { getCurrentUser } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { MOCK_CURRENT_USER } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import useRegistrationProfileForm from '../useRegistrationProfileForm';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi',
  () => ({
    useFetchRegistrationRequirementsProfileFormQuery: jest.fn(),
  })
);

jest.mock('@kitman/common/src/redux/global/services/globalApi');

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    getCurrentUser: jest.fn(),
  })
);

const storeFake = (state) => ({
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetCurrentUserQuery: jest.fn(),
  },
  'LeagueOperations.registration.api.form': {},
  formStateSlice: {},
});

const wrapper = ({ children }) => (
  <Provider store={defaultStore}>{children}</Provider>
);

const mockSelectors = () => {
  getCurrentUser.mockImplementation(() => () => MOCK_CURRENT_USER);
};

describe('useRegistrationProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSelectors();
  });
  describe('initial state', () => {
    it('has initial state', () => {
      useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: {},
      });
      const result = renderHook(() => useRegistrationProfileForm(), {
        wrapper,
      }).result;
      expect(result.current.isLoading).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });
  });

  describe('query states', () => {
    it('should return loading state when query is loading', () => {
      useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: null,
      });

      const { result } = renderHook(() => useRegistrationProfileForm(), {
        wrapper,
      });

      expect(result.current).toEqual({
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
    });

    it('should return success state when query succeeds', () => {
      const mockFormStructure = {
        form_template_version: { form_elements: [] },
        form_answers: [],
      };

      useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: mockFormStructure,
      });

      const { result } = renderHook(() => useRegistrationProfileForm(), {
        wrapper,
      });

      expect(result.current).toEqual({
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
    });

    it('should return error state when query fails', () => {
      useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
        isLoading: false,
        isError: true,
        isSuccess: false,
        data: null,
      });

      const { result } = renderHook(() => useRegistrationProfileForm(), {
        wrapper,
      });

      expect(result.current).toEqual({
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
    });

    it('should skip query when user_id and requirement_id are missing', () => {
      getCurrentUser.mockReturnValue(() => () => {});
      useFetchRegistrationRequirementsProfileFormQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isSuccess: false,
        data: null,
      });

      const { result } = renderHook(() => useRegistrationProfileForm(), {
        wrapper,
      });

      expect(result.current).toEqual({
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
    });
  });
});

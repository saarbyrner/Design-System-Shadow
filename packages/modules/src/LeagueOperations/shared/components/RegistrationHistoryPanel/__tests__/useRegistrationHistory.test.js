import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared//types/common';

import { MOCK_REGISTRATION_PROFILE } from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { useLeagueOperations } from '@kitman/common/src/hooks';

import * as registrationRequirementsSelectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { useFetchRegistrationHistoryQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import {
  REDUCER_KEY as HISTORY_REDUCER_KEY,
  onTogglePanel,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationHistorySlice';

import useRegistrationHistory from '../hooks/useRegistrationHistory';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationHistorySelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationHistoryApi'
    ),
    useFetchRegistrationHistoryQuery: jest.fn(),
  })
);
jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
    ),
    getRegistrationUserTypeFactory: jest.fn(),
  })
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = {
  [HISTORY_REDUCER_KEY]: {},
};

const defaultStore = storeFake(mockStore);

describe('useRegistrationHistory', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
    window.featureFlags['league-ops-registration-v2-view-history'] = false;
    useLeagueOperations.mockReturnValue({
      isLeague: false,
    });
    getRegistrationUserTypeFactory.mockReturnValue(() => 'athlete');
    registrationRequirementsSelectors.getRegistrationProfile.mockReturnValue(
      MOCK_REGISTRATION_PROFILE
    );
    registrationRequirementsSelectors.getUserId.mockReturnValue(
      MOCK_REGISTRATION_PROFILE.id
    );
    registrationRequirementsSelectors.getRegistrationProfileStatus.mockReturnValue(
      () => RegistrationStatusEnum.INCOMPLETE
    );
    registrationRequirementsSelectors.getRequirementById.mockReturnValue(
      () => MOCK_REGISTRATION_PROFILE.registrations[0]
    );
    useFetchRegistrationHistoryQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      isSuccess: true,
    });
  });

  it('should return the correct initial values', () => {
    const { result } = renderHook(() => useRegistrationHistory(), {
      wrapper: ({ children }) => {
        return <Provider store={defaultStore}>{children}</Provider>;
      },
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isVisible).toBe(false);
    expect(result.current.isDisabled).toBe(true);
    expect(result.current.history).toStrictEqual([]);
    expect(typeof result.current.onOpenPanel).toBe('function');
  });

  describe('onOpenPanel', () => {
    it('should dispatch onOpenPanel correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });

      result.current.onOpenPanel(true);

      expect(mockDispatch).toHaveBeenCalledWith(
        onTogglePanel({ isOpen: true })
      );
    });
  });

  describe('isDisabled', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-registration-v2-view-history'] = true;
    });

    it('should be disabled when false', () => {
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isDisabled).toBe(true);
    });
    it('should be disabled when true', () => {
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isDisabled).toBe(true);
    });
  });

  describe('isVisible', () => {
    it('isVisible should be false if FFs are false', () => {
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isVisible).toBe(false);
    });

    it('should be isVisible when ff is true', () => {
      window.featureFlags['league-ops-registration-v2-view-history'] = true;
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isVisible).toBe(true);
    });

    it('isVisible should be true when ff/isLeague is true', () => {
      window.featureFlags['league-ops-update-registration-status'] = true;
      useLeagueOperations.mockReturnValue({
        isLeague: true,
      });

      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isVisible).toBe(true);
    });

    it('isVisible should be true when ff is true and currentUserType is org admin', () => {
      window.featureFlags['league-ops-update-registration-status'] = true;
      useLeagueOperations.mockReturnValue({
        isLeague: false,
      });
      getRegistrationUserTypeFactory.mockReturnValue(
        () => 'organisation_admin'
      );
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isVisible).toBe(true);
    });
  });

  describe('isLoading', () => {
    it('should be true when query isLoading', () => {
      useFetchRegistrationHistoryQuery.mockReturnValue({
        data: [],
        isLoading: true,
        isError: false,
        isSuccess: true,
      });
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('isError', () => {
    it('should be true when query isError', () => {
      useFetchRegistrationHistoryQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: true,
        isSuccess: true,
      });
      const { result } = renderHook(() => useRegistrationHistory(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isError).toBe(true);
    });
  });
});

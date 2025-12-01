import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

import {
  MOCK_REGISTRATION_PROFILE,
  MOCK_PERMISSIONS,
} from '@kitman/modules/src/LeagueOperations/__tests__/test_utils';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared//types/common';

import * as registrationRequirementsSelectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import * as registrationApprovalSelectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationApprovalSelectors';
import * as leagueOperationsSelectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { useFetchRequirementSectionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import { useUpdateRegistrationStatusMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { canApproveForm } from '@kitman/modules/src/LeagueOperations/shared/utils/operations';

import {
  REDUCER_KEY as APPROVAL_REDUCER_KEY,
  onTogglePanel,
  onSetApprovalStatus,
  onSetApprovalAnnotation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationApprovalSlice';

import { REDUCER_KEY as REQUIREMENT_REDUCER_KEY } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import useFormToasts from '@kitman/modules/src/LeagueOperations/shared/hooks/useFormToasts';

import useApproveRegistration from '../hooks/useApproveRegistration';
import {
  ASSOCIATION_ADMIN,
  ORGANISATION_ADMIN,
  ATHLETE,
  STAFF,
} from '../../../consts';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi'
    ),
    useFetchRequirementSectionsQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi'
    ),
    useUpdateRegistrationStatusMutation: jest.fn(),
  })
);

jest.mock('@kitman/modules/src/LeagueOperations/shared/utils/operations');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationApprovalSelectors'
);
jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useFormToasts');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = {
  [APPROVAL_REDUCER_KEY]: {},
  [REQUIREMENT_REDUCER_KEY]: {},
};

const defaultStore = storeFake(mockStore);

describe('useApproveRegistration', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
    leagueOperationsSelectors.getRegistrationPermissions.mockReturnValue(
      () => MOCK_PERMISSIONS.registration
    );
    leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
      () => 'athlete'
    );

    registrationRequirementsSelectors.getRequirementById.mockReturnValue(
      () => MOCK_REGISTRATION_PROFILE.registrations[0]
    );
    registrationRequirementsSelectors.getRegistrationProfile.mockReturnValue(
      MOCK_REGISTRATION_PROFILE
    );
    registrationRequirementsSelectors.getRegistrationSystemStatusForCurrentRequirement.mockReturnValue(
      () =>
        MOCK_REGISTRATION_PROFILE.registrations[0].registration_system_status
    );

    registrationRequirementsSelectors.getUserId.mockReturnValue(
      MOCK_REGISTRATION_PROFILE.id
    );
    registrationRequirementsSelectors.getRegistrationProfileStatus.mockReturnValue(
      () => RegistrationStatusEnum.INCOMPLETE
    );

    registrationApprovalSelectors.getRegistrationFormStatus.mockReturnValue(
      () => [
        {
          id: 1,
          type: 'pending_organisation',
          name: 'Pending Organisation',
        },
      ]
    );

    registrationApprovalSelectors.getSelectedApprovalStatus.mockReturnValue(
      null
    );
    registrationApprovalSelectors.getSelectedApprovalAnnotation.mockReturnValue(
      ''
    );
    registrationApprovalSelectors.getIsSubmitDisabledFactory.mockReturnValue(
      () => true
    );
    useFetchRequirementSectionsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    useFormToasts.mockReturnValue({
      onUpdateRegistrationFailureToast: jest.fn(),
      onUpdateRegistrationPendingToast: jest.fn(),
      onUpdateRegistrationSuccessToast: jest.fn(),
      onClearUpdateRegistrationToasts: jest.fn(),
    });
    useUpdateRegistrationStatusMutation.mockReturnValue([
      jest.fn(),
      {
        isLoading: false,
        isError: false,
        isSuccess: true,
      },
    ]);
    canApproveForm.mockReturnValue(false);
  });

  it('should return the correct initial values', () => {
    const { result } = renderHook(() => useApproveRegistration(), {
      wrapper: ({ children }) => {
        return <Provider store={defaultStore}>{children}</Provider>;
      },
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isApproveVisible).toBe(false);
    expect(result.current.isApproveDisabled).toBe(true);
    expect(result.current.isSubmitStatusDisabled).toBe(true);
    expect(result.current.approvalOptions).toStrictEqual([]);
    expect(typeof result.current.onOpenPanel).toBe('function');
    expect(typeof result.current.onApproveRegistration).toBe('function');
    expect(typeof result.current.onApplyStatus).toBe('function');
    expect(typeof result.current.onAddAnnotation).toBe('function');
  });

  describe('onOpenPanel', () => {
    it('should dispatch onOpenPanel correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useApproveRegistration(), {
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

  describe('onApplyStatus', () => {
    it('should dispatch onApplyStatus correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useApproveRegistration(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      result.current.onApplyStatus({ status: 'incomplete' });
      expect(mockDispatch).toHaveBeenCalledWith(
        onSetApprovalStatus({ status: 'incomplete' })
      );
    });
  });

  describe('onAddAnnotation', () => {
    it('should dispatch onAddAnnotation correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useApproveRegistration(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      result.current.onAddAnnotation({ annotation: 'well bai' });
      expect(mockDispatch).toHaveBeenCalledWith(
        onSetApprovalAnnotation({ annotation: 'well bai' })
      );
    });
  });

  describe('isApproveVisible', () => {
    describe('ATHLETE', () => {
      it('should not be visible', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ATHLETE
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(false);
      });
    });
    describe('STAFF', () => {
      it('should not be visible', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => STAFF
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(false);
      });
    });
    describe('ASSOCIATION_ADMIN', () => {
      it('should always be visible', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ASSOCIATION_ADMIN
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(true);
      });
    });
    describe('ORGANISATION_ADMIN', () => {
      beforeEach(() => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ORGANISATION_ADMIN
        );
      });
      it('should always be visible', () => {
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(true);
      });
      it('should return true for isApproveVisible when feature flag is enabled and user cannot create forms', () => {
        window.featureFlags['league-ops-update-registration-status'] = true;
        leagueOperationsSelectors.getRegistrationPermissions.mockReturnValue(
          () => ({
            athlete: { canCreate: false },
            staff: { canCreate: false },
          })
        );

        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(true);
      });
    });
  });

  describe('isApproveDisabled', () => {
    describe('ATHLETE', () => {
      it('should not be visible and should be disabled', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ATHLETE
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(false);
        expect(result.current.isApproveDisabled).toBe(true);
      });
    });
    describe('STAFF', () => {
      it('should not be visible and should be disabled', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => STAFF
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveVisible).toBe(false);
        expect(result.current.isApproveDisabled).toBe(true);
      });
    });
    describe('ASSOCIATION_ADMIN', () => {
      const assertions = [
        {
          status: {
            id: 1,
            type: RegistrationStatusEnum.INCOMPLETE,
            name: 'Incomplete',
          },
          expected: false,
        },
        {
          status: {
            id: 2,
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
          },
          expected: false,
        },
        {
          status: {
            id: 3,
            type: RegistrationStatusEnum.PENDING_ASSOCIATION,
            name: 'Pending Association',
          },
          expected: false,
        },
        {
          status: {
            id: 4,
            type: RegistrationStatusEnum.REJECTED_ORGANISATION,
            name: 'Rejected Organisation',
          },
          expected: false,
        },
        {
          status: {
            id: 5,
            type: RegistrationStatusEnum.REJECTED_ASSOCIATION,
            name: 'Rejected Association',
          },
          expected: false,
        },
        {
          status: {
            id: 6,
            type: RegistrationStatusEnum.PENDING_PAYMENT,
            name: 'Pending Payment',
          },
          expected: false,
        },
        {
          status: {
            id: 7,
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
          },
          expected: true,
        },
      ];
      test.each(assertions)(
        'returns the correct state for $status.type',
        ({ status, expected }) => {
          canApproveForm.mockReturnValue(false);
          registrationRequirementsSelectors.getRegistrationSystemStatusForCurrentRequirement.mockReturnValue(
            () => status
          );
          leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
            () => ASSOCIATION_ADMIN
          );
          const { result } = renderHook(() => useApproveRegistration(), {
            wrapper: ({ children }) => {
              return <Provider store={defaultStore}>{children}</Provider>;
            },
          });
          expect(result.current.isApproveDisabled).toBe(expected);
        }
      );
    });
    describe('ORGANISATION_ADMIN', () => {
      it('should be disabled when the overall status is not PENDING_ORGANISATION', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ORGANISATION_ADMIN
        );
        registrationRequirementsSelectors.getRegistrationSystemStatusForCurrentRequirement.mockReturnValue(
          () => ({
            id: 1,
            type: RegistrationStatusEnum.PENDING_ORGANISATION,
            name: 'Pending Organisation',
          })
        );
        useFetchRequirementSectionsQuery.mockReturnValue({
          data: [],
          isLoading: false,
          isError: false,
        });
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveDisabled).toBe(true);
      });
      it('should be disabled when the overall status is already APPROVED', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ORGANISATION_ADMIN
        );
        registrationRequirementsSelectors.getRegistrationSystemStatusForCurrentRequirement.mockReturnValue(
          () => ({
            id: 1,
            type: RegistrationStatusEnum.APPROVED,
            name: 'Approved',
          })
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveDisabled).toBe(true);
      });

      it('should be disabled when the overall status is UNAPPROVED', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ORGANISATION_ADMIN
        );
        registrationRequirementsSelectors.getRegistrationSystemStatusForCurrentRequirement.mockReturnValue(
          () => ({
            id: 1,
            type: RegistrationStatusEnum.UNAPPROVED,
            name: 'Unapproved',
          })
        );
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveDisabled).toBe(true);
      });

      it('should be disabled when any status is not pending_organisation or approved', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ORGANISATION_ADMIN
        );
        useFetchRequirementSectionsQuery.mockReturnValue({
          data: [
            {
              status: RegistrationStatusEnum.PENDING_PAYMENT,
              registration_system_status: {
                id: 1,
                type: RegistrationStatusEnum.PENDING_PAYMENT,
                name: 'Pending Payment',
              },
            },
            {
              status: RegistrationStatusEnum.PENDING_ORGANISATION,
              registration_system_status: {
                id: 2,
                type: RegistrationStatusEnum.PENDING_ORGANISATION,
                name: 'Pending Organisation',
              },
            },
          ],
          isLoading: false,
          isError: false,
        });
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveDisabled).toBe(true);
      });
      it('should be enabled when all statuses are pending_association or approved', () => {
        leagueOperationsSelectors.getRegistrationUserTypeFactory.mockReturnValue(
          () => ORGANISATION_ADMIN
        );
        useFetchRequirementSectionsQuery.mockReturnValue({
          data: [
            {
              status: RegistrationStatusEnum.PENDING_ASSOCIATION,
              registration_system_status: {
                id: 1,
                type: RegistrationStatusEnum.PENDING_ASSOCIATION,
                name: 'Pending Association',
              },
            },
            {
              status: RegistrationStatusEnum.APPROVED,
              registration_system_status: {
                id: 2,
                type: RegistrationStatusEnum.APPROVED,
                name: 'Approved',
              },
            },
          ],
          isLoading: false,
          isError: false,
        });
        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => {
            return <Provider store={defaultStore}>{children}</Provider>;
          },
        });
        expect(result.current.isApproveDisabled).toBe(true);
      });
    });
  });

  describe('isSubmitStatusDisabled', () => {
    it('should return the correct value when true', () => {
      registrationApprovalSelectors.getIsSubmitDisabledFactory.mockReturnValue(
        () => true
      );
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useApproveRegistration(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSubmitStatusDisabled).toBe(true);
    });
    it('should return the correct value when false', () => {
      registrationApprovalSelectors.getIsSubmitDisabledFactory.mockReturnValue(
        () => false
      );
      const { result } = renderHook(() => useApproveRegistration(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSubmitStatusDisabled).toBe(false);
    });
  });

  describe('onApproveRegistration', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('successful update flow', () => {
      it('should update the status successfully', async () => {
        const mockOnUpdateRegistrationStatus = jest.fn();
        useUpdateRegistrationStatusMutation.mockReturnValue([
          mockOnUpdateRegistrationStatus,
          {
            isLoading: false,
            isError: false,
            isSuccess: true,
          },
        ]);

        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => (
            <Provider store={defaultStore}>{children}</Provider>
          ),
        });

        await act(async () => {
          result.current.onApproveRegistration();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(
          useFormToasts().onUpdateRegistrationSuccessToast
        ).toHaveBeenCalled();
        expect(mockOnUpdateRegistrationStatus).toHaveBeenCalledWith({
          annotation: '',
          registration_id: 1,
          status: null,
          user_id: 162221,
        });
      });
      it('should update the status successfully with registration_system_status_id', async () => {
        window.featureFlags['league-ops-update-registration-status'] = true;
        const mockOnUpdateRegistrationStatus = jest.fn();
        useUpdateRegistrationStatusMutation.mockReturnValue([
          mockOnUpdateRegistrationStatus,
          {
            isLoading: false,
            isError: false,
            isSuccess: true,
          },
        ]);

        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => (
            <Provider store={defaultStore}>{children}</Provider>
          ),
        });

        await act(async () => {
          result.current.onApproveRegistration();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);
        expect(
          useFormToasts().onUpdateRegistrationSuccessToast
        ).toHaveBeenCalled();
        expect(mockOnUpdateRegistrationStatus).toHaveBeenCalledWith({
          annotation: '',
          registration_id: 1,
          registration_system_status_id: 1,
          status: 'pending_organisation',
          user_id: 162221,
        });
      });
    });
    describe('failure update flow', () => {
      it('should handle the failure gracefully', async () => {
        const mockOnUpdateRegistrationStatus = jest.fn();
        useUpdateRegistrationStatusMutation.mockReturnValue([
          mockOnUpdateRegistrationStatus,
          {
            isLoading: false,
            isError: true,
            isSuccess: false,
          },
        ]);

        const { result } = renderHook(() => useApproveRegistration(), {
          wrapper: ({ children }) => (
            <Provider store={defaultStore}>{children}</Provider>
          ),
        });

        await act(async () => {
          result.current.onApproveRegistration();
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(true);

        expect(mockOnUpdateRegistrationStatus).toHaveBeenCalledWith({
          annotation: '',
          registration_id: 1,
          status: null,
          user_id: 162221,
        });
        expect(
          useFormToasts().onUpdateRegistrationFailureToast
        ).toHaveBeenCalled();
      });
    });
  });
});

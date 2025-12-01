import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import useRegistrationOperations from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import { onSetMode } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import * as formStateSelectors from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import * as registrationRequirementsSelectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  canEditSection,
  canApproveRequirement,
} from '@kitman/modules/src/LeagueOperations/shared/utils/operations';
import {
  INVALID,
  VALID,
} from '@kitman/modules/src/HumanInput/types/validation';
import {
  onSetApprovalStatus,
  onSetApprovalAnnotation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationRequirementsSlice';
import {
  getAllOptions,
  PENDING_ORGANISATION,
  PENDING_ASSOCIATION,
  REJECTED_ASSOCIATION,
  REJECTED_ORGANISATION,
  PENDING_PAYMENT,
  APPROVED,
} from '@kitman/modules/src/LeagueOperations/technicalDebt';
import { useFetchIsRegistrationSubmittableQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';

import useManageSection from '../hooks/useManageSection';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationOperations'
);
jest.mock('@kitman/modules/src/LeagueOperations/shared/utils/operations');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);
jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors'
);
jest.mock('@kitman/modules/src/HumanInput/hooks/useStatus');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi'
);

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const mockStore = {
  formStateSlice: {
    structure: {
      form_template_version: {
        form_elements: [],
      },
    },
    config: {
      mode: 'VIEW',
    },
  },
  formValidationSlice: {
    validation: { 2692: { status: 'INVALID' } },
  },
  'LeagueOperations.registration.api.requirement.section': {},
  'LeagueOperations.registration.slice.requirements': {
    panel: {
      status: 'rejected_organisation',
    },
  },
  globalApi: {},
};

const defaultStore = storeFake(mockStore);

describe('useManageSection', () => {
  beforeEach(() => {
    useRegistrationOperations.mockReturnValue({
      userType: 'athlete',
    });
    registrationRequirementsSelectors.getIsSubmitDisabledFactory.mockReturnValue(
      () => true
    );
    registrationRequirementsSelectors.getPanelFormElement.mockReturnValue({
      id: 2690,
      element_id: 'playerdetails',
      title: 'Player Details',
    });
    registrationRequirementsSelectors.getRequirementById.mockReturnValue(
      () => ({
        currentRequirement: { registration_requirement: { id: 1 } },
      })
    );
    formStateSelectors.getFormElementsByTypeFactory(() => ({
      type: 'Forms::Elements::Layouts::MenuItem',
    }));
    formStateSelectors.getElementByIdFactory.mockReturnValue(() => ({
      id: 2690,
      element_type: 'Forms::Elements::Layouts::MenuGroup',
      form_elements: [
        {
          id: 2691,
          element_type: 'Forms::Elements::Layouts::MenuItem',
          form_elements: [
            {
              id: 2692,
            },
          ],
        },
      ],
    }));
    canEditSection.mockReturnValue(false);
    useFetchIsRegistrationSubmittableQuery.mockReturnValue({
      registration_completable: true,
    });
  });
  it('should return the correct initial valeus', () => {
    useStatus.mockReturnValue('INVALID');

    const { result } = renderHook(() => useManageSection(), {
      wrapper: ({ children }) => {
        return <Provider store={defaultStore}>{children}</Provider>;
      },
    });

    expect(result.current.isSectionValid).toBe(false);
    expect(result.current.isSectionEditable).toBe(false);
    expect(result.current.isSectionApprovable).toBe(false);
    expect(result.current.approvalOptions).toStrictEqual([]);
    expect(result.current.isSubmitStatusDisabled).toBe(true);
    expect(typeof result.current.onToggleMode).toBe('function');
    expect(typeof result.current.onApplyStatus).toBe('function');
    expect(typeof result.current.onAddAnnotation).toBe('function');
  });

  describe('onToggleMode', () => {
    it('should dispatch onToggleMode correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });

      result.current.onToggleMode({ mode: 'EDIT' });

      expect(mockDispatch).toHaveBeenCalledWith(onSetMode({ mode: 'EDIT' }));
    });
  });

  describe('isSectionValid', () => {
    it('should return false when INVALID', () => {
      useStatus.mockReturnValue(INVALID);
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSectionValid).toBe(false);
    });

    it('should true on any other value', () => {
      useStatus.mockReturnValue(VALID);
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSectionValid).toBe(true);
    });
  });

  describe('isSubmitStatusDisabled', () => {
    it('should return false when selector return false', () => {
      registrationRequirementsSelectors.getIsSubmitDisabledFactory.mockReturnValue(
        () => false
      );
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSubmitStatusDisabled).toBe(false);
    });
  });

  describe('isSectionEditable', () => {
    it('should return false canEditSection is false', () => {
      canEditSection.mockReturnValue(false);
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSectionEditable).toBe(false);
    });

    it('should true when canEditSection is true', () => {
      canEditSection.mockReturnValue(true);
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSectionEditable).toBe(true);
    });
  });

  describe('isSectionApprovable', () => {
    it('should return false canApproveRequirement is false', () => {
      canApproveRequirement.mockReturnValue(false);
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSectionApprovable).toBe(false);
    });

    it('should true when canApproveRequirement is true', () => {
      canApproveRequirement.mockReturnValue(true);
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });
      expect(result.current.isSectionApprovable).toBe(true);
    });
  });

  describe('onApplyStatus', () => {
    it('should dispatch onApplyStatus correctly', () => {
      const mockDispatch = jest.fn();

      const store = defaultStore;
      store.dispatch = mockDispatch;
      const { result } = renderHook(() => useManageSection(), {
        wrapper: ({ children }) => {
          return <Provider store={defaultStore}>{children}</Provider>;
        },
      });

      result.current.onApplyStatus({ newStatus: 'incomplete' });

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
      const { result } = renderHook(() => useManageSection(), {
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

  describe('approvalOptions', () => {
    const options = getAllOptions();
    const getExpectedOption = (value) => {
      const noIncomplete = options.filter(
        (option) => option.value !== 'incomplete'
      );
      const noPayment = noIncomplete.filter(
        (option) => option.value !== 'pending_payment'
      );
      return noPayment.filter((option) => option.value !== value);
    };

    describe('ASSOCIATION_ADMIN', () => {
      beforeEach(() => {
        useRegistrationOperations.mockReturnValue({
          userType: 'association_admin',
        });
      });

      test.each([
        {
          status: PENDING_ORGANISATION,
          expected: getExpectedOption(PENDING_ORGANISATION.value),
        },
        {
          status: REJECTED_ORGANISATION,
          expected: getExpectedOption(REJECTED_ORGANISATION.value),
        },
        {
          status: PENDING_ASSOCIATION,
          expected: getExpectedOption(PENDING_ASSOCIATION.value),
        },
        {
          status: REJECTED_ASSOCIATION,
          expected: getExpectedOption(REJECTED_ASSOCIATION.value),
        },

        { status: APPROVED, expected: getExpectedOption(APPROVED.value) },
      ])(
        'returns the corrrect options when $status.value',
        ({ status, expected }) => {
          registrationRequirementsSelectors.getPanelStatus.mockReturnValue(
            status.value
          );
          const { result } = renderHook(() => useManageSection(), {
            wrapper: ({ children }) => {
              return <Provider store={defaultStore}>{children}</Provider>;
            },
          });
          expect(result.current.approvalOptions).toStrictEqual(expected);
        }
      );
    });
    describe('ORGANISATION_ADMIN', () => {
      beforeEach(() => {
        useRegistrationOperations.mockReturnValue({
          userType: 'organisation_admin',
        });
      });

      test.each([
        {
          status: PENDING_ORGANISATION,
          expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
        },
        {
          status: REJECTED_ORGANISATION,
          expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
        },
        {
          status: PENDING_ASSOCIATION,
          expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
        },
        {
          status: REJECTED_ASSOCIATION,
          expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
        },
        {
          status: PENDING_PAYMENT,
          expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
        },
        {
          status: APPROVED,
          expected: [REJECTED_ORGANISATION, PENDING_ASSOCIATION],
        },
      ])(
        'returns the corrrect options when $status.value',
        ({ status, expected }) => {
          registrationRequirementsSelectors.getPanelStatus.mockReturnValue(
            status.value
          );
          const { result } = renderHook(() => useManageSection(), {
            wrapper: ({ children }) => {
              return <Provider store={defaultStore}>{children}</Provider>;
            },
          });
          expect(result.current.approvalOptions).toStrictEqual(expected);
        }
      );
    });
  });
});

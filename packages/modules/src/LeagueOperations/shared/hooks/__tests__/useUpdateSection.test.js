import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  useUpdateRequirementSectionMutation,
  useApplyRequirementStatusMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi';
import * as formSelectors from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import * as registrationSelectors from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import useFormToasts from '../useFormToasts';
import useUpdateSection from '../useUpdateSection';

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi'
);
jest.mock(
  '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors'
);
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors'
);
jest.mock('../useFormToasts');

jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  'LeagueOperations.registration.slice.requirements': {},
  'LeagueOperations.registration.api.requirement.section': {},
  formValidationSlice: {},
  formMenuSlice: {},
  formStateSlice: {},
});

let store;
let mockTrackEvent;

const setupMocks = () => {
  store = defaultStore;

  mockTrackEvent = jest.fn();
  useFormToasts.mockReturnValue({
    onUpdateSectionSuccessToast: jest.fn(),
    onUpdateSectionFailureToast: jest.fn(),
    onUpdateSectionPendingToast: jest.fn(),
    onClearSectionToasts: jest.fn(),
    onApplySectionPendingToast: jest.fn(),
    onApplySectionFailureToast: jest.fn(),
    onApplySectionSuccessToast: jest.fn(),
    onClearApplyStatusToasts: jest.fn(),
  });

  registrationSelectors.getUserId.mockReturnValue(1);
  registrationSelectors.getRequirementById.mockReturnValue(() => ({
    id: 1,
    status: 'pending_organisation',
  }));

  registrationSelectors.getRegistrationSectionStatus.mockReturnValue(() => [
    {
      id: 1,
      type: 'pending_organisation',
      name: 'Pending Organisation',
    },
  ]);

  registrationSelectors.getPanelFormElement.mockReturnValue({
    id: 'panel1',
  });
  registrationSelectors.getPanelFormSectionId.mockReturnValue(1);
  formSelectors.getFormState.mockReturnValue({});
  formSelectors.getElementByIdFactory.mockReturnValue(() => ({}));
  registrationSelectors.getSelectedApprovalStatus.mockReturnValue(
    'pending_organisation'
  );
  registrationSelectors.getSelectedApprovalAnnotation.mockReturnValue(
    'well bai'
  );
  useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  registrationSelectors.getPanelFormSectionId.mockReturnValue(1);
};

describe('useUpdateSection', () => {
  beforeEach(() => {
    window.featureFlags['league-ops-update-registration-status'] = false;
    setupMocks();
  });

  it('should return initial state correctly', () => {
    useUpdateRequirementSectionMutation.mockReturnValue([
      jest.fn(),
      {
        isLoading: false,
        isError: false,
        isSuccess: false,
      },
    ]);
    useApplyRequirementStatusMutation.mockReturnValue([
      jest.fn(),
      {
        isLoading: false,
        isError: false,
        isSuccess: false,
      },
    ]);

    const { result } = renderHook(() => useUpdateSection(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(typeof result.current.onUpdate).toBe('function');
    expect(typeof result.current.onUpdateStatus).toBe('function');
  });
  describe('updating a requirement section', () => {
    beforeEach(() => {
      useApplyRequirementStatusMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update the section successfuly', async () => {
      const mockOnSaveSection = jest.fn();
      useUpdateRequirementSectionMutation.mockReturnValue([
        mockOnSaveSection,
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.onUpdate();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(useFormToasts().onUpdateSectionSuccessToast).toHaveBeenCalled();
    });

    it('should handle a failed update', async () => {
      useUpdateRequirementSectionMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.onUpdate();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(useFormToasts().onUpdateSectionFailureToast).toHaveBeenCalled();
    });

    it('should call onUpdate correctly', async () => {
      const mockOnSaveSection = jest.fn();
      useUpdateRequirementSectionMutation.mockReturnValue([
        mockOnSaveSection,
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        await result.current.onUpdate();
      });

      expect(mockOnSaveSection).toHaveBeenCalledWith({
        user_id: 1,
        registration_id: 1,
        id: 1,
        answers: expect.any(Array),
      });
    });
  });

  describe('updating a requirement status', () => {
    beforeEach(() => {
      useUpdateRequirementSectionMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update the status successfuly', async () => {
      const mockOnUpdateStatus = jest.fn();
      useApplyRequirementStatusMutation.mockReturnValue([
        mockOnUpdateStatus,
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.onUpdate();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(useFormToasts().onApplySectionSuccessToast).toHaveBeenCalled();
    });

    it('should handle a failed update', async () => {
      useApplyRequirementStatusMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: true,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        result.current.onUpdate();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(useFormToasts().onApplySectionFailureToast).toHaveBeenCalled();
    });

    it('should call onUpdate correctly', async () => {
      const mockOnUpdateStatus = jest.fn();
      useApplyRequirementStatusMutation.mockReturnValue([
        mockOnUpdateStatus,
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        await result.current.onUpdateStatus();
      });

      expect(mockOnUpdateStatus).toHaveBeenCalledWith({
        user_id: 1,
        registration_id: 1,
        section_id: 1,
        status: 'pending_organisation',
        annotation: 'well bai',
      });
    });

    it('should call onUpdateStatus correctly with registration_system_status_id', async () => {
      window.featureFlags['league-ops-update-registration-status'] = true;

      const mockOnUpdateStatus = jest.fn();
      useApplyRequirementStatusMutation.mockReturnValue([
        mockOnUpdateStatus,
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        await result.current.onUpdateStatus();
      });

      expect(mockOnUpdateStatus).toHaveBeenCalledWith({
        user_id: 1,
        registration_id: 1,
        registration_system_status_id: 1,
        section_id: 1,
        status: 'pending_organisation',
        annotation: 'well bai',
      });
    });
  });
});

describe('trackEvents', () => {
  beforeEach(() => {
    setupMocks();
  });

  describe('onUpdate', () => {
    beforeEach(() => {
      useUpdateRequirementSectionMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
    });

    it('should call onUpdate correctly', async () => {
      useApplyRequirementStatusMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);

      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        await result.current.onUpdate();
      });

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('Submit requirement', {
          Annotations: true,
          Status: ['pending_organisation'],
        });
      });
    });
  });

  describe('onUpdateStatus', () => {
    beforeEach(() => {
      useApplyRequirementStatusMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: false,
        },
      ]);
      useUpdateRequirementSectionMutation.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isError: false,
          isSuccess: true,
        },
      ]);
    });

    it('should call onUpdateStatus correctly', async () => {
      const { result } = renderHook(() => useUpdateSection(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      });

      await act(async () => {
        await result.current.onUpdateStatus();
      });

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith(
          'Update registration status',
          {
            Status: ['pending_organisation'],
          }
        );
      });
    });
  });
});

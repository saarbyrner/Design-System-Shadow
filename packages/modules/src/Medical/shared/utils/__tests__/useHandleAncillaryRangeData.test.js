import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import useToasts from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import useHandleAncillaryRangeData from '@kitman/modules/src/Medical/shared/utils/useHandleAncillaryRangeData';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import { useSaveAncillaryRangeMutation } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock('@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts');

describe('useHandleAncillaryRangeData', () => {
  const toastDispatchMock = jest.fn();

  const ancillaryRangeValues = {
    start_date: new Date('2023-01-01T00:00:00Z'),
    end_date: new Date('2023-06-01T00:00:00Z'),
    movementType: 'Try-Out',
  };
  const athleteId = 123;
  const athleteData = {
    fullname: 'Test Athlete',
  };

  const mockStore = storeFake({
    medicalSharedApi: {
      useSaveAncillaryRangeMutation: jest.fn(),
    },
  });

  const wrapper = ({ children }) => {
    return <Provider store={mockStore}>{children}</Provider>;
  };

  const renderHookWithWrapper = () => {
    return renderHook(() => useHandleAncillaryRangeData(), {
      wrapper,
    }).result;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useToasts.mockReturnValue({
      toasts: [],
      toastDispatch: toastDispatchMock,
    });
  });

  describe('useHandleAncillaryRangeData success', () => {
    beforeEach(() => {
      useToasts.mockReturnValue({
        toasts: [],
        toastDispatch: toastDispatchMock,
      });

      const saveAncillaryRange = jest.fn();
      saveAncillaryRange.mockReturnValue({ unwrap: () => Promise.resolve({}) });

      useSaveAncillaryRangeMutation.mockReturnValue([
        saveAncillaryRange,
        {
          data: {},
          error: false,
          isLoading: false,
        },
      ]);
    });

    it('creates expected toasts on success', async () => {
      let hookResult;

      await act(async () => {
        hookResult = renderHookWithWrapper();
      });
      const { handleAncillaryRangeData, toasts } = hookResult.current;
      expect(toasts).toEqual([]);
      await act(async () => {
        handleAncillaryRangeData(ancillaryRangeValues, athleteId, athleteData);
      });

      expect(toastDispatchMock).toHaveBeenCalledTimes(8); // Clear X3, progress, Clear X3, Success

      expect(toastDispatchMock).toHaveBeenCalledWith({
        toast: {
          id: 'ancillaryDateSubmitting',
          status: 'LOADING',
          title: 'Submitting Ancillary Date...',
        },
        type: 'CREATE_TOAST',
      });

      expect(toastDispatchMock).toHaveBeenCalledWith({
        id: 'ancillaryDateSubmitting',
        type: 'REMOVE_TOAST_BY_ID',
      });

      expect(toastDispatchMock).toHaveBeenCalledWith({
        toast: {
          id: 'ancillaryDateAdded',
          status: 'SUCCESS',
          title: 'Ancillary Date Added',
          description: 'Ancillary date added successfully for Test Athlete',
        },
        type: 'CREATE_TOAST',
      });

      expect(hookResult.current.ancillaryStatus).toEqual('SUCCESS');
    });
  });

  describe('useHandleAncillaryRangeData error', () => {
    beforeEach(() => {
      const saveAncillaryRange = jest.fn();
      saveAncillaryRange.mockReturnValue({ unwrap: () => Promise.reject() });

      useSaveAncillaryRangeMutation.mockReturnValue([
        saveAncillaryRange,
        {
          data: {},
          error: true,
          isLoading: false,
        },
      ]);
    });

    it('creates expected toasts on success', async () => {
      let hookResult;

      await act(async () => {
        hookResult = renderHookWithWrapper();
      });
      const { handleAncillaryRangeData, toasts } = hookResult.current;
      expect(toasts).toEqual([]);
      await act(async () => {
        handleAncillaryRangeData(ancillaryRangeValues, athleteId, athleteData);
      });

      expect(toastDispatchMock).toHaveBeenCalledTimes(8); // Clear X3, progress, Clear X3, Error

      expect(toastDispatchMock).toHaveBeenCalledWith({
        toast: {
          id: 'ancillaryDateSubmitting',
          status: 'LOADING',
          title: 'Submitting Ancillary Date...',
        },
        type: 'CREATE_TOAST',
      });

      expect(toastDispatchMock).toHaveBeenCalledWith({
        id: 'ancillaryDateSubmitting',
        type: 'REMOVE_TOAST_BY_ID',
      });

      expect(toastDispatchMock).toHaveBeenCalledWith({
        toast: {
          id: 'ancillaryDateError',
          status: 'ERROR',
          title: 'Error Adding Ancillary Date',
          description: 'Failed to add ancillary date for Test Athlete',
        },
        type: 'CREATE_TOAST',
      });

      expect(hookResult.current.ancillaryStatus).toEqual('FAILURE');
    });
  });
});

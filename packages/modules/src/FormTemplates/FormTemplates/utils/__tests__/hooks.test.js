import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import {
  useSearchFormTemplatesQuery,
  useDeleteFormTemplateMutation,
} from '@kitman/services/src/services/formTemplates';
import { formTemplateMocks } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/search';
import {
  initialState,
  REDUCER_KEY,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplatesSlice';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useShowToasts } from '@kitman/common/src/hooks';
import { useFormTemplates, useDeleteFormTemplateAction } from '../hooks';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useSearchFormTemplatesQuery: jest.fn(),
  useDeleteFormTemplateMutation: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks', () => ({
  useShowToasts: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks/useEventTracking');

jest.mock('../helpers', () => ({
  getDeleteToastsText: jest.fn(() => ({
    success: { title: 'Success', description: 'Successfully deleted' },
    error: { title: 'Error' },
  })),
  getConfirmDeleteTranslations: jest.fn(() => ({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete Form Template: Test Form?',
    cancelText: 'Cancel',
    confirmText: 'Delete',
  })),
}));

describe('hooks', () => {
  let dispatch;
  let wrapper;

  const trackEventMock = jest.fn();

  beforeEach(() => {
    dispatch = jest.fn();
    wrapper = ({ children }) => (
      <Provider store={storeFake({ [REDUCER_KEY]: initialState }, dispatch)}>
        {children}
      </Provider>
    );
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  describe('useFormTemplates', () => {
    it('returns loading state initially', () => {
      useSearchFormTemplatesQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isSuccess: false,
        isError: false,
        refetch: jest.fn(),
      });
      const { result } = renderHook(() => useFormTemplates(0, 25), { wrapper });
      expect(result.current.isLoading).toBe(true);
    });

    it('returns data on successful fetch', async () => {
      useSearchFormTemplatesQuery.mockReturnValue({
        data: {
          data: formTemplateMocks,
          meta: {
            currentPage: 0,
            nextPage: 0,
            prevPage: 0,
            totalCount: 1,
            totalPages: 1,
          },
        },
        isLoading: false,
        isSuccess: true,
        isError: false,
        refetch: jest.fn(),
      });
      const { result } = renderHook(() => useFormTemplates(0, 25), { wrapper });
      await act(() => Promise.resolve()); // Wait for the promise to resolve
      expect(result.current.rows).toEqual(formTemplateMocks);
    });
  });

  describe('useDeleteFormTemplateAction', () => {
    it('returns confirmationModal and loading state', () => {
      useDeleteFormTemplateMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false },
      ]);
      useShowToasts.mockReturnValue({
        showSuccessToast: jest.fn(),
        showErrorToast: jest.fn(),
      });
      const { result } = renderHook(
        () => useDeleteFormTemplateAction({ refetch: jest.fn() }),
        { wrapper }
      );
      expect(result.current).toHaveProperty('confirmationModal');
      expect(result.current).toHaveProperty('isDeleteLoading', false);
    });

    it('calls delete mutation on confirm', async () => {
      const deleteMock = jest.fn().mockResolvedValue(undefined);
      useDeleteFormTemplateMutation.mockReturnValue([
        deleteMock,
        { isLoading: false },
      ]);
      useShowToasts.mockReturnValue({
        showSuccessToast: jest.fn(),
        showErrorToast: jest.fn(),
      });
      const { result } = renderHook(
        () => useDeleteFormTemplateAction({ refetch: jest.fn() }),
        {
          wrapper: ({ children }) => (
            <Provider
              store={storeFake({
                [REDUCER_KEY]: {
                  ...initialState,
                  isFormTemplateDeleteModalOpen: true,
                  selectedFormTemplateId: 1,
                },
              })}
            >
              {children}
            </Provider>
          ),
        }
      );

      await act(async () => {
        if (
          result.current.confirmationModal &&
          result.current.confirmationModal.props.onConfirm
        ) {
          await result.current.confirmationModal.props.onConfirm();
        }
      });

      expect(deleteMock).toHaveBeenCalledWith({ formTemplateId: 1 });
    });
  });
});

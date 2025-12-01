import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';

import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { useDeleteFormCategoryMutation } from '@kitman/services/src/services/formTemplates';
import {
  initialState,
  REDUCER_KEY,
} from '@kitman/modules/src/FormTemplates/redux/slices/formTemplateSettingsSlice';
import { useShowToasts } from '@kitman/common/src/hooks';
import useDeleteCategoryAction from '../useDeleteCategoryAction';

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useDeleteFormCategoryMutation: jest.fn(),
}));

jest.mock('@kitman/common/src/hooks', () => ({
  useShowToasts: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/FormTemplates/FormTemplateSettings/components/tabs/CategoriesTab/utils/helpers',
  () => ({
    getDeleteCategoryToastsText: jest.fn(() => ({
      success: { title: 'Success', description: 'Successfully deleted' },
      error: { title: 'Error' },
    })),
    getConfirmDeleteCategoryTranslations: jest.fn(() => ({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete Form Template: Test Form?',
      cancelText: 'Cancel',
      confirmText: 'Delete',
    })),
  })
);

describe('useDeleteFormTemplateAction', () => {
  let dispatch;
  let wrapper;

  beforeEach(() => {
    dispatch = jest.fn();

    wrapper = ({ children }) => (
      <Provider store={storeFake({ [REDUCER_KEY]: initialState }, dispatch)}>
        {children}
      </Provider>
    );
  });

  it('returns confirmationModal and loading state', () => {
    useDeleteFormCategoryMutation.mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);
    useShowToasts.mockReturnValue({
      showSuccessToast: jest.fn(),
      showErrorToast: jest.fn(),
    });

    const { result } = renderHook(() => useDeleteCategoryAction(), {
      wrapper,
    });

    expect(result.current).toHaveProperty('confirmationModal');
    expect(result.current).toHaveProperty('isDeleteLoading', false);
  });

  it('calls delete mutation on confirm', async () => {
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    useDeleteFormCategoryMutation.mockReturnValue([
      deleteMock,
      { isLoading: false },
    ]);
    useShowToasts.mockReturnValue({
      showSuccessToast: jest.fn(),
      showErrorToast: jest.fn(),
    });
    const { result } = renderHook(() => useDeleteCategoryAction(), {
      wrapper: ({ children }) => (
        <Provider
          store={storeFake({
            [REDUCER_KEY]: {
              ...initialState,
              isDeleteFormCategoryModalOpen: true,
              selectedFormCategoryId: 1,
            },
          })}
        >
          {children}
        </Provider>
      ),
    });

    await act(async () => {
      if (
        result.current.confirmationModal &&
        result.current.confirmationModal.props.onConfirm
      ) {
        await result.current.confirmationModal.props.onConfirm();
      }
    });

    expect(deleteMock).toHaveBeenCalledWith({ categoryId: 1 });
  });
});

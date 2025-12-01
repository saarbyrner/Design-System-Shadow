import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useShowToasts } from '@kitman/common/src/hooks';
import { useDeleteFormAnswersSetMutation } from '@kitman/services/src/services/humanInput/humanInput';
import { useDeleteFormAnswersSetAction } from '../hooks';

jest.mock('@kitman/common/src/hooks', () => ({
  useShowToasts: jest.fn(),
}));

jest.mock('@kitman/services/src/services/humanInput/humanInput', () => ({
  ...jest.requireActual('@kitman/services/src/services/humanInput/humanInput'),
  useDeleteFormAnswersSetMutation: jest.fn(),
}));

describe('useDeleteFormAnswersSetAction', () => {
  const mockShowSuccessToast = jest.fn();
  const mockShowErrorToast = jest.fn();
  const mockDeleteFormAnswersSet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useShowToasts.mockReturnValue({
      showSuccessToast: mockShowSuccessToast,
      showErrorToast: mockShowErrorToast,
    });
    mockDeleteFormAnswersSet.mockResolvedValue({});
    useDeleteFormAnswersSetMutation.mockReturnValue([
      mockDeleteFormAnswersSet,
      { isLoading: false },
    ]);
  });

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalHistory: {},
    globalApi: {
      useGetOrganisationQuery: jest.fn(),
    },
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should return initial state', () => {
    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: false }),
      { wrapper }
    );

    expect(result.current.isDeleteLoading).toBeFalsy();
    expect(result.current.openModal).toBeDefined();
    expect(result.current.confirmationModal).toBeDefined();
  });

  it('should handle successful form answers set deletion', async () => {
    const formAnswersSetId = 123;

    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: false }),
      { wrapper }
    );

    await act(async () => {
      result.current.openModal(formAnswersSetId);
    });

    const confirmProps = result.current.confirmationModal.props;

    expect(confirmProps.isModalOpen).toBeTruthy();

    await act(async () => {
      await confirmProps.onConfirm();
    });

    expect(mockDeleteFormAnswersSet).toHaveBeenCalledWith(formAnswersSetId);
    expect(mockShowSuccessToast).toHaveBeenCalled();
    expect(mockShowErrorToast).not.toHaveBeenCalled();
  });

  it('should handle failed form answers set deletion', async () => {
    const formAnswersSetId = 123;
    const error = new Error('Failed to delete');

    mockDeleteFormAnswersSet.mockRejectedValueOnce(error);

    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: true }),
      { wrapper }
    );

    result.current.openModal(formAnswersSetId);

    const confirmProps = result.current.confirmationModal.props;

    await confirmProps.onConfirm();

    expect(mockDeleteFormAnswersSet).toHaveBeenCalledWith(formAnswersSetId);
    expect(mockShowSuccessToast).not.toHaveBeenCalled();
    expect(mockShowErrorToast).toHaveBeenCalled();
  });

  it('should close modal on cancel', async () => {
    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: false }),
      { wrapper }
    );

    result.current.openModal(123);

    const confirmProps = result.current.confirmationModal.props;

    expect(confirmProps.isModalOpen).toBeTruthy();

    await confirmProps.onCancel();

    expect(result.current.confirmationModal.props.isModalOpen).toBeFalsy();
  });

  it('should render correct modal text for draft deletion', async () => {
    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: true }),
      { wrapper }
    );

    result.current.openModal(123);

    const confirmProps = result.current.confirmationModal.props;

    expect(confirmProps.translatedText.title).toBe('Delete draft');
    expect(confirmProps.dialogContent.props.children).toBe(
      'Deleting this draft will erase all associated data.'
    );
  });

  it('should render correct modal text for form submission deletion', async () => {
    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: false }),
      { wrapper }
    );

    result.current.openModal(123);

    const confirmProps = result.current.confirmationModal.props;

    expect(confirmProps.translatedText.title).toBe('Delete form');
    expect(confirmProps.dialogContent.props.children).toBe(
      'Deleting this completed form will erase all associated data. You will not be able to recover it.'
    );
  });

  it('should show correct success toast text for draft deletion', async () => {
    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: true }),
      { wrapper }
    );

    result.current.openModal(123);

    await result.current.confirmationModal.props.onConfirm();

    expect(mockShowSuccessToast).toHaveBeenCalledWith({
      translatedTitle: 'Delete successful',
      translatedDescription: 'The draft has been deleted successfully.',
    });
  });

  it('should show correct error toast text for draft deletion', async () => {
    mockDeleteFormAnswersSet.mockRejectedValueOnce(new Error());

    const { result } = renderHook(
      () => useDeleteFormAnswersSetAction({ isDeleteDraftAction: true }),
      { wrapper }
    );

    result.current.openModal(123);

    await result.current.confirmationModal.props.onConfirm();

    expect(mockShowErrorToast).toHaveBeenCalledWith({
      translatedTitle: 'Failed to delete. Please try again.',
    });
  });
});

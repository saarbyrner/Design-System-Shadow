import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import useFormToasts from '../useFormToasts';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useFormToasts', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it('should handle clearing toasts correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onClearToasts();
    expect(dispatchMock).toHaveBeenCalledWith(remove('PROFILE_ERROR_TOAST'));
    expect(dispatchMock).toHaveBeenCalledWith(remove('PROFILE_SUCCESS_TOAST'));
  });

  it('should handle invalidation toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onInvalidationToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'PROFILE_INVALIDATON_TOAST_ID',
        status: 'ERROR',
        title: 'Please fill in required fields',
      })
    );
  });

  it('should handle save success toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onSaveSuccessToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'PROFILE_SUCCESS_TOAST',
        status: 'SUCCESS',
        title: 'Registration successfully submitted.',
      })
    );
  });

  it('should handle save error toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onSaveErrorToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'PROFILE_ERROR_TOAST',
        status: 'ERROR',
        title: 'Unable to save. Try again',
      })
    );
  });

  it('should handle save redirect toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onSaveRedirectToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'PROFILE_REDIRECT_TOAST_ID',
        status: 'SUCCESS',
        title: 'Returning to requirement page.',
      })
    );
  });

  it('should handle update section pending toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onUpdateSectionPendingToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'SECTION_UPDATE_PENDING_TOAST_ID',
        status: 'LOADING',
        title: 'Saving details.',
      })
    );
  });

  it('should handle update section success toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onUpdateSectionSuccessToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'SECTION_UPDATE_SUCCESS_TOAST_ID',
        status: 'SUCCESS',
        title: 'Details successfully updated.',
      })
    );
  });

  it('should handle update section failure toast correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onUpdateSectionFailureToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'SECTION_UPDATE_FAILURE_TOAST_ID',
        status: 'ERROR',
        title: 'Unable to save details. Try again.',
      })
    );
  });

  it('should handle clearing section toasts correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onClearSectionToasts();
    expect(dispatchMock).toHaveBeenCalledWith(
      remove('SECTION_UPDATE_SUCCESS_TOAST_ID')
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      remove('SECTION_UPDATE_FAILURE_TOAST_ID')
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      remove('SECTION_UPDATE_PENDING_TOAST_ID')
    );
  });

  it('should handle save progress toasts correctly', () => {
    const { result } = renderHook(() => useFormToasts());
    result.current.onSaveProgressToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: 'PROFILE_SAVE_PROGRESS_TOAST',
        status: 'SUCCESS',
        title: 'Registration successfully saved.',
      })
    );
  });
});

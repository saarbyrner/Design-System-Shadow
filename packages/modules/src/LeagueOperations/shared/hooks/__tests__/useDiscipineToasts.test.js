import { renderHook } from '@testing-library/react-hooks';
import { useDispatch } from 'react-redux';
import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import useDiscipineToasts, {
  CREATE_DISCIPLINARY_FAILURE_TOAST_ID,
  CREATE_DISCIPLINARY_PENDING_TOAST_ID,
  CREATE_DISCIPLINARY_SUCCESS_TOAST_ID,
  UPDATE_DISCIPLINARY_FAILURE_TOAST_ID,
  UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID,
  UPDATE_DISCIPLINARY_PENDING_TOAST_ID,
  DELETE_DISCIPLINARY_PENDING_TOAST_ID,
  DELETE_DISCIPLINARY_SUCCESS_TOAST_ID,
  DELETE_DISCIPLINARY_FAILURE_TOAST_ID,
} from '../useDisciplineToasts';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('useDiscipineToasts', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it('should handle clearing creation toasts correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onClearCreateToasts();
    expect(dispatchMock).toHaveBeenCalledWith(
      remove(CREATE_DISCIPLINARY_FAILURE_TOAST_ID)
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      remove(CREATE_DISCIPLINARY_SUCCESS_TOAST_ID)
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      remove(CREATE_DISCIPLINARY_PENDING_TOAST_ID)
    );
  });

  it('should handle clearing update toasts correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onClearUpdateToasts();
    expect(dispatchMock).toHaveBeenCalledWith(
      remove(UPDATE_DISCIPLINARY_FAILURE_TOAST_ID)
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      remove(UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID)
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      remove(UPDATE_DISCIPLINARY_PENDING_TOAST_ID)
    );
  });

  it('should handle creation success toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onCreateSuccessToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: CREATE_DISCIPLINARY_SUCCESS_TOAST_ID,
        status: 'SUCCESS',
        title: 'Disciplinary issue saved.',
      })
    );
  });

  it('should handle creation error toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onCreateFailureToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: CREATE_DISCIPLINARY_FAILURE_TOAST_ID,
        status: 'ERROR',
        title: 'Unable to create disciplinary issue. Try again.',
      })
    );
  });

  it('should handle creation pending toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onCreatePendingToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: CREATE_DISCIPLINARY_PENDING_TOAST_ID,
        status: 'LOADING',
        title: 'Saving disciplinary issue.',
      })
    );
  });

  it('should handle update success toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onUpdateSuccessToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: UPDATE_DISCIPLINARY_SUCCESS_TOAST_ID,
        status: 'SUCCESS',
        title: 'Disciplinary issue successfully updated.',
      })
    );
  });

  it('should handle update error toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onUpdateFailureToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: UPDATE_DISCIPLINARY_FAILURE_TOAST_ID,
        status: 'ERROR',
        title: 'Unable to update disciplinary issue. Try again',
      })
    );
  });

  it('should handle update pending toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onUpdatePendingToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: UPDATE_DISCIPLINARY_PENDING_TOAST_ID,
        status: 'LOADING',
        title: 'Disciplinary issue updating.',
      })
    );
  });

  it('should handle deletion pending toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onDeletePendingToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: DELETE_DISCIPLINARY_PENDING_TOAST_ID,
        status: 'LOADING',
        title: 'Disciplinary issue deleting.',
      })
    );
  });

  it('should handle deletion success toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onDeleteSuccessToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: DELETE_DISCIPLINARY_SUCCESS_TOAST_ID,
        status: 'SUCCESS',
        title: 'Disciplinary issue deleted.',
      })
    );
  });

  it('should handle deletion failure toast correctly', () => {
    const { result } = renderHook(() => useDiscipineToasts());
    result.current.onDeleteFailureToast();
    expect(dispatchMock).toHaveBeenCalledWith(
      add({
        id: DELETE_DISCIPLINARY_FAILURE_TOAST_ID,
        status: 'ERROR',
        title: 'Unable to delete disciplinary issue. Try again.',
      })
    );
  });
});

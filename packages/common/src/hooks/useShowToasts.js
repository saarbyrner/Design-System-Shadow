// @flow
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';

type ToastInput = {
  translatedTitle: string,
  translatedDescription?: string,
};

type UseShowToasts = {
  errorToastId: string,
  successToastId: string,
  errorToastOptions?: { [key: string]: mixed },
  successToastOptions?: { [key: string]: mixed },
};

export const useShowToasts = ({
  errorToastId,
  successToastId,
  errorToastOptions = {},
  successToastOptions = {},
}: UseShowToasts) => {
  const dispatch = useDispatch();

  const clearAnyExistingToast = useCallback(() => {
    [errorToastId, successToastId].forEach((toastIdToRemove) => {
      dispatch(
        remove({
          id: toastIdToRemove,
        })
      );
    });
  }, [dispatch, errorToastId, successToastId]);

  const showErrorToast = useCallback(
    ({ translatedTitle, translatedDescription }: ToastInput) => {
      clearAnyExistingToast();
      dispatch(
        add({
          id: errorToastId,
          status: toastStatusEnumLike.Error,
          title: translatedTitle,
          description: translatedDescription,
          ...errorToastOptions,
        })
      );
    },
    [dispatch, errorToastId, clearAnyExistingToast, errorToastOptions]
  );

  const showSuccessToast = useCallback(
    ({ translatedTitle, translatedDescription }: ToastInput) => {
      clearAnyExistingToast();
      dispatch(
        add({
          id: successToastId,
          status: toastStatusEnumLike.Success,
          title: translatedTitle,
          description: translatedDescription,
          ...successToastOptions,
        })
      );
    },
    [dispatch, successToastId, clearAnyExistingToast, successToastOptions]
  );

  return {
    showErrorToast,
    showSuccessToast,
  };
};

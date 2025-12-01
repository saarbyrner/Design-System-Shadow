// @flow
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { add, remove } from '@kitman/modules/src/Toasts/toastsSlice';
import { onUpdateFormStructure } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { toastStatusEnumLike } from '@kitman/components/src/Toast/enum-likes';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { HumanInputUser } from '@kitman/modules/src/HumanInput/types/forms';

import { getToastTranslations } from './helpers';
import {
  STATUS_CHANGE_ERROR_TOAST_ID,
  STATUS_CHANGE_SUCCESS_TOAST_ID,
} from './consts';
import type { UpdateUserStatus } from './types';

type UseStatusChangeAction = {
  user: HumanInputUser | null,
  updateUserStatus: UpdateUserStatus,
  isUserActive: boolean,
  closeModal: () => void,
  t: Translation,
};

export const useStatusChangeAction = ({
  user,
  isUserActive,
  updateUserStatus,
  closeModal,
  t,
}: UseStatusChangeAction) => {
  const fullname = user?.fullname ?? '';

  const dispatch = useDispatch();
  const removePreviousToasts = () => {
    dispatch(remove(STATUS_CHANGE_SUCCESS_TOAST_ID));
    dispatch(remove(STATUS_CHANGE_ERROR_TOAST_ID));
  };

  const toastTranslations = getToastTranslations(t);

  const addSuccessToast = () => {
    removePreviousToasts();
    dispatch(
      add({
        id: STATUS_CHANGE_SUCCESS_TOAST_ID,
        status: toastStatusEnumLike.Success,
        title: t('Successfully {{action}} {{fullname}}', {
          fullname,
          action: isUserActive
            ? toastTranslations.deactivated
            : toastTranslations.activated,
        }),
      })
    );
  };

  const addErrorToast = () => {
    removePreviousToasts();
    dispatch(
      add({
        id: STATUS_CHANGE_ERROR_TOAST_ID,
        status: toastStatusEnumLike.Error,
        title: t('Failed to {{action}} {{fullname}}. Please try again', {
          fullname,
          action: isUserActive
            ? toastTranslations.deactivate
            : toastTranslations.activate,
        }),
      })
    );
  };

  const onConfirmStatusChange = async () => {
    try {
      unwrapResult(
        await updateUserStatus({
          userId: user?.id,
          requestBody: { is_active: !isUserActive },
        })
      );

      closeModal();
      addSuccessToast();
      if (user) {
        dispatch(
          onUpdateFormStructure({
            structure: { user: { ...user, is_active: !isUserActive } },
          })
        );
      }
    } catch {
      addErrorToast();
    }
  };

  return { onConfirmStatusChange };
};

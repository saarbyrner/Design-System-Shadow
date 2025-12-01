// @flow
import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';

import { DialogContentText } from '@kitman/playbook/components';
import { useShowToasts } from '@kitman/common/src/hooks';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { useDeleteFormAnswersSetMutation } from '@kitman/services/src/services/humanInput/humanInput';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import {
  getDeleteFormAnswersSetConfirmationModalText,
  getDeleteToastsText,
} from './helpers';

export const DELETE_FORM_ANSWERS_SET_SUCCESS_TOAST_ID =
  'DELETE_FORM_ANSWERS_SET_SUCCESS_TOAST_ID';
export const DELETE_FORM_ANSWERS_SET_ERROR_TOAST_ID =
  'DELETE_FORM_ANSWERS_SET_ERROR_TOAST_ID';

export const useDeleteFormAnswersSetAction = ({
  isDeleteDraftAction,
  refetch,
  isStaffFlow = false,
}: {
  isDeleteDraftAction: boolean,
  isStaffFlow?: boolean,
  refetch?: () => void,
}) => {
  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);
  const { trackEvent } = useEventTracking();
  const [formAnswersSetId, setFormAnswersSetId] = useState(null);
  const closeModal = () => setShouldOpenConfirmationModal(false);
  const openModal = (draftFormAnswersSetId: number) => {
    setFormAnswersSetId(draftFormAnswersSetId);
    setShouldOpenConfirmationModal(true);
  };

  const { showErrorToast, showSuccessToast } = useShowToasts({
    successToastId: DELETE_FORM_ANSWERS_SET_SUCCESS_TOAST_ID,
    errorToastId: DELETE_FORM_ANSWERS_SET_ERROR_TOAST_ID,
  });

  const [deleteFormAnswersSet, { isLoading: isDeleteLoading }]: [
    ReduxMutation<number, void>,
    { isLoading: boolean }
  ] = useDeleteFormAnswersSetMutation();

  const { success, error } = getDeleteToastsText(isDeleteDraftAction);

  const trackDeleteEvents = () => {
    if (isStaffFlow) {
      if (isDeleteDraftAction) {
        trackEvent('Staff - Draft Form Answer Set Deleted for Athlete');
      } else {
        trackEvent('Staff - Form Answer Set Deleted for Athlete');
      }
    } else {
      // track events for athlete flow
    }
  };

  const handleDeleteFormAnswersSet = async () => {
    try {
      if (formAnswersSetId) {
        unwrapResult(await deleteFormAnswersSet(formAnswersSetId));
        showSuccessToast({
          translatedTitle: success.title,
          translatedDescription: success.description,
        });
        trackDeleteEvents();
        refetch?.();
      }
    } catch {
      showErrorToast({
        translatedTitle: error.title,
      });
    }
    closeModal();
  };

  const { content: translatedContent, ...restTranslatedText } =
    getDeleteFormAnswersSetConfirmationModalText(isDeleteDraftAction);

  const dialogContent = (
    <DialogContentText id={modalDescriptionId}>
      {translatedContent}
    </DialogContentText>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={isDeleteLoading}
      onConfirm={handleDeleteFormAnswersSet}
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={dialogContent}
      translatedText={restTranslatedText}
      isDeleteAction
    />
  );

  return {
    confirmationModal,
    openModal,
    isDeleteLoading,
  };
};

// @flow

import { useState, useEffect } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';

import { useShowToasts } from '@kitman/common/src/hooks';
import { DialogContentText, TextField, Box } from '@kitman/playbook/components';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import { useResetAthletePasswordMutation } from '@kitman/services/src/services/humanInput/humanInput';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type { SetState } from '@kitman/common/src/types/react';
import type { ResetAthletePasswordRequestBody } from '@kitman/services/src/services/humanInput/api/athleteProfile/resetAthletePassword';
import {
  getResetPasswordModalTranslations,
  getResetPasswordToastTranslations,
} from './helpers';

export const RESET_PASSWORD_SUCCESS_TOAST_ID =
  'RESET_PASSWORD_SUCCESS_TOAST_ID';
export const RESET_PASSWORD_ERROR_TOAST_ID = 'RESET_PASSWORD_ERROR_TOAST_ID';

const getResetPasswordModalContent = ({
  text,
  inputLabel,
  email,
  setEmail,
}: {
  text: string,
  inputLabel: string,
  email: string | null,
  setEmail: SetState<string | null>,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: '0.5rem' }}>
    <DialogContentText id={modalDescriptionId}>{text}</DialogContentText>
    <TextField
      label={inputLabel}
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      sx={{ width: '20rem' }}
    />
  </Box>
);

type ResetAthletePassword = ReduxMutation<
  ResetAthletePasswordRequestBody,
  void
>;

type UseResetPassword = {
  athleteEmail: string,
  athleteId: number,
  athleteName: string,
  athleteUsername: string,
};

export const useResetPassword = ({
  athleteEmail,
  athleteId,
  athleteName,
  athleteUsername,
}: UseResetPassword) => {
  const { showErrorToast, showSuccessToast } = useShowToasts({
    successToastId: RESET_PASSWORD_SUCCESS_TOAST_ID,
    errorToastId: RESET_PASSWORD_ERROR_TOAST_ID,
  });

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);
  const [email, setEmail] = useState<string | null>(athleteEmail);

  useEffect(() => {
    setEmail(athleteEmail);
  }, [athleteEmail]);

  const closeModal = () => setShouldOpenConfirmationModal(false);
  const openModal = () => setShouldOpenConfirmationModal(true);

  const [resetAthletePassword, { isLoading: isResetAthletePasswordLoading }]: [
    ResetAthletePassword,
    { isLoading: boolean }
  ] = useResetAthletePasswordMutation();

  const resetPasswordModalTranslations = getResetPasswordModalTranslations({
    athleteName,
    athleteUsername,
  });

  const toastTranslations = getResetPasswordToastTranslations();

  const handleResetPassword = async () => {
    try {
      unwrapResult(
        await resetAthletePassword({
          athleteId,
          email: email ?? '',
        })
      );
      showSuccessToast({
        translatedTitle: toastTranslations.success,
      });
    } catch {
      showErrorToast({
        translatedTitle: toastTranslations.error,
      });
    }

    closeModal();
  };

  const updateActiveStatusDialogContent = getResetPasswordModalContent({
    text: resetPasswordModalTranslations.content.text,
    inputLabel: resetPasswordModalTranslations.content.inputLabel,
    email,
    setEmail,
  });

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={isResetAthletePasswordLoading}
      onConfirm={handleResetPassword}
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={updateActiveStatusDialogContent}
      translatedText={{
        title: resetPasswordModalTranslations.title,
        actions: resetPasswordModalTranslations.actions,
      }}
    />
  );

  return {
    confirmationModal,
    openModal,
  };
};

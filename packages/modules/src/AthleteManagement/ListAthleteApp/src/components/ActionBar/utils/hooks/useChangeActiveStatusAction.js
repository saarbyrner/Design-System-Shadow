// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { DialogContentText } from '@kitman/playbook/components';
import { onUpdateSelectedAthleteIds } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import { useBulkUpdateActiveStatusMutation } from '@kitman/modules/src/AthleteManagement/shared/redux/services';

import { useShowToasts } from '@kitman/common/src/hooks';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import {
  getChangeActiveStatusModalTranslations,
  getChangeActiveStatusToastTranslations,
} from '../helpers';
import type { BulkUpdateActiveStatus, SelectedAthleteIds } from '../types';

export const UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID =
  'UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID';
export const UPDATE_ACTIVE_STATUS_ERROR_TOAST_ID =
  'UPDATE_ACTIVE_STATUS_ERROR_TOAST_ID';

const getUpdateActivityStatusDialogContent = ({
  initialText,
  bulletPoints,
}: {
  initialText: string,
  bulletPoints: Array<string>,
}) => (
  <>
    <DialogContentText id={modalDescriptionId}>{initialText}</DialogContentText>
    <ul>
      {bulletPoints.map((bulletPoint) => (
        <li key={bulletPoint}>{bulletPoint}</li>
      ))}
    </ul>
  </>
);

type UseChangeActiveStatusAction = {
  selectedAthleteIds: SelectedAthleteIds,
  isActivating: boolean,
  handleRefetchData: () => void,
};

export const useChangeActiveStatusAction = ({
  selectedAthleteIds,
  isActivating,
  handleRefetchData,
}: UseChangeActiveStatusAction) => {
  const dispatch = useDispatch();
  const { showErrorToast, showSuccessToast } = useShowToasts({
    successToastId: UPDATE_ACTIVE_STATUS_SUCCESS_TOAST_ID,
    errorToastId: UPDATE_ACTIVE_STATUS_ERROR_TOAST_ID,
  });

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);

  const closeModal = () => setShouldOpenConfirmationModal(false);
  const openModal = () => setShouldOpenConfirmationModal(true);

  const [bulkUpdateActiveStatus, { isLoading: isUpdateActiveStatusLoading }]: [
    BulkUpdateActiveStatus,
    { isLoading: boolean }
  ] = useBulkUpdateActiveStatusMutation();

  const updateActiveStatusModalTranslations =
    getChangeActiveStatusModalTranslations(isActivating);
  const toastTranslation = getChangeActiveStatusToastTranslations(
    isActivating,
    selectedAthleteIds.length
  );

  const handleUpdateActiveStatus = async () => {
    try {
      unwrapResult(
        await bulkUpdateActiveStatus({
          athlete_ids: selectedAthleteIds.map(({ id }) => id),
          is_active: isActivating,
        })
      );
      showSuccessToast({
        translatedTitle: toastTranslation.success.title,
      });
      handleRefetchData();
      dispatch(onUpdateSelectedAthleteIds([]));
    } catch {
      showErrorToast({
        translatedTitle: toastTranslation.error.title,
      });
    }

    closeModal();
  };

  const updateActiveStatusDialogContent = getUpdateActivityStatusDialogContent(
    updateActiveStatusModalTranslations.content
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={isUpdateActiveStatusLoading}
      onConfirm={handleUpdateActiveStatus}
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={updateActiveStatusDialogContent}
      translatedText={{
        title: updateActiveStatusModalTranslations.title,
        actions: updateActiveStatusModalTranslations.actions,
      }}
    />
  );

  return {
    confirmationModal,
    openModal,
  };
};

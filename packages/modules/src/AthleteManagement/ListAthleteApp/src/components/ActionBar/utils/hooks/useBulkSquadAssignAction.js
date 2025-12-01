// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { DialogContentText } from '@kitman/playbook/components';

import { useShowToasts } from '@kitman/common/src/hooks';
import { useBulkAssignAthleteSquadsMutation } from '@kitman/modules/src/AthleteManagement/shared/redux/services';

import {
  onUpdateSelectedAthleteIds,
  onUpdateSelectedSquadIds,
} from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { BulkAssignAthleteSquadsRequestBody } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/bulkAssignAthleteSquads';
import type { BulkActionsData } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';

import { getAssignSquadModalTranslations } from '../helpers';
import type { BulkAssignAthleteSquads, SelectedAthleteIds } from '../types';

const BULK_SQUAD_ASSIGN_SUCCESS_TOAST_ID = 'BULK_SQUAD_ASSIGN_SUCCESS_TOAST_ID';
const BULK_SQUAD_ASSIGN_ERROR_TOAST_ID = 'BULK_SQUAD_ASSIGN_ERROR_TOAST_ID';

type UseBulkSquadAssignAction = {
  selectedSquadIds: $PropertyType<BulkActionsData, 'selectedSquadIds'>,
  selectedAthleteIds: SelectedAthleteIds,
  handleRefetchData: () => void,
  t: Translation,
};

export const useBulkSquadAssignAction = ({
  selectedSquadIds,
  selectedAthleteIds,
  handleRefetchData,
  t,
}: UseBulkSquadAssignAction) => {
  const dispatch = useDispatch();

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);
  const closeModal = () => {
    setShouldOpenConfirmationModal(false);
    dispatch(onUpdateSelectedSquadIds([]));
  };
  const openModal = () => setShouldOpenConfirmationModal(true);
  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: BULK_SQUAD_ASSIGN_ERROR_TOAST_ID,
    successToastId: BULK_SQUAD_ASSIGN_SUCCESS_TOAST_ID,
  });
  const [bulkAssignAthleteSquads, { isLoading: isBulkAssignLoading }]: [
    BulkAssignAthleteSquads,
    { isLoading: boolean }
  ] = useBulkAssignAthleteSquadsMutation();

  const handleBulkAssignAthleteSquadClick = async () => {
    const requestBody: BulkAssignAthleteSquadsRequestBody = {
      athletes: selectedAthleteIds.map((selectedAthleteId) => ({
        athlete_id: selectedAthleteId.id,
        squad_ids: selectedSquadIds,
      })),
    };

    try {
      unwrapResult(await bulkAssignAthleteSquads(requestBody));

      showSuccessToast({ translatedTitle: t('Successfully assigned squads') });
      handleRefetchData();
      dispatch(onUpdateSelectedAthleteIds([]));
      dispatch(onUpdateSelectedSquadIds([]));
    } catch {
      showErrorToast({
        translatedTitle: t('Failed to assign squads. Please try again'),
      });
    }
    closeModal();
  };

  const { content, ...restTranslations } = getAssignSquadModalTranslations();

  const bulkSquadAssignDialogContent = (
    <>
      <DialogContentText id={modalDescriptionId}>
        {content.initialText}
      </DialogContentText>
      <ul>
        {content.bulletPoints.map((bulletPoint) => (
          <li key={bulletPoint}>{bulletPoint}</li>
        ))}
      </ul>
    </>
  );

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={isBulkAssignLoading}
      onConfirm={handleBulkAssignAthleteSquadClick}
      onCancel={() => {
        dispatch(onUpdateSelectedSquadIds([]));
        closeModal();
      }}
      onClose={closeModal}
      dialogContent={bulkSquadAssignDialogContent}
      translatedText={restTranslations}
    />
  );

  return {
    confirmationModal,
    openModal,
    isBulkAssignLoading,
  };
};

// @flow
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { DialogContentText } from '@kitman/playbook/components';
import { useShowToasts } from '@kitman/common/src/hooks';

import { getShouldRemovePrimarySquad } from '@kitman/modules/src/AthleteManagement/shared/redux/selectors';
import { onUpdateSelectedAthleteIds } from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import { useBulkUpdatePrimarySquadMutation } from '@kitman/modules/src/AthleteManagement/shared/redux/services';
import ConfirmationModal, {
  modalDescriptionId,
} from '@kitman/playbook/components/ConfirmationModal';
import type { Squad as ActiveSquad } from '@kitman/services/src/services/getActiveSquad';
import type { Translation } from '@kitman/common/src/types/i18n';

import { getPrimarySquadConfirmationModalTranslations } from '../helpers';
import type { BulkAssignPrimarySquad, SelectedAthleteIds } from '../types';

export const PRIMARY_SQUAD_SUCCESS_TOAST_ID = 'PRIMARY_SQUAD_SUCCESS_TOAST_ID';
export const PRIMARY_SQUAD_ERROR_TOAST_ID = 'PRIMARY_SQUAD_ERROR_TOAST_ID';

const getAssignPrimarySquadDialogContent = ({
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

type UsePrimarySquadAction = {
  t: Translation,
  selectedAthleteIds: SelectedAthleteIds,
  handleRefetchData: () => void,
};

export const usePrimarySquadAction = ({
  t,
  selectedAthleteIds,
  handleRefetchData,
}: UsePrimarySquadAction) => {
  const dispatch = useDispatch();
  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: PRIMARY_SQUAD_ERROR_TOAST_ID,
    successToastId: PRIMARY_SQUAD_SUCCESS_TOAST_ID,
  });

  const shouldRemovePrimarySquad = useSelector(getShouldRemovePrimarySquad);

  const [shouldOpenConfirmationModal, setShouldOpenConfirmationModal] =
    useState(false);

  const closeModal = () => setShouldOpenConfirmationModal(false);
  const openModal = () => setShouldOpenConfirmationModal(true);

  const [
    bulkAssignAthleteSquads,
    { isLoading: isPrimarySquadAssignmentLoading },
  ]: [BulkAssignPrimarySquad, { isLoading: boolean }] =
    useBulkUpdatePrimarySquadMutation();

  const { data: userCurrentSquad }: { data: ActiveSquad } =
    useGetActiveSquadQuery();

  const primarySquadModalTranslations =
    getPrimarySquadConfirmationModalTranslations();

  const handlePrimarySquadChange = async () => {
    const { id: currentSquadId } = userCurrentSquad;
    if (currentSquadId || shouldRemovePrimarySquad) {
      try {
        unwrapResult(
          await bulkAssignAthleteSquads({
            primary_squad_id: shouldRemovePrimarySquad ? null : currentSquadId,
            athlete_ids: selectedAthleteIds.map(({ id }) => id),
          })
        );
        showSuccessToast({
          translatedTitle: t('Successfully {{action}} primary squad', {
            action: shouldRemovePrimarySquad ? t('removed') : t('assigned'),
          }),
        });
        handleRefetchData();
        dispatch(onUpdateSelectedAthleteIds([]));
      } catch {
        showErrorToast({
          translatedTitle: t(
            'Failed to {{action}} primary squad. Please try again',
            {
              action: shouldRemovePrimarySquad ? t('remove') : t('assign'),
            }
          ),
        });
      }
    }
    closeModal();
  };

  const removePrimarySquadDialogContent = (
    <DialogContentText>
      {primarySquadModalTranslations.removing.content}
    </DialogContentText>
  );

  const assignPrimarySquadDialogContent = getAssignPrimarySquadDialogContent(
    primarySquadModalTranslations.assigning.content
  );

  const modalText = {
    title: shouldRemovePrimarySquad
      ? primarySquadModalTranslations.removing.title
      : primarySquadModalTranslations.assigning.title,
    actions: shouldRemovePrimarySquad
      ? primarySquadModalTranslations.removing.actions
      : primarySquadModalTranslations.assigning.actions,
  };

  const confirmationModal = (
    <ConfirmationModal
      isModalOpen={shouldOpenConfirmationModal}
      isLoading={isPrimarySquadAssignmentLoading} // to be changed once we have the EP
      onConfirm={handlePrimarySquadChange} // to be changed once we have the EP
      onCancel={closeModal}
      onClose={closeModal}
      dialogContent={
        shouldRemovePrimarySquad
          ? removePrimarySquadDialogContent
          : assignPrimarySquadDialogContent
      }
      translatedText={modalText}
    />
  );

  return {
    confirmationModal,
    openModal,
  };
};

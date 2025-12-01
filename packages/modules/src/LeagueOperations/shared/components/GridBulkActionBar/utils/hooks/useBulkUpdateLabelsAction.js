/* eslint-disable no-param-reassign */
// @flow
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  onSetSelectedLabelIds,
  onReset,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/registrationGridSlice';
import {
  getSelectedLabelIds,
  getOriginalSelectedLabelIds,
  getSelectedAthleteIds,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationGridSelectors';
import { registrationGlobalApi } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

import type { LabelsResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { BulkUpdateAthleteLabels } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/utils/types';
import { useBulkUpdateAthleteLabelsMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { SelectedAthleteIds } from '../types';

const BULK_UPDATE_LABELS_ERROR_TOAST_ID = 'BULK_UPDATE_LABELS_ERROR_TOAST_ID';

type UseBulkUpdateLabelsAction = {
  selectedAthleteIds: SelectedAthleteIds,
  canViewLabels: boolean,
  t: Translation,
};
type LabelsOptions = Array<{
  id: number,
  name: string,
  organisation_id: number,
  description: string,
  color: string,
  created_by: {
    id: number,
    fullname: string,
  },
  created_on: string,
  system_managed: boolean,
  label_category: {
    id: number,
    name: string,
    description: string,
    max_number: number,
  },
}>;

const useBulkUpdateLabelsAction = ({
  selectedAthleteIds,
  canViewLabels,
  t,
}: UseBulkUpdateLabelsAction) => {
  const dispatch = useDispatch();
  const selectedLabelIds = useSelector(getSelectedLabelIds);
  const selectedAthletes = useSelector(getSelectedAthleteIds);
  const originalSelectedLabelIds = useSelector(getOriginalSelectedLabelIds);
  const LABELS_LIST = useSelector(
    (state) => state.labelsApi.queries['getAllLabels(undefined)']?.data
  );

  const { showErrorToast } = useShowToasts({
    errorToastId: BULK_UPDATE_LABELS_ERROR_TOAST_ID,
    successToastId: '',
  });

  const {
    data: labelsData = [],
    isFetching: areLabelsDataFetching,
  }: { data: LabelsResponse, isFetching: boolean } =
    // using undefined because this endpoint does not except arguments, but we do want to pass the skip query option
    useGetAllLabelsQuery(undefined, {
      skip: !canViewLabels,
    });

  const [
    bulkUpdateAthleteLabels,
    { isLoading: isBulkUpdateAthleteLabelsLoading },
  ]: [BulkUpdateAthleteLabels, { isLoading: boolean }] =
    useBulkUpdateAthleteLabelsMutation();

  const labelsOptions: Array<{ value: number, label: string, color: string }> =
    labelsData.map(({ id, name, color }) => ({
      value: id,
      label: name,
      color,
    }));

  const handleLabelChange = (_: Object, newLabelIds: Array<number>) => {
    if (originalSelectedLabelIds.length) {
      dispatch(onSetSelectedLabelIds(newLabelIds));
      return;
    }
    dispatch(onSetSelectedLabelIds(newLabelIds));
  };

  // Helper to get updated labels for an athlete
  const getUpdatedLabels = (
    currentAthlete: Object,
    labelsSelected: Array<number>,
    labelsList: LabelsOptions
  ): LabelsOptions => {
    // Find "Non-registered" label if present
    const nonRegisteredLabel = currentAthlete.labels?.find(
      (label) => label.name === 'Non-registered'
    );

    // Build new labels array from selectedLabelIds
    let updatedLabels = labelsSelected
      .map((id) => labelsList?.find((label) => label.id === id))
      .filter(Boolean);

    if (nonRegisteredLabel) {
      // Remove if already present to avoid duplicates
      updatedLabels = updatedLabels.filter(
        (label) => label.id !== nonRegisteredLabel.id
      );
      updatedLabels.unshift(nonRegisteredLabel);
    }

    return updatedLabels;
  };

  // Helper to update a single athlete in the draft
  const updateAthleteLabelsInDraft = (
    athleteFromDraft: Object,
    currentlySelectedAthletes: Array<{ id: number, userId: number }>,
    currentlySelectedLabelIds: Array<number>,
    labelListFromData: LabelsOptions
  ) => {
    const isSelectedAthlete = currentlySelectedAthletes.some(
      (selectedAthlete) => selectedAthlete.id === athleteFromDraft.id
    );
    if (isSelectedAthlete) {
      athleteFromDraft.labels = getUpdatedLabels(
        athleteFromDraft,
        currentlySelectedLabelIds,
        labelListFromData
      );
    }
    return athleteFromDraft;
  };

  const handleDataUpdate = () => {
    dispatch(
      registrationGlobalApi.util.updateQueryData(
        'searchAthleteList',
        undefined,
        (draft) => {
          const safeDraft = Array.isArray(draft) ? draft : draft?.data;
          if (!Array.isArray(safeDraft)) return;

          safeDraft.forEach((athlete) => {
            updateAthleteLabelsInDraft(
              athlete,
              selectedAthletes,
              selectedLabelIds,
              LABELS_LIST
            );
          });
        }
      )
    );
  };

  const handleBulkUpdateLabelsClick = async () => {
    let labelsToAdd = [];
    let labelsToRemove = [];

    // Determine labels to add and remove based on selected labels
    if (selectedLabelIds.length > 0) {
      labelsToAdd = selectedLabelIds.filter(
        (id) => !originalSelectedLabelIds.includes(id)
      );
      labelsToRemove = originalSelectedLabelIds.filter(
        (id) => !selectedLabelIds.includes(id)
      );
    } else {
      // If no labels are selected, remove all original labels
      labelsToRemove = originalSelectedLabelIds;
    }

    try {
      unwrapResult(
        bulkUpdateAthleteLabels({
          athleteIds: selectedAthleteIds.map(({ id }) => id),
          labelsToAdd,
          labelsToRemove,
        })
      );

      handleDataUpdate();
      dispatch(onReset());
    } catch {
      showErrorToast({
        translatedTitle: t('Failed to update labels. Please try again'),
      });
    }
  };

  return {
    handleBulkUpdateLabelsClick,
    handleLabelChange,
    isBulkUpdateAthleteLabelsLoading,
    selectedLabelIds,
    originalSelectedLabelIds,
    labelsOptions,
    areLabelsDataFetching,
  };
};

export default useBulkUpdateLabelsAction;

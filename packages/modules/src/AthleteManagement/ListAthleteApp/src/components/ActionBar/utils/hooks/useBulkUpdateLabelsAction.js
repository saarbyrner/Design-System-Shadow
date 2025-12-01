// @flow
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  onUpdateOriginalSelectedLabelIds,
  onUpdateSelectedLabelIds,
} from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import {
  getSelectedLabelIds,
  getOriginalSelectedLabelIds,
} from '@kitman/modules/src/AthleteManagement/shared/redux/selectors';
import type { LabelsResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { BulkUpdateAthleteLabels } from '@kitman/modules/src/AthleteManagement/ListAthleteApp/src/components/ActionBar/utils/types';
import { useBulkUpdateAthleteLabelsMutation } from '@kitman/modules/src/AthleteManagement/shared/redux/services';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { SelectedAthleteIds } from '../types';

const BULK_UPDATE_LABELS_ERROR_TOAST_ID = 'BULK_UPDATE_LABELS_ERROR_TOAST_ID';

type UseBulkUpdateLabelsAction = {
  selectedAthleteIds: SelectedAthleteIds,
  canViewLabels: boolean,
  handleRefetchData: () => void,
  t: Translation,
};

export const useBulkUpdateLabelsAction = ({
  selectedAthleteIds,
  canViewLabels,
  handleRefetchData,
  t,
}: UseBulkUpdateLabelsAction) => {
  const dispatch = useDispatch();
  const selectedLabelIds = useSelector(getSelectedLabelIds);
  const originalSelectedLabelIds = useSelector(getOriginalSelectedLabelIds);

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
      skip: !(window.getFlag('labels-and-groups') && canViewLabels),
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
    dispatch(onUpdateSelectedLabelIds(newLabelIds));
  };

  const handleBulkUpdateLabelsClick = async () => {
    // if originalSelectedLabelIds length > selectedLabelIds length => one or more labels have been deselected => find and flag as label to remove
    // if originalSelectedLabelIds length < selectedLabelIdslength  => one or more labels have been selected => find and flag as label to add

    let labelsToAdd = [];
    let labelsToRemove = [];

    if (originalSelectedLabelIds.length > selectedLabelIds.length) {
      labelsToRemove = originalSelectedLabelIds.filter(
        (id) => !selectedLabelIds.includes(id)
      );

      if (labelsToRemove.length === originalSelectedLabelIds.length) {
        // if i deselected all original labels and select new ones,
        // the selected ones are labels to be added
        labelsToAdd = selectedLabelIds;
      }
    } else {
      labelsToAdd = selectedLabelIds.filter(
        (id) => !originalSelectedLabelIds.includes(id)
      );
    }

    try {
      unwrapResult(
        await bulkUpdateAthleteLabels({
          athleteIds: selectedAthleteIds.map(({ id }) => id),
          labelsToAdd,
          labelsToRemove,
        })
      );

      dispatch(onUpdateOriginalSelectedLabelIds(selectedLabelIds));
      handleRefetchData();
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

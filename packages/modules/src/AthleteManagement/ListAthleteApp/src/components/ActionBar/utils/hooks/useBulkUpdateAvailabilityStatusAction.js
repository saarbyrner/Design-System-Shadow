// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import {
  onUpdateOriginalStatus,
  onUpdateSelectedStatus,
  onUpdateSelectedAthleteIds,
} from '@kitman/modules/src/AthleteManagement/shared/redux/slices/athleteManagementSlice';
import {
  getSelectedAvailabilityStatus,
  getOriginalStatus,
} from '@kitman/modules/src/AthleteManagement/shared/redux/selectors';

import type { Translation } from '@kitman/common/src/types/i18n';
import { useBulkUpdateAthleteAvailabilityStatusMutation } from '@kitman/modules/src/AthleteManagement/shared/redux/services';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { SelectedAthleteIds } from '../types';
import { getAllAvailabilityStatuses } from '../redux/services/AvailabilityStatusApi';

const BULK_UPDATE_AVAILABILITY_STATUS_ERROR_TOAST_ID =
  'BULK_UPDATE_AVAILABILITY_STATUS_ERROR_TOAST_ID';

type useBulkUpdateAvailabilityStatusType = {
  selectedAthleteIds: SelectedAthleteIds,
  handleRefetchData: () => void,
  t: Translation,
};

export const useBulkUpdateAvailabilityStatusAction = ({
  selectedAthleteIds,
  handleRefetchData,
  t,
}: useBulkUpdateAvailabilityStatusType) => {
  const dispatch = useDispatch();
  const selectedStatus = useSelector(getSelectedAvailabilityStatus);
  const originalStatus = useSelector(getOriginalStatus);
  const [statusOptions, setStatusOptions] = useState<Array<string>>([]);
  const [statusDataFetching, setStatusDataFetching] = useState(false);

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: BULK_UPDATE_AVAILABILITY_STATUS_ERROR_TOAST_ID,
    successToastId: '',
  });

  const [
    bulkUpdateAthleteAvailabilityStatus,
    { isLoading: isBulkUpdateAvailabilityStatuLoading },
  ]: [bulkUpdateAthleteAvailabilityStatus, { isLoading: boolean }] =
    useBulkUpdateAthleteAvailabilityStatusMutation();

  useEffect(() => {
    if (statusOptions.length === 0) {
      setStatusDataFetching(true);
      getAllAvailabilityStatuses().then((data) => {
        setStatusOptions(data);
        setStatusDataFetching(false);
      });
    }
  }, [statusOptions]);

  const handleAvailabilityStatusChange = (newStatus?: string) => {
    dispatch(onUpdateSelectedStatus(newStatus));
  };

  const handleBulkUpdateAvailabilityStatus = async () => {
    const athleteValues = selectedAthleteIds.map(({ id }) => ({
      athlete_id: id,
      value: selectedStatus,
    }));

    const prepareBulkUpdateObject = {
      athlete_profile_variables: [
        {
          perma_id: 'athlete_game_status',
          athlete_values: athleteValues,
        },
      ],
    };

    try {
      unwrapResult(
        await bulkUpdateAthleteAvailabilityStatus(prepareBulkUpdateObject)
      );

      showSuccessToast({
        translatedTitle: t(
          'Successfully assigned availability status to {{selectedAthletesNumber}} {{athleteText}}',
          {
            selectedAthletesNumber: selectedAthleteIds.length,
            athleteText:
              selectedAthleteIds.length === 1 ? 'athlete' : 'athletes',
          }
        ),
      });

      dispatch(onUpdateOriginalStatus(selectedStatus));
      dispatch(onUpdateSelectedAthleteIds([]));

      handleRefetchData();
    } catch {
      showErrorToast({
        translatedTitle: t(
          'Failed to update availability status. Please try again'
        ),
      });
    }
  };

  return {
    handleBulkUpdateAvailabilityStatus,
    handleAvailabilityStatusChange,
    isBulkUpdateAvailabilityStatuLoading,
    selectedStatus,
    originalStatus,
    statusOptions,
    statusDataFetching,
  };
};

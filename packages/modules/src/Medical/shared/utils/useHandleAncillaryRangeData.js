/* eslint-disable camelcase */
// @flow
import { useState } from 'react';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import i18n from '@kitman/common/src/utils/i18n';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';
import { useSaveAncillaryRangeMutation } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';

// Types
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { ToastId } from '@kitman/components/src/types';
import type { RequestStatus } from '@kitman/common/src/types';

type AncillaryRangeValues = {
  movementType: string,
  start_date: Date | null,
  end_date: Date | null,
};

type AthleteId = number;
const submittingToastId = 'ancillaryDateSubmitting';
const errorToastId = 'ancillaryDateError';
const successToastId = 'ancillaryDateAdded';

const useHandleAncillaryRangeData = () => {
  const { toasts, toastDispatch } = useToasts();
  const [saveAncillaryRange] = useSaveAncillaryRangeMutation();
  const [ancillaryStatus, setAncillaryStatus] = useState<RequestStatus>(null);

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const closeAllToasts = () => {
    closeToast(submittingToastId);
    closeToast(errorToastId);
    closeToast(successToastId);
  };

  const handleAncillaryRangeData = (
    ancillaryRangeValues: AncillaryRangeValues,
    athleteId: AthleteId,
    athleteData: AthleteData
  ) => {
    const { movementType, start_date, end_date } = ancillaryRangeValues;
    setAncillaryStatus('PENDING');
    closeAllToasts();
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: submittingToastId,
        title: i18n.t('Submitting Ancillary Date...'),
        status: 'LOADING',
      },
    });
    saveAncillaryRange({
      athleteId,
      movementType,
      start_date,
      end_date,
    })
      .unwrap()
      .then(() => {
        closeAllToasts();

        const successDescription = i18n.t(
          'Ancillary date added successfully for {{fullname}}',
          { fullname: athleteData.fullname }
        );
        toastDispatch({
          type: 'CREATE_TOAST',
          toast: {
            id: successToastId,
            title: i18n.t('Ancillary Date Added'),
            description: successDescription,
            status: 'SUCCESS',
          },
        });
        setAncillaryStatus('SUCCESS');
      })
      .catch((error) => {
        closeAllToasts();

        let errorDescription = i18n.t(
          'Failed to add ancillary date for {{fullname}}',
          { fullname: athleteData.fullname }
        );

        if (
          error &&
          error.status === statusCodes.unprocessableEntity &&
          Array.isArray(error.error) &&
          error.error.length > 0
        ) {
          errorDescription = error.error[error.error.length - 1];
        }
        setAncillaryStatus('FAILURE');
        toastDispatch({
          type: 'CREATE_TOAST',
          toast: {
            id: errorToastId,
            title: i18n.t('Error Adding Ancillary Date'),
            description: errorDescription,
            status: 'ERROR',
          },
        });
      });
  };

  return { handleAncillaryRangeData, closeToast, toasts, ancillaryStatus };
};

export default useHandleAncillaryRangeData;

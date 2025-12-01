// @flow
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import {
  archiveMedication,
  getArchiveMedicationReasons,
} from '@kitman/services';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import { ArchiveMedicationModalTranslated as ArchiveMedicationModal } from '..';

type Props = {
  athleteId: number | null,
  medicationId: number | null,
  isOpen: boolean,
  onClose: Function,
  onReloadData: Function,
};

const ArchiveMedicationModalContainer = (props: Props) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const isMountedCheck = useIsMountedCheck();
  const [archiveModalOptions, setArchiveModalOptions] = useState([]);

  /**
   * Check for component mounted state to prevent memory leak console warning
   * Fetch archive reasons, format object to use in react-select (label, value)
   */
  useEffect(() => {
    getArchiveMedicationReasons()
      .then((reasons) => {
        if (!isMountedCheck()) return;

        const modalOptions = reasons.map((option) => {
          return {
            label: option.name,
            value: option.id,
          };
        });

        setArchiveModalOptions(modalOptions);
      })
      .catch(() => setRequestStatus('FAILURE'));
  }, []);

  const onArchiveMedication = (medicationId, reason) => {
    dispatch(
      addToast({
        title: 'Archiving Medication',
        status: 'LOADING',
        id: medicationId,
      })
    );

    return archiveMedication(medicationId, reason)
      .then((data) => {
        setRequestStatus('SUCCESS');
        dispatch(
          updateToast(medicationId, {
            title: 'Medication archived successfully',
            status: 'SUCCESS',
          }),
          setTimeout(() => dispatch(removeToast(data.id)), 4000)
        );
        props.onClose();
        props.onReloadData();
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        dispatch(
          updateToast(medicationId, {
            title: 'Error archiving medication',
            status: 'ERROR',
          })
        );
        setTimeout(() => {
          dispatch(removeToast(medicationId));
        }, 4000);
        props.onClose();
      });
  };

  return (
    <ArchiveMedicationModal
      {...props}
      athleteId={props.athleteId}
      medicationId={props.medicationId}
      onArchiveMedication={onArchiveMedication}
      archiveModalOptions={archiveModalOptions}
    />
  );
};

export default ArchiveMedicationModalContainer;

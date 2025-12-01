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
  archiveDiagnostic,
  getArchiveMedicalNoteReasons as getArchiveDiagnosticReasons,
} from '@kitman/services';

import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import { ArchiveDiagnosticModalTranslated as ArchiveDiagnosticModal } from '..';

type Props = {
  athleteId: number | null,
  diagnosticId: number | null,
  isOpen: boolean,
  onClose: Function,
  onReloadData: Function,
};

const ArchiveDiagnosticModalContainer = (props: Props) => {
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
    getArchiveDiagnosticReasons()
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

  const onArchiveDiagnostic = (athleteId, diagnosticId, reason) => {
    dispatch(
      addToast({
        title: 'Archiving Diagnostic',
        status: 'LOADING',
        id: diagnosticId,
      })
    );

    return archiveDiagnostic(athleteId, diagnosticId, reason)
      .then((data) => {
        setRequestStatus('SUCCESS');
        dispatch(
          updateToast(diagnosticId, {
            title: 'Diagnostic archived successfully',
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
          updateToast(diagnosticId, {
            title: 'Error archiving diagnostic',
            status: 'ERROR',
          })
        );
        setTimeout(() => {
          dispatch(removeToast(diagnosticId));
        }, 4000);
        props.onClose();
      });
  };

  return (
    <ArchiveDiagnosticModal
      {...props}
      athleteId={props.athleteId}
      diagnosticId={props.diagnosticId}
      onArchiveDiagnostic={onArchiveDiagnostic}
      archiveModalOptions={archiveModalOptions}
    />
  );
};

export default ArchiveDiagnosticModalContainer;

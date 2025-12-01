// @flow
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';

import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import {
  getArchiveMedicalNoteReasons,
  archiveMedicalNote,
} from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import { ArchiveNoteModalTranslated as ArchiveNoteModal } from '..';

type Props = {
  note: MedicalNote,
  isOpen: boolean,
  onClose: Function,
  onReloadData: Function,
};

const ArchiveNoteContainer = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const isMountedCheck = useIsMountedCheck();
  const [archiveModalOptions, setArchiveModalOptions] = useState([]);
  const { trackEvent } = useEventTracking();

  /**
   * Check for component mounted state to prevent memory leak console warning
   * Fetch archive reasons, format object to use in react-select (label, value)
   */
  useEffect(() => {
    getArchiveMedicalNoteReasons()
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

  /**
   * Run archiveNote service; if data.id exists, API response should be successful,
   * so continue with Toast rendering, otherwise catch err
   */
  const onArchiveNote = async (note: MedicalNote, reason: number) => {
    dispatch(
      addToast({
        title: props.t('Archiving Note'),
        status: 'LOADING',
        id: note.id,
      })
    );
    try {
      const data = await archiveMedicalNote(note, reason);
      if (data.id) {
        trackEvent(
          performanceMedicineEventNames.archivedMedicalNote,
          determineMedicalLevelAndTab()
        );
        setRequestStatus('SUCCESS');
        dispatch(
          updateToast(data.id, {
            title: props.t('Note archived successfully'),
            status: 'SUCCESS',
          }),
          setTimeout(() => dispatch(removeToast(data.id)), 4000)
        );
        props.onClose();
        props.onReloadData();
      }
    } catch (err) {
      setRequestStatus('FAILURE');
      dispatch(
        updateToast(note.id, {
          title: props.t('Error archiving note'),
          status: 'ERROR',
        })
      );
      setTimeout(() => {
        dispatch(removeToast(note.id));
      }, 4000);
      props.onClose();
    }
  };

  return (
    <ArchiveNoteModal
      {...props}
      onArchiveNote={onArchiveNote}
      archiveModalOptions={archiveModalOptions}
    />
  );
};

export const ArchiveNoteContainerTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveNoteContainer);
export default ArchiveNoteContainer;

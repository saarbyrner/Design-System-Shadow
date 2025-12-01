// @flow
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';

import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import { archiveProcedure, getArchiveReasons } from '@kitman/services';

import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ArchiveProcedureModalTranslated as ArchiveProcedureModal } from '..';

type Props = {
  procedureId: number | null,
  isOpen: boolean,
  onClose: Function,
  onReloadData: Function,
};

const ArchiveProcedureModalContainer = (props: I18nProps<Props>) => {
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
    getArchiveReasons('procedures')
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

  const onArchiveProcedure = (procedureId: number, reason: number) => {
    dispatch(
      addToast({
        title: props.t('Archiving Procedure'),
        status: 'LOADING',
        id: procedureId,
      })
    );

    return archiveProcedure(procedureId, reason)
      .then((data) => {
        setRequestStatus('SUCCESS');
        dispatch(
          updateToast(procedureId, {
            title: props.t('Procedure archived successfully'),
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
          updateToast(procedureId, {
            title: props.t('Error archiving procedure'),
            status: 'ERROR',
          })
        );
        setTimeout(() => {
          dispatch(removeToast(procedureId));
        }, 4000);
        props.onClose();
      });
  };

  return (
    <ArchiveProcedureModal
      {...props}
      procedureId={props.procedureId}
      onArchiveProcedure={onArchiveProcedure}
      archiveModalOptions={archiveModalOptions}
    />
  );
};

export const ArchiveProcedureModalContainerTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveProcedureModalContainer);

export default ArchiveProcedureModalContainer;

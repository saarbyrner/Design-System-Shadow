// @flow
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';

import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import { deleteDiagnosticAttachment } from '@kitman/services';

import { DeleteAttachmentModalTranslated as DeleteAttachmentModal } from '@kitman/modules/src/DeleteAttachmentModal/index';

type Props = {
  diagnosticId: number,
  attachmentId: number,
  attachmentTitle: string,
  isOpen: boolean,
  onClose: Function,
  onReloadData: Function,
};

const DeleteAttachmentModalContainer = (props: Props) => {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');

  const onDeleteAttachment = () => {
    dispatch(
      addToast({
        title: 'Deleting Attachment',
        status: 'LOADING',
        id: props.attachmentId,
      })
    );

    return deleteDiagnosticAttachment(props.diagnosticId, props.attachmentId)
      .then((data) => {
        setRequestStatus('SUCCESS');
        dispatch(
          updateToast(props.attachmentId, {
            title: 'Attachment deleted successfully',
            status: 'SUCCESS',
          }),
          setTimeout(() => dispatch(removeToast(data.id)), 4000)
        );
        props.onClose();
        props.onReloadData(data.id);
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        dispatch(
          updateToast(props.attachmentId, {
            title: 'Error deleting attachment',
            status: 'ERROR',
          })
        );
        setTimeout(() => {
          dispatch(removeToast(props.attachmentId));
        }, 4000);
        props.onClose();
      });
  };

  return (
    <DeleteAttachmentModal
      {...props}
      attachmentTitle={props.attachmentTitle}
      onDeleteAttachment={onDeleteAttachment}
    />
  );
};

export default DeleteAttachmentModalContainer;

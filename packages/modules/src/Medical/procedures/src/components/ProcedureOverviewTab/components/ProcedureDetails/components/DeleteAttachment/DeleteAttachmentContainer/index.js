// @flow
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';

import {
  addToast,
  updateToast,
  removeToast,
} from '@kitman/modules/src/Medical/shared/redux/actions';
import { deleteProcedureAttachment } from '@kitman/services';

import { DeleteAttachmentModalTranslated as DeleteAttachmentModal } from '@kitman/modules/src/DeleteAttachmentModal/index';

type Props = {
  procedureId: number,
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

    return deleteProcedureAttachment(props.procedureId, props.attachmentId)
      .then(() => {
        setRequestStatus('SUCCESS');
        dispatch(
          updateToast(props.attachmentId, {
            title: 'Attachment deleted successfully',
            status: 'SUCCESS',
          }),
          setTimeout(() => dispatch(removeToast(props.attachmentId)), 4000)
        );
        props.onClose();
        props.onReloadData(props.attachmentId);
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

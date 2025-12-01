// @flow
import { withNamespaces } from 'react-i18next';
import { useState, type ComponentType, type Node } from 'react';

import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import ToastDialog from '@kitman/components/src/Toast/KitmanDesignSystem/ToastDialog';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Toast, ToastId } from '@kitman/components/src/types';
import type { OnUpdateEventDetails } from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import { AddAttachmentsTranslated as AddAttachments } from './common/AddAttachments';
import { PreviousUploadsTranslated as PreviousUploads } from './common/PreviousUploads';
import DeleteAttachmentModalContainer from './common/DeleteAttachment/DeleteAttachmentContainer';
import style from '../style';
import { ATTACHMENT_DELETE_TYPE } from './utils/enum-likes';
import type { EventFormData } from '../types';
import type { AttachmentDeleteType } from './utils/types';

const separatorStyle = [style.separator, style.separatorMargin];

const renderAreaWithStyles = (label: string, component: Node) => (
  <>
    <div css={separatorStyle} />
    <div css={style.noGap}>
      <div css={style.labelText}>{label}</div>
      {component}
    </div>
  </>
);

type Props = {
  event: EventFormData,
  onUpdateEventDetails: OnUpdateEventDetails,
  isPanelModeEdit: boolean,
  isAttachmentsDisabled?: boolean,
};

export type TranslatedProps = I18nProps<Props>;

const EventAttachments = ({
  t,
  event,
  isAttachmentsDisabled,
  isPanelModeEdit,
  onUpdateEventDetails,
}: TranslatedProps) => {
  const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] =
    useState<boolean>(false);
  const [attachmentTitle, setAttachmentTitle] = useState<string>('');
  const [attachmentIdToDelete, setAttachmentIdToDelete] = useState<number>(-1);
  const [deleteType, setDeleteType] = useState<AttachmentDeleteType>(
    ATTACHMENT_DELETE_TYPE.ATTACHMENT
  );

  const { toasts, toastDispatch } = useToasts();

  const { attached_links: attachedLinks, attachments } = event;

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  const handleToastDispatch = (type: string, toast: Toast) => {
    switch (type) {
      case 'CREATE':
        toastDispatch({ type: 'CREATE_TOAST', toast });
        break;
      case 'UPDATE':
        toastDispatch({ type: 'UPDATE_TOAST', toast });
        break;
      default:
    }
  };

  const onDeleteStart = (fileId: ToastId, fileName: string) =>
    handleToastDispatch('CREATE', {
      id: fileId,
      title: t('Deleting {{filename}}...', {
        filename: fileName,
      }),
      status: 'LOADING',
    });

  const onDeleteSuccess = (fileId: ToastId, fileName: string) =>
    handleToastDispatch('UPDATE', {
      id: fileId,
      title: t('{{filename}} deleted successfully', {
        filename: fileName,
      }),
      status: 'SUCCESS',
    });

  const onDeleteFailure = (fileId: ToastId, fileName: string) =>
    handleToastDispatch('UPDATE', {
      id: fileId,
      title: t('{{filename}} deletion failed', {
        filename: fileName,
      }),
      status: 'ERROR',
    });

  // we should only display previous uploads if there are confirmed attachments, or attached links
  const eventHasConfirmedAttachments = attachments?.some(
    ({ attachment }) => attachment.confirmed === true
  );

  const shouldDisplayPreviousUploads =
    eventHasConfirmedAttachments || (attachedLinks && attachedLinks.length > 0);

  return (
    <>
      {isPanelModeEdit &&
        shouldDisplayPreviousUploads &&
        renderAreaWithStyles(
          t('Uploads'),
          <PreviousUploads
            event={event}
            onOpenDeleteAttachmentModal={({ title, id, type }) => {
              setAttachmentIdToDelete(id);
              setAttachmentTitle(title);
              setDeleteType(type);
              setDeleteAttachmentModalOpen(true);
            }}
          />
        )}
      {/* if the FF is on, we want to hide this functionality when the prop is enabled (in the TSO sympbiosis section for now) */}
      {!isAttachmentsDisabled &&
        renderAreaWithStyles(
          t('Attach'),
          <AddAttachments
            onUpdateEventDetails={onUpdateEventDetails}
            event={event}
            acceptedFileTypeCode="default"
          />
        )}
      <DeleteAttachmentModalContainer
        isOpen={deleteAttachmentModalOpen}
        titleToDelete={attachmentTitle}
        idToDelete={attachmentIdToDelete}
        deleteType={deleteType}
        event={event}
        onUpdateEventDetails={onUpdateEventDetails}
        onClose={() => setDeleteAttachmentModalOpen(false)}
        onDeleteStart={onDeleteStart}
        onDeleteSuccess={onDeleteSuccess}
        onDeleteFailure={onDeleteFailure}
      />
      <ToastDialog toasts={toasts} onCloseToast={closeToast} />
    </>
  );
};

export const EventAttachmentsTranslated: ComponentType<Props> =
  withNamespaces()(EventAttachments);
export default EventAttachments;

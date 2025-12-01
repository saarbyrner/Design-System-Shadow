// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Modal, Select, TextButton } from '@kitman/components';
import type {
  SelectOption as Option,
  ToastDispatch,
  Toast,
} from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';
import { archiveAttachment } from '@kitman/services';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onClose: Function,
  archiveModalOptions: Array<Option>,
  attachment: Attachment,
  onArchiveComplete: Function,
  toastAction: ToastDispatch<ToastAction>,
  toasts: Array<Toast>,
};

const ArchiveAttachmentModal = (props: I18nProps<Props>) => {
  const [archiveReason, setArchiveReason] = useState<number>(0);

  const removeToast = () => {
    props.toastAction({
      type: 'REMOVE_TOAST_BY_ID',
      id: props.attachment.id,
    });
  };

  const closeModal = () => {
    setArchiveReason(0);
    props.onClose();
    removeToast();
  };

  const archiveRequestSuccessful = () => {
    const message = props.t('archived successfully');
    closeModal();
    props.onArchiveComplete();
    props.toastAction({
      type: 'UPDATE_TOAST',
      toast: {
        id: props.attachment.id,
        title: `${props.attachment.name} - ${message}`,
        status: 'SUCCESS',
      },
    });
  };

  const archiveRequestError = () => {
    const message = props.t('not archived');
    props.toastAction({
      type: 'UPDATE_TOAST',
      toast: {
        id: props.attachment.id,
        title: `${props.attachment.name} - ${message}`,
        description: props.t(
          'There was an error while archiving this document'
        ),
        links: [
          {
            id: 1,
            text: props.t('Try again'),
            link: '#',
            withHashParam: true,
            metadata: {
              action: 'RETRY_REQUEST',
            },
          },
        ],
        status: 'ERROR',
      },
    });
  };

  const makeArchiveIssueRequest = async () => {
    if (props.attachment?.id != null) {
      props.toastAction({
        type: 'CREATE_TOAST',
        toast: {
          id: props.attachment.id,
          title: props.attachment.name || '',
          status: 'LOADING',
        },
      });

      try {
        await archiveAttachment(props.attachment.id, archiveReason);
        archiveRequestSuccessful();
      } catch (err) {
        archiveRequestError();
      }
    }
  };

  const onClickToastLink = (toastLink) => {
    if (toastLink?.metadata?.action === 'RETRY_REQUEST') {
      removeToast();
      makeArchiveIssueRequest();
    }
  };

  return (
    <>
      <Modal
        isOpen={props.isOpen}
        onPressEscape={closeModal}
        onClose={closeModal}
      >
        <Modal.Header>
          <Modal.Title>{props.t('Archive Attachment')}</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p>
            {props.t(
              'Please provide the reason why this attachment is being archived'
            )}
          </p>

          <Select
            label={props.t('Reason for archiving:')}
            options={props.archiveModalOptions}
            onChange={setArchiveReason}
            value={archiveReason}
            menuPosition="fixed"
            appendToBody
          />
        </Modal.Content>
        <Modal.Footer>
          <TextButton
            text={props.t('Cancel')}
            onClick={closeModal}
            type="subtle"
            isDisabled={false}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Archive')}
            type="primaryDestruct"
            onClick={makeArchiveIssueRequest}
            isDisabled={!archiveReason}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
      <ToastDialog
        toasts={props.toasts}
        onClickToastLink={onClickToastLink}
        onCloseToast={removeToast}
      />
    </>
  );
};

export const ArchiveAttachmentModalTranslated: ComponentType<Props> =
  withNamespaces()(ArchiveAttachmentModal);
export default ArchiveAttachmentModal;

// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onClose: Function,
  attachmentTitle: string,
  onDeleteAttachment: Function,
};

const DeleteAttachment = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onClose}
      onClose={props.onClose}
      width="small"
      overlapSidePanel
    >
      <Modal.Header>
        <Modal.Title>{props.t(`Delete ${props.attachmentTitle}?`)}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p css={{ whiteSpace: 'pre-line' }}>
          {props.t(
            'Do you really want to delete this attachment? \n This process cannot be undone.'
          )}
        </p>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={() => props.onClose()}
          type="subtle"
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Delete')}
          type="primaryDestruct"
          onClick={() => {
            props.onDeleteAttachment();
          }}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const DeleteAttachmentModalTranslated: ComponentType<Props> =
  withNamespaces()(DeleteAttachment);
export default DeleteAttachment;

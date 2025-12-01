// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import { type I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  open: boolean,
  modalTitle: string,
  modalContent: string,
  primaryButtonText: string,
  onPrimaryAction: Function,
  onCancel: Function,
};

const ConfirmationModal = (props: I18nProps<Props>) => {
  return (
    <Modal isOpen={props.open} onPressEscape={props.onCancel}>
      <Modal.Header>
        <Modal.Title>{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>{props.modalContent}</p>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          type="subtle"
          onClick={props.onCancel}
          kitmanDesignSystem
        />
        <TextButton
          text={props.primaryButtonText}
          type="primary"
          onClick={props.onPrimaryAction}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export const ConfirmationModalTranslated: ComponentType<Props> =
  withNamespaces()(ConfirmationModal);
export default ConfirmationModal;

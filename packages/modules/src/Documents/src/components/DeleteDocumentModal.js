// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isDeleteModalShown: boolean,
  getDeletableDocumentName: () => string,
  onDeleteDocument: () => void,
  closeModal: () => void,
};

const DeleteDocumentModal = (props: I18nProps<Props>) => (
  <Modal
    isOpen={props.isDeleteModalShown}
    onPressEscape={props.closeModal}
    width="large"
  >
    <Modal.Header>
      <Modal.Title>
        {props.t('Delete {{fileName}}', {
          fileName: props.getDeletableDocumentName(),
        })}
      </Modal.Title>
    </Modal.Header>
    <Modal.Content>
      <p>{props.t('This action cannot be undone')}</p>
    </Modal.Content>
    <Modal.Footer>
      <TextButton
        text={props.t('Cancel')}
        type="subtle"
        kitmanDesignSystem
        onClick={props.closeModal}
      />
      <TextButton
        text={props.t('Destruct')}
        type="primaryDestruct"
        kitmanDesignSystem
        onClick={props.onDeleteDocument}
      />
    </Modal.Footer>
  </Modal>
);

export const DeleteDocumentModalTranslated: ComponentType<Props> =
  withNamespaces()(DeleteDocumentModal);
export default DeleteDocumentModal;

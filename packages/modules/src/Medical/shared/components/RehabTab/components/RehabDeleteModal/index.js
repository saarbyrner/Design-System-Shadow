// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { Modal, TextButton } from '@kitman/components';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

type Props = {
  isOpen: boolean,
  deleteTitle: string,
  deleteContent: string,
  onConfirmDelete: Function,
  onCancelDelete: Function,
};

const RehabItemDeleteModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={() => props.onCancelDelete()}
      close={() => props.onCancelDelete()}
    >
      <Modal.Header>
        <Modal.Title>{props.deleteTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        <p>{props.deleteContent}</p>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={i18n.t('Cancel')}
          onClick={props.onCancelDelete}
          kitmanDesignSystem
        />
        <TextButton
          text={i18n.t('Delete')}
          type="primary"
          onClick={() => {
            props.onConfirmDelete();
          }}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};
export const RehabItemDeleteModalTranslated: ComponentType<Props> =
  withNamespaces()(RehabItemDeleteModal);
export default RehabItemDeleteModal;

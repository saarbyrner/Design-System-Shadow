// @flow
import type { Node } from 'react';
import { Modal, TextButton } from '@kitman/components';
import { css } from '@emotion/react';

export type GameEventsModalType = {
  isOpen: boolean,
  title: string,
  content: string | Node,
  cancelButtonText: string,
  confirmButtonText: string,
  onCancel: Function,
  onClose: Function,
  onConfirm: Function,
  onPressEscape: Function,
};

const GameEventsModal = (props: GameEventsModalType) => {
  const {
    isOpen,
    title,
    content,
    cancelButtonText,
    confirmButtonText,
    onCancel,
    onClose,
    onConfirm,
    onPressEscape,
  } = props;

  return (
    <Modal
      isOpen={isOpen}
      onPressEscape={onPressEscape}
      outsideClickCloses
      close={onClose}
      width="x-large"
      overlapSidePanel
      additionalStyle={css`
        max-height: 90vh;
        width: auto;
        min-width: 500px;
      `}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Footer>
        <TextButton
          testId="cancel-button"
          text={cancelButtonText}
          onClick={onCancel}
          kitmanDesignSystem
        />
        <TextButton
          testId="confirm-button"
          text={confirmButtonText}
          size="small"
          type="primary"
          onClick={onConfirm}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default GameEventsModal;

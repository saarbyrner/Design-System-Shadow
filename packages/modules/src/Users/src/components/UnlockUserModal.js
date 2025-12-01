// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { css } from '@emotion/react';
import { Modal, TextButton } from '@kitman/components';

type UnlockUserModalProps = {
  isOpen: boolean,
  onUnlock?: Function,
  onCancel?: Function,
};

const UnlockUserModal = (props: UnlockUserModalProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onPressEscape={props.onCancel}
      close={props.onCancel}
      width="x-large"
      overlapSidePanel
      additionalStyle={css`
        max-height: 90vh;
        width: auto;
        min-width: 500px;
      `}
    >
      <Modal.Header>
        <Modal.Title>{i18n.t('Unlock this account')}</Modal.Title>
      </Modal.Header>
      <Modal.Content
        additionalStyle={css`
          padding: 24px;
        `}
      >
        {i18n.t(
          'This user has entered an incorrect account name or password more than 3 times.'
        )}
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={i18n.t('Cancel')}
          type="secondary"
          onClick={props.onCancel}
          kitmanDesignSystem
        />
        <TextButton
          text={i18n.t('Unlock account')}
          type="primary"
          onClick={props.onUnlock}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default UnlockUserModal;

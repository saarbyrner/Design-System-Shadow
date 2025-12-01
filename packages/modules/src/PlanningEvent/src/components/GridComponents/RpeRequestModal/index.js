// @flow
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  openModal: boolean,
  setOpenModal: Function,
  sendNotifications: Function,
};

const RpeRequestModal = (props: I18nProps<Props>) => {
  return (
    <Modal
      isOpen={props.openModal}
      close={() => props.setOpenModal(false)}
      onPressEscape={() => props.setOpenModal(false)}
      overlapSidePanel
    >
      <Modal.Header>
        <Modal.Title>{props.t('Send RPE Request')}</Modal.Title>
      </Modal.Header>

      <Modal.Content className="find-me">
        <div>
          {props.t('An RPE request was sent within the last 30 minutes.')}
        </div>
        <div>{props.t('Send another RPE request?')}</div>
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          onClick={() => props.setOpenModal(false)}
          text={props.t('Cancel')}
          type="subtle"
          kitmanDesignSystem
          testId="rpeRequestModal__cancelButton"
        />
        <TextButton
          onClick={() => {
            props.sendNotifications();
            props.setOpenModal(false);
          }}
          text={props.t('Send')}
          type="primary"
          kitmanDesignSystem
          testId="rpeRequestModal__sendButton"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default RpeRequestModal;
export const RpeRequestModalTranslated = withNamespaces()(RpeRequestModal);

// @flow
import { Modal, TextButton } from '@kitman/components';
import type { Attachment } from '@kitman/common/src/types/Annotation';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  openModal: boolean,
  setOpenModal: Function,
  exampleFile: Attachment,
};

const DocumentExampleModal = (props: I18nProps<Props>) => {
  const { t, openModal, setOpenModal, exampleFile } = props;

  return (
    <div data-testid="RegistrationForm|DocumentExampleModal">
      <Modal
        isOpen={openModal}
        close={() => setOpenModal(false)}
        onPressEscape={() => setOpenModal(false)}
      >
        <Modal.Header>
          <Modal.Title>{exampleFile?.filename}</Modal.Title>
        </Modal.Header>

        <Modal.Content className="find-me" />
        <Modal.Footer>
          <TextButton
            text={t('Close')}
            onClick={() => setOpenModal(false)}
            kitmanDesignSystem
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DocumentExampleModal;

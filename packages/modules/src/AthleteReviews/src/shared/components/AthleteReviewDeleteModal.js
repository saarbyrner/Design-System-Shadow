// @flow
import { withNamespaces } from 'react-i18next';
import { Modal, TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  deleteTitle: string,
  deleteDescription: string,
  onDelete: () => void,
  closeModal: () => void,
};

const AthleteReviewDeleteModal = ({
  isOpen,
  deleteTitle,
  deleteDescription,
  onDelete,
  closeModal,
  t,
}: I18nProps<Props>) => {
  return (
    <Modal onPressEscape={closeModal} isOpen={isOpen} close={closeModal}>
      <Modal.Header>
        <Modal.Title>{deleteTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Content>{deleteDescription}</Modal.Content>

      <Modal.Footer>
        <TextButton
          text={t('Cancel')}
          onClick={closeModal}
          kitmanDesignSystem
        />
        <TextButton
          text={t('Delete')}
          type="destruct"
          onClick={() => {
            onDelete();
            closeModal();
          }}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default AthleteReviewDeleteModal;
export const AthleteReviewDeleteModalTranslated = withNamespaces()(
  AthleteReviewDeleteModal
);

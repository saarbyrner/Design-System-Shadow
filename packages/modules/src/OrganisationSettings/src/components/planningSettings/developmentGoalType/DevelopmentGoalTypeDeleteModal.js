// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Modal, TextButton } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onDelete: Function,
  onClose: Function,
};

const DevelopmentGoalTypeDeleteModal = (props: I18nProps<Props>) => {
  const onDelete = () => {
    TrackEvent('Org Settings Planning', 'Delete', 'Development goal type');
    props.onDelete();
  };

  return (
    <Modal
      onPressEscape={props.onClose}
      isOpen={props.isOpen}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Delete development goal type?')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>{props.t('This cannot be undone')}</Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          type="subtle"
          onClick={props.onClose}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Delete')}
          type="primaryDestruct"
          onClick={onDelete}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default DevelopmentGoalTypeDeleteModal;
export const DevelopmentGoalTypeDeleteModalTranslated: ComponentType<Props> =
  withNamespaces()(DevelopmentGoalTypeDeleteModal);

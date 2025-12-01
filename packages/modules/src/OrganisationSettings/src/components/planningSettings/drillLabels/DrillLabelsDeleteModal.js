// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Modal, TextButton } from '@kitman/components';
import type { DeletionAvailability } from '@kitman/common/src/types/DeletionAvailability';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  deletionAvailability: DeletionAvailability,
  onDelete: Function,
  onClose: Function,
};

const DrillLabelsDeleteModal = (props: I18nProps<Props>) => {
  const isDeletionAvailable = props.deletionAvailability.ok;
  const drillLabelText =
    props.deletionAvailability.activities_count >= 2
      ? props.t('drills')
      : props.t('drill');

  const onDelete = () => {
    props.onDelete();
  };

  return (
    <Modal
      onPressEscape={props.onClose}
      isOpen={props.isOpen}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Delete drill label?')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {isDeletionAvailable ? (
          <p>{props.t('This cannot be undone')}</p>
        ) : (
          <>
            <p>
              {props.t('This drill label is associated with ')}
              <span>
                {`${props.deletionAvailability.activities_count} ${drillLabelText}`}
              </span>
            </p>
            <p>
              {props.t(
                'To delete this drill label remove it from the associated drills.'
              )}
            </p>
          </>
        )}
      </Modal.Content>
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
          isDisabled={!isDeletionAvailable}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default DrillLabelsDeleteModal;
export const DrillLabelsDeleteModalTranslated: ComponentType<Props> =
  withNamespaces()(DrillLabelsDeleteModal);

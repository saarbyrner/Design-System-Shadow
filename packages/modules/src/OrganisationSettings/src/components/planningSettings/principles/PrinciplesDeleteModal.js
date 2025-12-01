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

const PrinciplesDeleteModal = (props: I18nProps<Props>) => {
  const isDeletionAvailable = props.deletionAvailability.ok;
  const activityText =
    props.deletionAvailability.activities_count >= 2
      ? props.t('activities')
      : props.t('activity');

  return (
    <Modal
      onPressEscape={props.onClose}
      isOpen={props.isOpen}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Delete principle?')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {isDeletionAvailable ? (
          <p>{props.t('This cannot be undone')}</p>
        ) : (
          <>
            <p>
              {props.t('This principle is associated with ')}
              <span>
                {`${props.deletionAvailability.activities_count} ${activityText}`}
              </span>
            </p>
            <p>
              {props.t(
                'To delete this principle remove it from the associated activities.'
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
          onClick={props.onDelete}
          isDisabled={!isDeletionAvailable}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );
};

export default PrinciplesDeleteModal;
export const PrinciplesDeleteModalTranslated: ComponentType<Props> =
  withNamespaces()(PrinciplesDeleteModal);

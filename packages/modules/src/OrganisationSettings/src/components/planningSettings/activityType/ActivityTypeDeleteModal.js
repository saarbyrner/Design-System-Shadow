// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';
import { Modal, TextButton } from '@kitman/components';
import { TrackEvent } from '@kitman/common/src/utils';
import type { DeletionAvailability } from '@kitman/common/src/types/DeletionAvailability';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  deletionAvailability: DeletionAvailability,
  onDelete: Function,
  onClose: Function,
};

const ActivityTypeDeleteModal = (props: I18nProps<Props>) => {
  const isDeletionAvailable = props.deletionAvailability.ok;
  const activityText =
    props.deletionAvailability.activities_count >= 2
      ? props.t('activities')
      : props.t('activity');

  const onDelete = () => {
    TrackEvent('Org Settings Planning', 'Delete', 'Activity type');
    props.onDelete();
  };

  return (
    <Modal
      onPressEscape={props.onClose}
      isOpen={props.isOpen}
      close={props.onClose}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Delete activity type?')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {isDeletionAvailable ? (
          <p>{props.t('This cannot be undone')}</p>
        ) : (
          <>
            <p>
              {props.t('This activity type is associated with ')}
              <span>
                {`${props.deletionAvailability.activities_count} ${activityText}`}
              </span>
            </p>
            <p>
              {props.t(
                'To delete this activity type remove it from the associated activities.'
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

export default ActivityTypeDeleteModal;
export const ActivityTypeDeleteModalTranslated: ComponentType<Props> =
  withNamespaces()(ActivityTypeDeleteModal);

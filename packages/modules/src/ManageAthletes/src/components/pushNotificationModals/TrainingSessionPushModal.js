// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { TextButton, Modal } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import sendNotifications from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/sendNotifications';
import type { NonCompliantAthletes } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useManageAthletes } from '../../contexts/manageAthletesContext';

export type IsActivityTypeCategoryEnabled = {
  value: boolean,
};

type Props = {
  onClickCloseModal: () => void,
  nonCompliantAthletes?: ?NonCompliantAthletes,
};

const TrainingSessionPushModal = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isRequestPending, setIsRequestPending] = useState(false);
  const context = useManageAthletes();
  const nonCompliantAthletesData =
    props.nonCompliantAthletes || context.nonCompliantAthletes;

  const nonCompliantAthletesCount =
    nonCompliantAthletesData?.session?.length || 0;
  const areThereNonCompliantAthletes = nonCompliantAthletesCount > 0;

  const onClickSendNotifications = (pushScope) => {
    setIsRequestPending(true);
    sendNotifications('training_session', pushScope)
      .then(() => {
        props.onClickCloseModal();
        dispatch(
          add({
            status: 'SUCCESS',
            title: props.t('Push Notifications Sent'),
          })
        );
      })
      .catch(() => {
        setIsRequestPending(false);
        dispatch(
          add({
            status: 'ERROR',
            title: props.t('Error sending push notifications'),
          })
        );
      });
  };

  return (
    <Modal
      isOpen
      onPressEscape={props.onClickCloseModal}
      width="small"
      close={props.onClickCloseModal}
    >
      <Modal.Header>
        <Modal.Title>
          {props.t('Individual Training Session Reminder')}
        </Modal.Title>
        <button
          type="button"
          onClick={props.onClickCloseModal}
          className="reactModal__closeBtn icon-close"
        />
      </Modal.Header>
      <Modal.Content>
        <p>
          {areThereNonCompliantAthletes
            ? props.t('{{count}} athlete have not entered an RPE today.', {
                count: nonCompliantAthletesCount,
              })
            : props.t('All athletes have added a training session today.')}
        </p>

        <p>{props.t('Send a push notification reminder to:')}</p>
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={props.onClickCloseModal}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Entire squad')}
          type="primary"
          onClick={() => onClickSendNotifications('entire_squad')}
          isDisabled={isRequestPending}
          kitmanDesignSystem
        />
        {areThereNonCompliantAthletes && (
          <TextButton
            text={props.t('No sessions entered')}
            type="primary"
            onClick={() => onClickSendNotifications('non_compliant_athletes')}
            isDisabled={isRequestPending}
            kitmanDesignSystem
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export const TrainingSessionPushModalTranslated: ComponentType<Props> =
  withNamespaces()(TrainingSessionPushModal);
export default TrainingSessionPushModal;

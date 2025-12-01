// @flow
import type { ComponentType } from 'react';
import { useState } from 'react';
import { TextButton, Modal } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { add } from '@kitman/modules/src/Toasts/toastsSlice';
import type { NonCompliantAthletes } from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/getNonCompliantAthletes';
import sendNotifications from '@kitman/modules/src/AthleteManagement/shared/redux/services/api/sendNotifications';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useManageAthletes } from '../../contexts/manageAthletesContext';

export type IsActivityTypeCategoryEnabled = {
  value: boolean,
};

type Props = {
  onClickCloseModal: () => void,
  nonCompliantAthletes?: ?NonCompliantAthletes,
};

const WellBeingPushModal = (props: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const [isRequestPending, setIsRequestPending] = useState(false);
  const context = useManageAthletes();
  const nonCompliantAthletesData =
    props.nonCompliantAthletes || context.nonCompliantAthletes;

  const nonCompliantAthletesCount =
    nonCompliantAthletesData?.wellbeing?.length || 0;
  const areThereNonCompliantAthletes = nonCompliantAthletesCount > 0;

  const onClickSendNotifications = () => {
    setIsRequestPending(true);
    sendNotifications('well-being')
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
        <Modal.Title>{props.t('Well-being Reminder')}</Modal.Title>
        <button
          type="button"
          onClick={props.onClickCloseModal}
          className="reactModal__closeBtn icon-close"
        />
      </Modal.Header>
      <Modal.Content>
        {areThereNonCompliantAthletes
          ? props.t(
              'Do you want to send a Well-being reminder notification to {{count}} athlete?',
              {
                count: nonCompliantAthletesCount,
              }
            )
          : props.t('All athletes have screened today')}
      </Modal.Content>
      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={props.onClickCloseModal}
          kitmanDesignSystem
        />
        {areThereNonCompliantAthletes && (
          <TextButton
            text={props.t('Send notification')}
            type="primary"
            onClick={() => onClickSendNotifications()}
            isDisabled={isRequestPending}
            kitmanDesignSystem
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export const WellBeingPushModalTranslated: ComponentType<Props> =
  withNamespaces()(WellBeingPushModal);
export default WellBeingPushModal;

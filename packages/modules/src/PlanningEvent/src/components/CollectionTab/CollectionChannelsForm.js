// @flow
import { useState } from 'react';

import * as React from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import classNames from 'classnames';
import type {
  Event,
  NotificationSchedule,
} from '@kitman/common/src/types/Event';
import {
  AppStatus,
  InputRadio,
  SlidingPanel,
  TextButton,
  ToggleSwitch,
  Checkbox,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';

import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Notification } from '../../../types';
import { RpeRequestModalTranslated as RpeRequestModal } from '../GridComponents/RpeRequestModal';
import editEvent from '../../services/editEvent';
import {
  deleteNotificationSchedule,
  createNotificationSchedule,
} from '../../services/athleteNotifications';

type Props = {
  event: Event,
  isOpen: boolean,
  sendingNotification: boolean,
  onClose: Function,
  sendNotifications: Function,
  notifications?: Array<Notification>,
  updateEventData: Function,
};

type SavingStatus = 'SUCCESS' | 'LOADING' | 'FAILURE' | null;

const CollectionChannelsForm = (props: I18nProps<Props>) => {
  const [collectionChannels, setCollectionChannels] = useState({
    rpe_collection_athlete: props.event.rpe_collection_athlete,
    mass_input: props.event.mass_input,
    rpe_collection_kiosk: props.event.rpe_collection_kiosk,
  });
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [notificationSchedule, setNotificationSchedule] =
    useState<?NotificationSchedule>(props.event.notification_schedule);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>(null);
  const [notificationToggleEnabled, setNotificationToggleEnabled] =
    useState<boolean>(notificationSchedule !== null);

  const scheduledTime = notificationToggleEnabled
    ? props.t('Scheduled RPE request - {{scheduledTime}}', {
        scheduledTime: DateFormatter.formatJustTime(
          moment(notificationSchedule?.scheduled_time)
        ),
      })
    : props.t('Schedule RPE request');
  const lastRpeNotificationSentAt =
    props.notifications &&
    props.notifications.length > 0 &&
    props.t('Last RPE request sent at {{formattedDate}}', {
      formattedDate: DateFormatter.formatStandard({
        date: moment(props.notifications[0].sent_at),
        showTime: true,
      }),
    });

  const onClickSave = () => {
    setSavingStatus('LOADING');
    editEvent(props.event.id, collectionChannels).then(
      (savedEventData) => {
        props.updateEventData(savedEventData.event);
        setSavingStatus('SUCCESS');
        props.onClose();
      },
      () => setSavingStatus('FAILURE')
    );
  };

  const rpeSentLessThanHalfAnHourAgo = () =>
    props.notifications &&
    props.notifications.length > 0 &&
    moment(props.notifications[0].sent_at).isAfter(
      moment().subtract(30, 'minutes')
    );

  const toggleNotificationSchedule = () => {
    const toggleNotification = notificationToggleEnabled
      ? deleteNotificationSchedule
      : createNotificationSchedule;
    toggleNotification(props.event.id).then(
      (response) => {
        setNotificationSchedule(response.event.notification_schedule);
        setNotificationToggleEnabled(!notificationToggleEnabled);
      },
      () => setSavingStatus('FAILURE')
    );
  };

  const notifyAthletesAndCancelScheduled = () => {
    TrackEvent('Collection Channels', 'Send', 'RPE Request');
    props.sendNotifications();
    if (notificationSchedule) {
      deleteNotificationSchedule(props.event.id).then(
        (response) =>
          setNotificationSchedule(response.event.notification_schedule),
        () => setSavingStatus('FAILURE')
      );
    }
  };

  const resetForm = () => {
    setCollectionChannels({
      rpe_collection_athlete: props.event.rpe_collection_athlete,
      mass_input: props.event.mass_input,
      rpe_collection_kiosk: props.event.rpe_collection_kiosk,
    });
    setNotificationSchedule(props.event.notification_schedule);
    setNotificationToggleEnabled(props.event.notification_schedule !== null);
    toggleNotificationSchedule();
  };

  return (
    <div className="collectionChannelsSidePanel">
      <SlidingPanel
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={props.t('Collection channels')}
        togglePanel={() => {
          resetForm();
          props.onClose();
        }}
      >
        <div className="collectionChannelsForm">
          <div className="collectionChannelsForm__rpeCollectionSection">
            <div className="collectionChannelsForm__athleteSection--title">
              {props.t('Athlete App')}
            </div>
            <div className="collectionChannelsForm__athleteSection--subTitle">
              {props.t('Select to schedule or manually send RPE push request')}
            </div>
            <div className="collectionChannelsForm__athleteSection--checkbox">
              <Checkbox
                id="rpe_collection_athlete_app"
                label={props.t('Athlete App')}
                isChecked={collectionChannels.rpe_collection_athlete}
                toggle={() => {
                  setCollectionChannels((prevCollectionChannels) => {
                    if (
                      (prevCollectionChannels.rpe_collection_athlete &&
                        notificationSchedule !== null) ||
                      (!prevCollectionChannels.rpe_collection_athlete &&
                        notificationSchedule === null)
                    ) {
                      toggleNotificationSchedule();
                    }
                    return {
                      ...prevCollectionChannels,
                      rpe_collection_athlete:
                        !prevCollectionChannels.rpe_collection_athlete,
                    };
                  });
                }}
              />
            </div>
            <div className="collectionChannelsForm__lastSentNotification">
              {lastRpeNotificationSentAt}
            </div>

            <div className="collectionChannelsForm__athleteSection--scheduledNotification">
              {scheduledTime}
              <ToggleSwitch
                isSwitchedOn={notificationToggleEnabled}
                toggle={() => {
                  const action = notificationToggleEnabled
                    ? 'Toggle Off'
                    : 'Toggle On';
                  TrackEvent('Collection Channels', action, 'RPE Request');
                  toggleNotificationSchedule();
                }}
                isDisabled={!collectionChannels.rpe_collection_athlete}
              />
            </div>
            <div className="collectionChannelsForm__athleteSection--sendNotification">
              {props.t('Send push request')}
              <TextButton
                onClick={() =>
                  rpeSentLessThanHalfAnHourAgo()
                    ? setOpenModal(true)
                    : notifyAthletesAndCancelScheduled()
                }
                text={props.t('Send')}
                type="primary"
                isDisabled={
                  !collectionChannels.rpe_collection_athlete ||
                  props.sendingNotification
                }
                kitmanDesignSystem
              />
            </div>
          </div>
          <div className="collectionChannelsForm__rpeCollectionSection">
            <div className="collectionChannelsForm__kioskSection">
              <div className="collectionChannelsForm__kioskSection--title">
                {props.t('Kiosk App')}
              </div>
              <div className="collectionChannelsForm__kioskSection--subTitle">
                {props.t(
                  'Select the style in which you view RPE collection on Kiosk'
                )}
              </div>
              <div className="collectionChannelsForm__kioskSection--checkbox">
                <Checkbox
                  id="rpe_collection_kiosk_app"
                  label={props.t('Kiosk App')}
                  isChecked={collectionChannels.rpe_collection_kiosk}
                  toggle={() => {
                    TrackEvent('Collection Channels', 'Checked', 'Kiosk App');
                    setCollectionChannels((prevCollectionChannels) => ({
                      ...prevCollectionChannels,
                      rpe_collection_kiosk:
                        !prevCollectionChannels.rpe_collection_kiosk,
                    }));
                  }}
                />
              </div>
              <div
                className={classNames(
                  'collectionChannelsForm__kioskSection--options',
                  {
                    'collectionChannelsForm__kioskSection--options--disabled':
                      !collectionChannels.rpe_collection_kiosk,
                  }
                )}
              >
                <div className="collectionChannelsForm__kioskTypeChoice">
                  <img src="/img/kiosk-img/kiosk_view.svg" alt="Kiosk View" />
                  <InputRadio
                    inputName="KioskView"
                    index={0}
                    option={{ value: false, name: props.t('Kiosk View') }}
                    change={() => {
                      TrackEvent(
                        'Collection Channels',
                        'Checked',
                        'Kiosk Kiosk View'
                      );
                      setCollectionChannels((prevCollectionChannels) => ({
                        ...prevCollectionChannels,
                        mass_input: false,
                      }));
                    }}
                    value={collectionChannels.mass_input}
                    disabled={!collectionChannels.rpe_collection_kiosk}
                  />
                </div>

                <div className="collectionChannelsForm__kioskTypeChoice">
                  <img src="/img/kiosk-img/list_view.svg" alt="List View" />
                  <InputRadio
                    inputName="ListView"
                    index={1}
                    option={{ value: true, name: props.t('List View') }}
                    change={() => {
                      TrackEvent(
                        'Collection Channels',
                        'Checked',
                        'Kiosk List View'
                      );
                      setCollectionChannels((prevCollectionChannels) => ({
                        ...prevCollectionChannels,
                        mass_input: true,
                      }));
                    }}
                    value={collectionChannels.mass_input}
                    disabled={!collectionChannels.rpe_collection_kiosk}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="slidingPanelActions">
          <TextButton
            onClick={() => {
              resetForm();
              props.onClose();
            }}
            text={props.t('Cancel')}
            type="secondary"
            kitmanDesignSystem
          />
          <TextButton
            onClick={() => onClickSave()}
            text={props.t('Save')}
            type="primary"
            kitmanDesignSystem
          />
        </div>

        {savingStatus === 'FAILURE' && <AppStatus status="error" />}
        {savingStatus === 'LOADING' && <AppStatus status="loading" />}
        <RpeRequestModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          sendNotifications={notifyAthletesAndCancelScheduled}
        />
      </SlidingPanel>
    </div>
  );
};

export const CollectionChannelsFormTranslated = withNamespaces()(
  CollectionChannelsForm
);
export default CollectionChannelsForm;

// @flow
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import type {
  Event,
  NotificationSchedule,
} from '@kitman/common/src/types/Event';
import { AppStatus } from '@kitman/components';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Drawer,
  Divider,
  Button,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  RadioGroup,
  Radio,
  CircularProgress,
} from '@kitman/playbook/components';
import DrawerLayout from '@kitman/playbook/layouts/Drawer';
import { useTheme } from '@kitman/playbook/hooks';
import { drawerMixin } from '@kitman/playbook/mixins/drawerMixins';
import colors from '@kitman/common/src/variables/colors';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { SentryCaptureMessage } from '@kitman/common/src/utils';
import { getRPECollectionChannelsData } from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';
import { type Notification } from '@kitman/modules/src/PlanningEvent/types';
import {
  deleteNotificationSchedule,
  createNotificationSchedule,
} from '@kitman/modules/src/PlanningEvent/src/services/athleteNotifications';
import editEvent from '@kitman/modules/src/PlanningEvent/src/services/editEvent';
import { RpeRequestModalTranslated as RpeRequestModal } from '@kitman/modules/src/PlanningEvent/src/components/GridComponents/RpeRequestModal';
import { getHumanReadableEventType } from '@kitman/common/src/utils/events';

type Props = {
  event: Event,
  isOpen: boolean,
  onClose: () => void,
  sendNotifications: () => void,
  notifications?: Array<Notification>,
  updateEventData: (Event) => Event,
};

type SavingStatus = 'SUCCESS' | 'SAVING' | 'FAILURE' | null;

const CollectionChannelsForm = (props: I18nProps<Props>) => {
  const theme = useTheme();
  const { trackEvent } = useEventTracking();

  const [collectionChannels, setCollectionChannels] = useState({
    rpe_collection_athlete: props.event.rpe_collection_athlete,
    mass_input: props.event.mass_input,
    rpe_collection_kiosk: props.event.rpe_collection_kiosk,
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [notificationSchedule, setNotificationSchedule] =
    useState<?NotificationSchedule>(props.event.notification_schedule);
  const [savingStatus, setSavingStatus] = useState<SavingStatus>(null);
  const [scheduleNotificationEnabled, setScheduleNotificationEnabled] =
    useState<boolean>(notificationSchedule !== null);

  const rpeSentLessThanHalfAnHourAgo = () =>
    props.notifications &&
    props.notifications.length > 0 &&
    moment(props.notifications[0].sent_at).isAfter(
      moment().subtract(30, 'minutes')
    );

  const toggleNotificationSchedule = async () => {
    const createOrDeleteNotificationSchedule =
      scheduleNotificationEnabled && collectionChannels.rpe_collection_athlete
        ? createNotificationSchedule
        : deleteNotificationSchedule;

    try {
      await createOrDeleteNotificationSchedule(props.event.id);
    } catch (e) {
      SentryCaptureMessage(e, 'error');
      setSavingStatus('FAILURE');
    }
  };

  const onClickSave = async () => {
    setSavingStatus('SAVING');
    try {
      if (notificationSchedule || scheduleNotificationEnabled) {
        await toggleNotificationSchedule();
      }
      const { event: updatedEvent } = await editEvent(
        props.event.id,
        collectionChannels
      );
      props.updateEventData(updatedEvent);
      setSavingStatus('SUCCESS');
      props.onClose();
      trackEvent(
        'Planning - RPE Collection Channels - Save collection channels',
        getRPECollectionChannelsData({
          athleteAppCollection: updatedEvent.rpe_collection_athlete,
          kioskAppCollection: updatedEvent.rpe_collection_kiosk,
          massInput: updatedEvent.mass_input,
        })
      );
    } catch (e) {
      setSavingStatus('FAILURE');
      SentryCaptureMessage(e, 'error');
    }
  };

  const notifyAthletesAndCancelScheduled = async () => {
    props.sendNotifications();
    trackEvent('Planning - RPE Collection Channels - Request RPE now');
    if (notificationSchedule) {
      try {
        const { event: updatedEvent } = await deleteNotificationSchedule(
          props.event.id
        );
        props.updateEventData(updatedEvent);
      } catch (e) {
        setSavingStatus('FAILURE');
        SentryCaptureMessage(e, 'error');
      }
    }
  };

  const resetForm = () => {
    setCollectionChannels({
      rpe_collection_athlete: props.event.rpe_collection_athlete,
      mass_input: props.event.mass_input,
      rpe_collection_kiosk: props.event.rpe_collection_kiosk,
    });
    setNotificationSchedule(props.event.notification_schedule);
    setScheduleNotificationEnabled(props.event.notification_schedule !== null);
  };

  useEffect(() => {
    setNotificationSchedule(props.event.notification_schedule);
    setScheduleNotificationEnabled(props.event.notification_schedule !== null);
  }, [props.event.notification_schedule]);

  const renderAthleteAppCollection = () => (
    <>
      <FormGroup>
        <FormControlLabel
          label={props.t('Enable Athlete App collection')}
          sx={{ marginBottom: 0 }}
          control={
            <Checkbox
              checked={collectionChannels.rpe_collection_athlete}
              onChange={() => {
                setCollectionChannels((prevCollectionChannels) => {
                  const previousValue =
                    prevCollectionChannels.rpe_collection_athlete;
                  if (!previousValue) {
                    setScheduleNotificationEnabled(true);
                  }
                  return {
                    ...prevCollectionChannels,
                    rpe_collection_athlete: !previousValue,
                  };
                });
              }}
              sx={{ padding: [0, 1] }}
            />
          }
        />
      </FormGroup>

      {collectionChannels.rpe_collection_athlete && (
        <Box
          sx={{
            borderLeft: `1px solid ${colors.neutral_200}`,
            paddingLeft: 1.5,
            marginTop: 1,
            marginBottom: 2,
          }}
        >
          <Button
            color="secondary"
            endIcon={<KitmanIcon name={KITMAN_ICON_NAMES.SendOutlined} />}
            onClick={() =>
              rpeSentLessThanHalfAnHourAgo()
                ? setOpenModal(true)
                : notifyAthletesAndCancelScheduled()
            }
            sx={{ marginBottom: 1.5 }}
          >
            {props.t('Request RPE now')}
          </Button>
          <FormGroup>
            <FormControlLabel
              label={props.t('Automatically request RPE at {{eventType}} end', {
                eventType: getHumanReadableEventType(
                  props.event.type
                ).toLowerCase(),
              })}
              sx={{ marginBottom: 0 }}
              control={
                <Checkbox
                  checked={scheduleNotificationEnabled}
                  onChange={() =>
                    setScheduleNotificationEnabled((prev) => !prev)
                  }
                  sx={{ padding: [0, 1] }}
                />
              }
            />
          </FormGroup>
        </Box>
      )}
    </>
  );

  const renderKioskAppCollection = () => (
    <>
      <FormGroup>
        <FormControlLabel
          label={props.t('Enable Kiosk App collection')}
          sx={{ marginBottom: 0 }}
          control={
            <Checkbox
              checked={collectionChannels.rpe_collection_kiosk}
              onChange={() => {
                setCollectionChannels((prevCollectionChannels) => ({
                  ...prevCollectionChannels,
                  rpe_collection_kiosk:
                    !prevCollectionChannels.rpe_collection_kiosk,
                }));
              }}
              sx={{ padding: [0, 1] }}
            />
          }
        />
      </FormGroup>

      {collectionChannels.rpe_collection_kiosk && (
        <Box
          sx={{
            borderLeft: `1px solid ${colors.neutral_200}`,
            paddingLeft: 1.5,
            marginY: 1,
          }}
        >
          <FormControl sx={{ label: { marginBottom: 0 } }}>
            <FormLabel sx={{ color: 'grey_200' }}>
              {props.t('Kiosk athlete display style')}
            </FormLabel>
            <RadioGroup
              value={collectionChannels.mass_input}
              onChange={(e) => {
                setCollectionChannels((prevCollectionChannels) => ({
                  ...prevCollectionChannels,
                  mass_input: e.target.value,
                }));
              }}
            >
              <FormControlLabel
                value
                label={props.t('Grid')}
                control={<Radio />}
              />
              <FormControlLabel
                value={false}
                label={props.t('List')}
                control={<Radio />}
              />
            </RadioGroup>
          </FormControl>
        </Box>
      )}
    </>
  );

  return (
    <>
      <Drawer
        anchor="right"
        open={props.isOpen}
        onClose={() => {
          resetForm();
          props.onClose();
        }}
        sx={drawerMixin({ theme, isOpen: props.isOpen })}
      >
        <DrawerLayout.Title
          title={props.t('RPE collection channels')}
          onClose={() => {
            resetForm();
            props.onClose();
          }}
        />
        <Divider />
        <DrawerLayout.Content>
          <FormGroup>
            <Typography
              variant="body1"
              sx={{
                pb: 1,
                fontSize: 14,
                fontWeight: 600,
                color: colors.grey_200,
              }}
            >
              {props.t('Configure how RPE data is collected from athletes')}
            </Typography>
            {renderAthleteAppCollection()}
            {renderKioskAppCollection()}
          </FormGroup>
        </DrawerLayout.Content>
        <Divider />
        <DrawerLayout.Actions>
          <Button
            onClick={() => {
              resetForm();
              props.onClose();
            }}
            color="secondary"
          >
            {props.t('Cancel')}
          </Button>
          <Button
            onClick={() => onClickSave()}
            disabled={savingStatus === 'SAVING'}
          >
            {savingStatus === 'SAVING' ? (
              <CircularProgress size={20} sx={{ color: colors.neutral_200 }} />
            ) : (
              props.t('Save')
            )}
          </Button>
        </DrawerLayout.Actions>

        {savingStatus === 'FAILURE' && <AppStatus status="error" />}
        <RpeRequestModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          sendNotifications={notifyAthletesAndCancelScheduled}
        />
      </Drawer>
    </>
  );
};

export const CollectionChannelsFormTranslated = withNamespaces()(
  CollectionChannelsForm
);
export default CollectionChannelsForm;

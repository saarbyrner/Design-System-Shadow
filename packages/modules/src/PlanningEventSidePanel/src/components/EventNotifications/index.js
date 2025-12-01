// @flow
import { withNamespaces } from 'react-i18next';
import { useState, useEffect, type ComponentType } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { colors } from '@kitman/common/src/variables';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { Chip, Divider, Alert } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OnUpdateEventNotificationChannels } from '../../types';

type Props = {
  onUpdateNotificationChannels: OnUpdateEventNotificationChannels,
};

const labelStyle = {
  color: colors.grey_100,
  fontSize: '12px',
  fontWeight: 600,
  marginBottom: '4px',
};

const EventNotifications = ({
  t,
  onUpdateNotificationChannels,
}: I18nProps<Props>) => {
  const [staffChannels, setStaffChannels] = useState([]);
  const [athleteChannels, setAthleteChannels] = useState([]);

  const {
    data: notificationTriggers,
    isLoading,
    isError,
  } = useGetNotificationTriggersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [defaultChannels, setDefaultChannels] = useState({
    staff: [],
    athlete: [],
  });
  const [showAlert, setShowAlert] = useState(false);
  const areArraysEqual = (a, b) =>
    a.length === b.length && a.every((val) => b.includes(val));

  useEffect(() => {
    if (!notificationTriggers) {
      return;
    }

    const eventTrigger = notificationTriggers.find(
      (trigger) => trigger.area === 'event'
    );

    if (eventTrigger && eventTrigger.enabled_channels) {
      const defaults = {
        staff: eventTrigger.enabled_channels.staff || [],
        athlete: eventTrigger.enabled_channels.athlete || [],
      };
      // Set both current state and the default reference state
      setStaffChannels(defaults.staff);
      setAthleteChannels(defaults.athlete);
      setDefaultChannels(defaults);
    }
  }, [notificationTriggers]);

  // Check if the selection has changed from the default
  useEffect(() => {
    const staffIsSame = areArraysEqual(staffChannels, defaultChannels.staff);
    const athleteIsSame = areArraysEqual(
      athleteChannels,
      defaultChannels.athlete
    );

    setShowAlert(!staffIsSame || !athleteIsSame);
  }, [staffChannels, athleteChannels, defaultChannels]);

  // Propagate changes to the parent component only if they differ from the default
  useEffect(() => {
    const staffIsSame = areArraysEqual(staffChannels, defaultChannels.staff);
    const athleteIsSame = areArraysEqual(
      athleteChannels,
      defaultChannels.athlete
    );

    if (!staffIsSame || !athleteIsSame) {
      // If channels have changed, send the new configuration
      onUpdateNotificationChannels({
        staff: staffChannels,
        athlete: athleteChannels,
      });
    } else {
      // If channels are back to default, send null to indicate no override
      onUpdateNotificationChannels(null);
    }
  }, [
    staffChannels,
    athleteChannels,
    defaultChannels,
    onUpdateNotificationChannels,
  ]);

  const handleStaffToggle = (channel: string) => {
    setStaffChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  const handleAthleteToggle = (channel: string) => {
    setAthleteChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  // Don't render anything if data is loading or there's an error
  if (isLoading || isError || !notificationTriggers) {
    return null;
  }

  const getVariant = (isActive) => (isActive ? 'contained' : 'secondary');
  const getColor = (isActive) => (isActive ? 'primary' : 'default');

  return (
    <Box>
      <Divider sx={{ marginY: '16px' }} />
      <Typography sx={{ ...labelStyle, fontSize: '14px', mb: 2 }} gutterBottom>
        {t('Notifications')}
      </Typography>
      <Box mb={2}>
        <Typography sx={labelStyle}>{t('Notify staff by')}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            size="small"
            label={t('Email')}
            icon={
              staffChannels.includes('email') && (
                <KitmanIcon name={KITMAN_ICON_NAMES.Check} />
              )
            }
            onClick={() => handleStaffToggle('email')}
            variant={getVariant(staffChannels.includes('email'))}
            color={getColor(staffChannels.includes('email'))}
          />
          <Chip
            size="small"
            label={t('Push')}
            icon={
              staffChannels.includes('push') && (
                <KitmanIcon name={KITMAN_ICON_NAMES.Check} />
              )
            }
            onClick={() => handleStaffToggle('push')}
            variant={getVariant(staffChannels.includes('push'))}
            color={getColor(staffChannels.includes('push'))}
          />
        </Stack>
      </Box>
      <Box>
        <Typography sx={labelStyle} gutterBottom>
          {t('Notify athletes by')}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            size="small"
            label={t('Email')}
            icon={
              athleteChannels.includes('email') && (
                <KitmanIcon name={KITMAN_ICON_NAMES.Check} />
              )
            }
            onClick={() => handleAthleteToggle('email')}
            variant={getVariant(athleteChannels.includes('email'))}
            color={getColor(athleteChannels.includes('email'))}
          />
          <Chip
            size="small"
            label={t('Push')}
            icon={
              athleteChannels.includes('push') && (
                <KitmanIcon name={KITMAN_ICON_NAMES.Check} />
              )
            }
            onClick={() => handleAthleteToggle('push')}
            variant={getVariant(athleteChannels.includes('push'))}
            color={getColor(athleteChannels.includes('push'))}
          />
        </Stack>
      </Box>
      {showAlert && (
        <Alert severity="warning" sx={{ my: 2 }}>
          {t('Selection applies to this event only')}
        </Alert>
      )}
    </Box>
  );
};

export const EventNotificationsTranslated: ComponentType<Props> =
  withNamespaces()(EventNotifications);
export default EventNotifications;

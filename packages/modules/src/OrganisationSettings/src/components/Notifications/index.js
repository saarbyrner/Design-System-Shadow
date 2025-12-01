// @flow
import { useCallback, useMemo } from 'react';
import { capitalize } from 'lodash';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  Box,
  Switch,
  Select,
  MenuItem,
  Typography,
  DataGridPremium,
  FormControl,
  InputLabel,
} from '@kitman/playbook/components';
import { useGridApiRefPremium } from '@kitman/playbook/hooks';
import {
  useGetNotificationTriggersQuery,
  useUpdateNotificationTriggersMutation,
  useBulkUpdateNotificationTriggersMutation,
} from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { useShowToasts } from '@kitman/common/src/hooks';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import type {
  NotificationTrigger,
  NotificationTriggersResponse,
  NotificationTriggersUpdateRequestBody,
  BulkNotificationTriggersUpdateRequestBody,
} from '@kitman/services/src/services/OrganisationSettings/Notifications/api/types';

type Props = {};
type ChannelState = {
  enabled: boolean,
  target: 'All' | 'Staff' | 'Athlete',
};

const SKELETON_ROW_COUNT = 4;

const Notifications = ({ t }: I18nProps<Props>) => {
  const apiRef = useGridApiRefPremium();

  // Skeleton loadingVariant needs a fixed number of rows before data is loaded
  const skeletonRows = useMemo(() => {
    return Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => ({
      id: `skeleton-${index}`,
    }));
  }, []);

  const {
    data: rawData = skeletonRows,
    isLoading: isFetchDataLoading,
  }: {
    data?: NotificationTriggersResponse,
    isLoading: boolean,
  } = useGetNotificationTriggersQuery();

  const [bulkUpdateNotificationTriggers]: [
    ReduxMutation<
      { requestBody: BulkNotificationTriggersUpdateRequestBody },
      NotificationTrigger
    >,
    { isLoading: boolean }
  ] = useBulkUpdateNotificationTriggersMutation();

  const [updateNotificationTriggers]: [
    ReduxMutation<
      { id: number, requestBody: NotificationTriggersUpdateRequestBody },
      NotificationTrigger
    >,
    { isLoading: boolean }
  ] = useUpdateNotificationTriggersMutation();

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: 'UPDATE_NOTIFICATION_TRIGGERS_ERROR_TOAST_ID',
    successToastId: 'UPDATE_NOTIFICATION_TRIGGERS_SUCCESS_TOAST_ID',
  });

  const processedRows = useMemo(() => {
    if (
      !rawData ||
      rawData.length === 0 ||
      rawData[0]?.id.toString().startsWith('skeleton')
    ) {
      return rawData;
    }

    // Helper to convert the backend's `enabled_channels` object to our UI state.
    const getChannelState = (
      channelName: string,
      enabledChannels: ?{ staff: string[], athlete: string[] }
    ): ChannelState => {
      const isStaff = enabledChannels?.staff?.includes(channelName) || false;
      const isAthlete =
        enabledChannels?.athlete?.includes(channelName) || false;
      let target = 'Staff'; // Default if only staff is active.

      if (isStaff && isAthlete) {
        target = 'All';
      } else if (isAthlete) {
        target = 'Athlete';
      }

      return {
        enabled: isStaff || isAthlete,
        target,
      };
    };

    const eventTriggers = rawData.filter((row) => row.area === 'event');
    const otherTriggers = rawData.filter((row) => row.area !== 'event');

    let aggregatedEventRow = null;

    if (eventTriggers.length > 0) {
      // Since all 'event' triggers have the same channels, we can use the first one as representative.
      const representativeTrigger = eventTriggers[0];

      aggregatedEventRow = {
        id: 'aggregated-event',
        area: 'calendar',
        originalTriggerIds: eventTriggers.map((trigger) => trigger.id),
        isAggregated: true,
        description: t('Calendar notifications'),
        email: getChannelState('email', representativeTrigger.enabled_channels),
        push: getChannelState('push', representativeTrigger.enabled_channels),
        sms: getChannelState('sms', representativeTrigger.enabled_channels),
      };
    }

    // Also transform the other rows to have the same data structure for consistency.
    const transformedOtherTriggers = otherTriggers.map((trigger) => ({
      ...trigger,
      email: getChannelState('email', trigger.enabled_channels),
      push: getChannelState('push', trigger.enabled_channels),
      sms: getChannelState('sms', trigger.enabled_channels),
    }));

    return [
      ...transformedOtherTriggers,
      ...(aggregatedEventRow ? [aggregatedEventRow] : []),
    ];
  }, [rawData, t]);

  const handleInteraction = useCallback(
    async (
      id: number | string,
      field: string,
      newValues: { enabled?: boolean, target?: 'All' | 'Staff' | 'Athlete' }
    ) => {
      const currentRow = apiRef.current.getRow(id);
      const currentChannelState = currentRow[field];
      const newChannelState = { ...currentChannelState, ...newValues };

      // Update the UI immediately for an instant response.
      apiRef.current.updateRows([{ id, [field]: newChannelState }]);

      const buildPayload = () => {
        const payload = { staff: [], athlete: [] };
        const channels = ['email', 'push', 'sms'];

        channels.forEach((channel) => {
          const state: ChannelState =
            channel === field ? newChannelState : currentRow[channel];

          if (state.enabled) {
            if (state.target === 'Staff' || state.target === 'All') {
              payload.staff.push(channel);
            }
            if (state.target === 'Athlete' || state.target === 'All') {
              payload.athlete.push(channel);
            }
          }
        });
        return payload;
      };

      const enabledChannels = buildPayload();
      const isAggregated = currentRow.isAggregated;

      try {
        if (isAggregated) {
          // For the aggregated 'event' row, use the bulk update mutation.
          await bulkUpdateNotificationTriggers({
            requestBody: {
              notification_trigger: {
                trigger_type: 'event',
                enabled_channels: enabledChannels,
              },
            },
          }).unwrap();
        } else {
          // For individual rows, use the single update mutation.
          await updateNotificationTriggers({
            id: currentRow.id,
            requestBody: {
              notification_trigger: {
                enabled_channels: enabledChannels,
              },
            },
          }).unwrap();
        }

        showSuccessToast({
          translatedTitle: 'Notification settings updated successfully',
        });
      } catch (error) {
        showErrorToast({
          translatedTitle: t('Error updating notifications. Please try again.'),
        });
        // Revert the UI change if the API call fails.
        apiRef.current.updateRows([{ id, [field]: currentChannelState }]);
      }
    },
    [
      apiRef,
      updateNotificationTriggers,
      bulkUpdateNotificationTriggers,
      showSuccessToast,
      showErrorToast,
      t,
    ]
  );

  const columns = useMemo(() => {
    const createChannelColumn = (field: string, headerName: string) => ({
      field,
      headerName,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'left',
      headerAlign: 'left',
      renderCell: (params) => {
        if (!params.value) {
          return null;
        }

        const { enabled, target }: ChannelState = params.value;
        const labelId = `select-label-${params.id}-${params.field}`;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Switch
              checked={enabled}
              onChange={(event) =>
                handleInteraction(params.id, params.field, {
                  enabled: event.target.checked,
                })
              }
            />

            <FormControl sx={{ width: 120 }} size="small" disabled={!enabled}>
              <InputLabel id={labelId}>{t('Who')}</InputLabel>
              <Select
                labelId={labelId}
                value={target}
                label={t('Who')}
                onChange={(event) =>
                  handleInteraction(params.id, params.field, {
                    target: event.target.value,
                  })
                }
              >
                <MenuItem value="All">{t('All')}</MenuItem>
                <MenuItem value="Staff">{t('Staff')}</MenuItem>
                <MenuItem value="Athlete">{t('Athlete')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      },
    });

    return [
      {
        field: 'area',
        headerName: 'Area',
        flex: 1,
        disableColumnMenu: true,
        sortable: false,
        type: 'string',
        renderCell: (params) => {
          const capitalizedValue = capitalize(params.value);

          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', mr: 2 }}>
              <Typography variant="subtitle2">{capitalizedValue}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('Configure notifications for {{title}}', {
                  title: capitalizedValue,
                })}
              </Typography>
            </Box>
          );
        },
      },
      // The 'description' field is displayed with the header 'Type' because the 'type'
      // field from the backend uses technical wording.
      {
        field: 'description',
        flex: 1,
        headerName: t('Type'),
        sortable: false,
        disableColumnMenu: true,
      },
      createChannelColumn('email', t('Email')),
      createChannelColumn('push', t('Push')),
    ];
  }, [t, handleInteraction]);

  return (
    <DataGridPremium
      autoHeight
      hideFooter
      apiRef={apiRef}
      loading={isFetchDataLoading}
      loadingVariant="skeleton"
      rows={processedRows}
      columns={columns}
      showFilterButton={false}
      showColumnSelectorButton={false}
      showDensitySelectorButton={false}
      showExportButton={false}
      showQuickFilter={false}
      sx={{ backgroundColor: colors.white }}
    />
  );
};

export const NotificationsTranslated = withNamespaces()(Notifications);

export default Notifications;

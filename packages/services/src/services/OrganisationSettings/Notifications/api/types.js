// @flow

export type NotificationTrigger = {|
  id: number,
  area: string,
  type: string,
  description: string,
  enabled: boolean,
  enabled_channels: {
    athlete: Array<string>,
    staff: Array<string>,
  },
|};

export type NotificationTriggersResponse = Array<NotificationTrigger>;

export type NotificationTriggersUpdateRequestBody = {
  notification_trigger: {
    enabled_channels: {
      athlete: Array<string>,
      staff: Array<string>,
    },
  },
};

export type BulkNotificationTriggersUpdateRequestBody = {
  notification_trigger: {
    trigger_type: string,
    enabled_channels: {
      athlete: Array<string>,
      staff: Array<string>,
    },
  },
};

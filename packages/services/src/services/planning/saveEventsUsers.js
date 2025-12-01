// @flow
import { axios } from '@kitman/common/src/utils/services';

export type SaveEventsUsersParams = {
  eventId: number,
  userIds: Array<number>,
  sendNotifications: ?boolean,
};

export const saveEventsUsers = async ({
  eventId,
  userIds,
  sendNotifications,
}: SaveEventsUsersParams): Promise<typeof undefined> => {
  await axios.post(`/planning_hub/events/${eventId}/user_attendance`, {
    user_ids: userIds,
    send_notifications: sendNotifications,
  });
};

// @flow
import { axios } from '@kitman/common/src/utils/services';

export type SaveEventParticipantsParams = {
  eventId: number,
  athleteIds: Array<string | number>,
  sendNotifications?: boolean,
};

export const saveEventParticipants = async ({
  eventId,
  athleteIds,
  sendNotifications = false,
}: SaveEventParticipantsParams): Promise<typeof undefined> => {
  await axios.post(`/planning_hub/events/${eventId}/participants`, {
    athlete_ids: athleteIds,
    send_notifications: sendNotifications,
  });
};

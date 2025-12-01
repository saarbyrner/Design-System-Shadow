// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventsUser } from '@kitman/common/src/types/Event';

export type PutEventsUsersParams = {
  eventId: number,
  usersOrder: Array<{
    user_id: number,
    order: number,
  }>,
};

export type EventsUsersResponseBody = Array<{
  id: number,
  user: EventsUser,
  user_order: number,
}>;

export const eventsUsersOrder = async ({
  eventId,
  usersOrder,
}: PutEventsUsersParams): Promise<EventsUsersResponseBody> => {
  const { data } = await axios.post(
    `/planning_hub/events/${eventId}/events_users/bulk_save`,
    {
      event_id: eventId,
      users_order: usersOrder,
    }
  );
  return data;
};

// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventsUser } from '@kitman/common/src/types/Event';

export type GetEventsUsersParams = {
  eventId: number,
  includeStaffRole?: boolean,
};

export type GetEventsUsersResponse = Array<{
  id: number,
  user: EventsUser,
  event_activity_ids: Array<number>,
  user_order?: number,
}>;

export const getEventsUsers = async ({
  eventId,
  includeStaffRole,
}: GetEventsUsersParams): Promise<GetEventsUsersResponse> => {
  let urlParams = {
    include_event_activity_ids: true,
    include_event_user_order: true,
  };

  if (includeStaffRole) {
    urlParams = { ...urlParams, include_staff_role: true };
  }

  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/events_users`,
    { params: urlParams }
  );
  return data;
};

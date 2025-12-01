// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { UserEventRequest } from './getUserEventRequests';

type Params = {
  eventId: number,
};

export default async (params: Params): Promise<UserEventRequest> => {
  const { eventId } = params;

  const { data } = await axios.post(`/planning_hub/user_event_requests`, {
    event_id: eventId,
  });

  return data;
};

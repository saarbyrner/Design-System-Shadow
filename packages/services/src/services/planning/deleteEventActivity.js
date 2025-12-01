// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';

type Params = {
  eventId: number,
  activityId: number,
};

const deleteEventActivity = async ({
  eventId,
  activityId,
}: Params): Promise<EventActivityV2> => {
  const { data } = await axios.delete(
    `/ui/planning_hub/events/${eventId}/event_activities/${activityId}`
  );
  return data;
};
export default deleteEventActivity;

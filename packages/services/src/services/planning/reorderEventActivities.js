// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';

type Params = {
  eventId: number,
  activities: Array<{
    event_activity_id: number,
    order: number,
  }>,
};

const reorderEventActivities = async ({
  eventId,
  activities,
}: Params): Promise<EventActivityV2> => {
  const { data } = await axios.post(
    `/ui/planning_hub/events/${eventId}/event_activities/reorder`,
    { activities }
  );
  return data;
};
export default reorderEventActivities;

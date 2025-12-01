// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';

type CreateEventActivityParams = {
  eventId: number,
  drillId?: number,
};

const createEventActivity = async ({
  eventId,
  drillId,
}: CreateEventActivityParams): Promise<EventActivityV2> => {
  const { data } = await axios.post(
    `/ui/planning_hub/events/${eventId}/event_activities?exclude_squads=true`,
    {
      event_activity_drill_id: drillId,
    }
  );
  return data;
};
export default createEventActivity;

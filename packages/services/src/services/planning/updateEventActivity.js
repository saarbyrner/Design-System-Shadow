// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityV2 } from '@kitman/common/src/types/Event';

export type EventActivityAttributesV2 = {
  duration?: ?number,
  note?: ?string,
  principle_ids?: ?Array<number>,
  event_activity_type_id?: number,
  event_activity_drill_id?: number,
  user_ids?: ?Array<number>,
};

type Params = {
  eventId: number,
  activityId: number,
  attributes: EventActivityAttributesV2,
};

export const updateEventActivity = async ({
  eventId,
  activityId,
  attributes,
}: Params): Promise<EventActivityV2> => {
  const { data } = await axios.patch(
    `/ui/planning_hub/events/${eventId}/event_activities/${activityId}`,
    attributes
  );
  return data;
};

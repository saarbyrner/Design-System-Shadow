// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';

const updateEventActivityDrill = async (
  attributes: EventActivityDrillV2
): Promise<EventActivityDrillV2> => {
  const { data } = await axios.patch(
    `/planning_hub/event_activity_drills/${attributes.id}`,
    attributes
  );
  return data;
};
export default updateEventActivityDrill;

// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';

export default async (id: number): Promise<Array<EventActivityDrillV2>> => {
  const { data } = await axios.post(
    `/planning_hub/event_activity_drills/${id}/archive`
  );
  return data;
};

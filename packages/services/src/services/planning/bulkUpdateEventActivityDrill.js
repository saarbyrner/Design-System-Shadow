// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventActivityDrillV2 } from '@kitman/common/src/types/Event';

type Params = {
  ids: Array<number>,
  event_activity_type_id?: number,
  delete?: boolean,
};

export default async (params: Params): Promise<Array<EventActivityDrillV2>> => {
  const { data } = await axios.post(
    '/planning_hub/event_activity_drills/bulk_update',
    params
  );
  return data;
};

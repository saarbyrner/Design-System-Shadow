// @flow
import { axios } from '@kitman/common/src/utils/services';

type Params = {
  eventId: number,
  matchMonitorIds: Array<number>,
};

export default async (params: Params) => {
  const { eventId, matchMonitorIds } = params;

  await axios.post(`/planning_hub/events/${eventId}/game_match_monitors`, {
    match_monitor_ids: matchMonitorIds,
  });
};

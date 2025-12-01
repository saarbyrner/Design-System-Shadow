// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { GameActivity } from '@kitman/common/src/types/GameEvent';

const saveAllPeriodGameActivities = async (
  eventId: number,
  periodId: number,
  gameActivities: Array<GameActivity>
): Promise<Array<GameActivity>> => {
  const requestUrl = `/ui/planning_hub/events/${eventId}/game_periods/${periodId}/v2/game_activities/bulk_save`;

  const { data } = await axios.post(requestUrl, {
    game_activities: gameActivities,
  });

  return data;
};

export default saveAllPeriodGameActivities;

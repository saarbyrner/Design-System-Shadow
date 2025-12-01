// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { GamePeriod } from '@kitman/common/src/types/GameEvent';

const updateEventPeriods = async (
  periods: Array<GamePeriod>,
  eventId: number
): Promise<Array<GamePeriod>> => {
  const requestUrl = `/ui/planning_hub/events/${eventId}/game_periods/bulk_save`;

  const { data } = await axios.post(requestUrl, { game_periods: periods });

  return data;
};

export default updateEventPeriods;

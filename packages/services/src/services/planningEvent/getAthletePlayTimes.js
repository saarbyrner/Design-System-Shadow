// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AthletePlayTime } from '@kitman/common/src/types/GameEvent';

const getAthletePlayTimes = async (
  eventId: number
): Promise<Array<AthletePlayTime>> => {
  try {
    const { data } = await axios.get(
      `/ui/planning_hub/events/${eventId}/athlete_play_times`
    );

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export default getAthletePlayTimes;

// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AthletePlayTime } from '@kitman/common/src/types/GameEvent';

type Params = {
  eventId: number,
  athletePlayTimes: Array<AthletePlayTime>,
};

const bulkUpdateAthletePlayTimes = async (
  params: Params
): Promise<Array<AthletePlayTime>> => {
  try {
    const { data } = await axios.post(
      `/ui/planning_hub/events/${params.eventId}/athlete_play_times/bulk_save`,
      { athlete_play_times: params.athletePlayTimes }
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export default bulkUpdateAthletePlayTimes;

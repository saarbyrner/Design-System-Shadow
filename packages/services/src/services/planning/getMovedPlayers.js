// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MovedAthlete } from '@kitman/common/src/types/Athlete';

const getMovedPlayers = async (
  eventId: number
): Promise<{
  moved_athletes: Array<MovedAthlete>,
  player_movement_enabled: boolean,
}> => {
  const { data } = await axios.get(
    `/planning_hub/events/${eventId}/moved_athletes`
  );

  return data;
};

export default getMovedPlayers;

// @flow
import { axios } from '@kitman/common/src/utils/services';

type Payload = {
  eventId: number,
  updates: Array<{
    role?: string,
    official_id: number,
  }>,
};

const setGameOfficials = async ({ eventId, updates }: Payload) => {
  return axios.put(`/planning_hub/events/${eventId}/game_officials/bulk_save`, {
    game_officials: updates,
  });
};

export default setGameOfficials;

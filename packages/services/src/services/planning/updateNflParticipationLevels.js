// @flow
import { axios } from '@kitman/common/src/utils/services';

const updateNflParticipationLevels = async (eventId: number) => {
  await axios.post(
    `/planning_hub/nfl_events/${eventId}/update_participation_levels`
  );
};

export default updateNflParticipationLevels;

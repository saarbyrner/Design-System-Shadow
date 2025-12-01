// @flow
import { axios } from '@kitman/common/src/utils/services';

export type ParticipationLevel = {
  id: number,
  name: string,
  label: string,
  value: string,
  canonical_participation_level: 'full' | 'none' | 'partial',
  include_in_group_calculations: boolean,
};

type ParticipationLevels = Array<ParticipationLevel>;

const getParticipationLevels = async (
  eventType: 'session_event' | 'game_event',
  hideNoneOption: boolean = false
): Promise<ParticipationLevels> => {
  const { data } = await axios.get('/participation_levels', {
    params: {
      event_type: eventType,
      non_none: hideNoneOption,
    },
    headers: {
      Accept: 'application/json',
    },
  });
  return data;
};

export default getParticipationLevels;

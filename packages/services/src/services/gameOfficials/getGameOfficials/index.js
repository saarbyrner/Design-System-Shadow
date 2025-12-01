// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  OfficialsByRole,
  GameOfficial,
} from '@kitman/modules/src/MatchDay/shared/types';

const getGameOfficials = async ({
  eventId,
  ignoreParseByRole,
}: {
  eventId: number,
  ignoreParseByRole?: boolean,
}): Promise<OfficialsByRole | Array<GameOfficial>> => {
  const { data = [] } = await axios.get(
    `/planning_hub/events/${eventId}/game_officials`
  );

  if (ignoreParseByRole) {
    return data;
  }

  const officialsByRole: OfficialsByRole = {};

  data.forEach((official: GameOfficial) => {
    if (official?.role) {
      officialsByRole[official.role] = official;
    }
  });

  return officialsByRole;
};

export default getGameOfficials;

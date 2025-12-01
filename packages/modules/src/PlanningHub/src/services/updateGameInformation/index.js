// @flow
import { axios } from '@kitman/common/src/utils/services';

type Payload = {
  eventId: number,
  updates: {
    home_organisation_id?: number | null,
    away_organisation_id?: number | null,
    home_squad_id?: number | null,
    away_squad_id?: number | null,
    event_location_id?: number | null,
    competition_id?: number | null,
    duration?: number | null,
    score?: number | null,
    opponent_score?: number | null,
    round_number?: number | null,
    start_time?: string | null,
    game_time?: string | null,
    local_timezone?: string | null,
    provider_external_id?: string | null,
    include_tv_channels?: boolean | null,
    tv_channel_ids?: Array<number> | null,
    tv_game_contacts_ids?: Array<number> | null,
    game_officials?: Array<{
      role: string,
      official_id: number,
    }> | null,
    match_director_id?: number | null,
  },
};

const updateGameInformation = async ({ eventId, updates }: Payload) => {
  const { data } = await axios.patch(
    `/planning_hub/league_games/${eventId}`,
    updates
  );
  return data;
};

export default updateGameInformation;

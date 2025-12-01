// @flow
import { officialRoleEnumLike } from '@kitman/modules/src/MatchDay/shared/constants';
import { axios } from '@kitman/common/src/utils/services';
import type { FixtureForm } from '@kitman/modules/src/MatchDay/shared/types';
import type { Game } from '@kitman/common/src/types/Event';
import type { PreferenceType } from '@kitman/common/src/contexts/PreferenceContext/types';

export const CREATE_LEAGUE_FIXTURE_URL = '/planning_hub/league_games';

const createLeagueFixture = async (
  values: FixtureForm,
  preferences: PreferenceType
): Promise<{ event: Game }> => {
  let payload = {
    duration: 90,
    score: 0,
    opponent_score: 0,
    competition_id: values.competition,
    round_number: +values.round,
    start_time: values.kickTime,
    home_organisation_id: values.homeTeam,
    away_organisation_id: values.awayTeam,
    home_squad_id: values.homeSquad,
    away_squad_id: values.awaySquad,
    local_timezone: values.timezone,
    event_location_id: values.location,
  };

  if (preferences?.league_game_officials) {
    payload = {
      ...payload,
      game_officials: [
        {
          role: officialRoleEnumLike.Referee,
          official_id: values[officialRoleEnumLike.Referee],
        },
        {
          role: officialRoleEnumLike.AssistantReferee1,
          official_id: values[officialRoleEnumLike.AssistantReferee1],
        },
        {
          role: officialRoleEnumLike.AssistantReferee2,
          official_id: values[officialRoleEnumLike.AssistantReferee2],
        },
        {
          role: officialRoleEnumLike.FourthReferee,
          official_id: values[officialRoleEnumLike.FourthReferee],
        },
        {
          role: officialRoleEnumLike.Var,
          official_id: values[officialRoleEnumLike.Var],
        },
        {
          role: officialRoleEnumLike.Avar,
          official_id: values[officialRoleEnumLike.Avar],
        },
        {
          ...(preferences?.enable_reserve_ar && {
            role: officialRoleEnumLike.ReserveAR,
            official_id: values[officialRoleEnumLike.ReserveAR],
          }),
        },
      ],
    };
  }

  if (preferences?.league_game_game_time) {
    payload = {
      ...payload,
      game_time: values.date,
    };
  }
  if (preferences?.league_game_match_director) {
    payload = {
      ...payload,
      match_director_id: values.matchDirectorId,
    };
  }
  if (preferences?.league_game_tv) {
    payload = {
      ...payload,
      tv_channel_ids: values.tvChannelIds,
      tv_game_contacts_ids: values.tvContactIds,
    };
  }
  if (preferences?.league_game_match_id) {
    payload = {
      ...payload,
      provider_external_id: values.matchId,
    };
  }
  if (
    preferences?.league_game_notification_recipient &&
    values?.notificationsRecipient
  ) {
    payload = {
      ...payload,
      association_contact_id: values.notificationsRecipient,
    };
  }

  if (preferences?.league_game_hide_club_game && values?.visible) {
    payload = {
      ...payload,
      visible_for_clubs: !values.visible,
    };
  }

  const { data } = await axios.post(CREATE_LEAGUE_FIXTURE_URL, payload);

  return data;
};

export default createLeagueFixture;

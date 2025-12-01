import { axios } from '@kitman/common/src/utils/services';
import createLeagueFixture, { CREATE_LEAGUE_FIXTURE_URL } from '..';
import mock from '../mock';

describe('createLeagueFixture', () => {
  it('calls the correct endpoint', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const data = await createLeagueFixture(
      {
        matchId: '123456',
        duration: 90,
        score: 0,
        opponent_score: 0,
        competition: 1971,
        round: '234',
        date: '2024-11-04T19:00:00.000Z',
        kickTime: '2024-11-04T20:00:00.000Z',
        homeTeam: 1268,
        awayTeam: 1267,
        homeSquad: 3496,
        awaySquad: 7535,
        tvChannelIds: [2],
        timezone: 'Europe/London',
        referee: 182458,
        assistant_referee_1: 182461,
        assistant_referee_2: 182647,
        fourth_referee: 182672,
        reserve_ar: 161704,
        var: 183047,
        avar: 183048,
        location: 234,
        matchDirectorId: 7398,
        tvContactIds: 7139,
        notificationsRecipient: 1,
        visible: true,
      },
      {
        league_game_officials: true,
        league_game_match_director: true,
        league_game_tv: true,
        league_game_game_time: true,
        league_game_match_id: true,
        league_game_notification_recipient: true,
        league_game_hide_club_game: true,
        enable_reserve_ar: true,
      }
    );

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith(CREATE_LEAGUE_FIXTURE_URL, {
      provider_external_id: '123456',
      away_organisation_id: 1267,
      away_squad_id: 7535,
      competition_id: 1971,
      duration: 90,
      game_officials: [
        { official_id: 182458, role: 'referee' },
        { official_id: 182461, role: 'assistant_referee_1' },
        { official_id: 182647, role: 'assistant_referee_2' },
        { official_id: 182672, role: 'fourth_referee' },
        { official_id: 183047, role: 'var' },
        { official_id: 183048, role: 'avar' },
        { official_id: 161704, role: 'reserve_ar' },
      ],
      game_time: '2024-11-04T19:00:00.000Z',
      home_organisation_id: 1268,
      home_squad_id: 3496,
      local_timezone: 'Europe/London',
      opponent_score: 0,
      round_number: 234,
      score: 0,
      start_time: '2024-11-04T20:00:00.000Z',
      tv_channel_ids: [2],
      event_location_id: 234,
      match_director_id: 7398,
      tv_game_contacts_ids: 7139,
      association_contact_id: 1,
      visible_for_clubs: false,
    });
    expect(data).toEqual(mock);
  });

  it('calls the correct endpoint and pass good data when preferences are OFF', async () => {
    const axiosPost = jest.spyOn(axios, 'post');
    const data = await createLeagueFixture(
      {
        matchId: '123456',
        duration: 90,
        score: 0,
        opponent_score: 0,
        competition: 1971,
        round: '234',
        date: '2024-11-04T19:00:00.000Z',
        kickTime: '2024-11-04T20:00:00.000Z',
        homeTeam: 1268,
        awayTeam: 1267,
        homeSquad: 3496,
        awaySquad: 7535,
        tvChannelIds: [2],
        timezone: 'Europe/London',
        referee: 182458,
        assistant_referee_1: 182461,
        assistant_referee_2: 182647,
        fourth_referee: 182672,
        reserve_ar: 161704,
        var: 183047,
        avar: 183048,
        location: 234,
        matchDirectorId: 7398,
        tvContactIds: 7139,
      },
      {
        league_game_officials: false,
        league_game_match_director: false,
        league_game_tv: false,
        league_game_game_time: false,
        league_game_match_id: false,
        league_game_notification_recipient: false,
        league_game_hide_club_game: false,
      }
    );

    expect(axiosPost).toHaveBeenCalledTimes(1);
    expect(axiosPost).toHaveBeenCalledWith(CREATE_LEAGUE_FIXTURE_URL, {
      away_organisation_id: 1267,
      away_squad_id: 7535,
      competition_id: 1971,
      duration: 90,
      home_organisation_id: 1268,
      home_squad_id: 3496,
      local_timezone: 'Europe/London',
      start_time: '2024-11-04T20:00:00.000Z',
      event_location_id: 234,
      round_number: 234,
      opponent_score: 0,
      score: 0,
    });
    expect(data).toEqual(mock);
  });
});

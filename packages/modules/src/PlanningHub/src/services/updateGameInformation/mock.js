// @flow
export default {
  home_organisation_id: 123,
  away_organisation_id: 456,
  home_squad_id: 789,
  away_squad_id: 101,
  event_location_id: 202,
  competition_id: 303,
  duration: 90,
  score: 3,
  opponent_score: 1,
  round_number: 5,
  start_time: new Date('2024-09-30T00:00:00Z'),
  game_time: new Date('2024-09-30T00:00:00Z'),
  local_timezone: 'Europe/Dublin',
  provider_external_id: 'abc-123',
  game_officials: [
    {
      role: 'referee',
      official_id: 1,
    },
    {
      role: 'assistant_referee_1',
      official_id: 2,
    },
    {
      role: 'assistant_referee_2',
      official_id: 3,
    },
  ],
};

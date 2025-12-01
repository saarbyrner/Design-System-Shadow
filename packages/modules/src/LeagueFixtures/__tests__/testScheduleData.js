// @flow
export const mockGame = {
  id: 2695415,
  type: 'game_event',
  competition: {
    competition_categories: [],
    id: 1797,
    name: 'Fest',
  },
  squad: {
    id: 3494,
    owner_id: 1267,
    owner_name: 'KL Galaxy',
  },
  opponent_squad: {
    id: 3496,
    owner_id: 1268,
    owner_name: 'KL Toronto',
  },
  score: 0,
  opponent_score: 0,
  event_location: null,
  mls_game_key: '12345678',
  local_timezone: 'GMT',
  start_date: '2025-03-10T12:25:00Z',
  event_users: [],
  match_report_submitted_by_id: null,
  round_number: 0,
  game_time: '2025-03-10T12:25:00Z',
  league_setup: true,
  game_participants_unlocked: true,
  skip_automatic_game_team_email: null,
  game_status: 'awaiting_officials',
};

export const mockSchedule = { events: [mockGame], next_id: null };

export const mockOfficials = [
  {
    id: 235723,
    firstname: 'Michael',
    lastname: 'Hackart',
    fullname: 'Michael Hackart',
  },
  {
    id: 183046,
    firstname: 'Michael',
    lastname: 'Yao',
    fullname: 'Michael Yao',
  },
];

export const mockGameOfficials = [
  {
    id: 1,
    role: 'referee',
    official_id: 235723,
    official: {
      id: 235723,
      fullname: 'Michael Hackart',
    },
  },
  {
    id: 2,
    role: 'referee',
    official_id: 183046,
    official: {
      id: 183046,
      fullname: 'Michael Yao',
    },
  },
];

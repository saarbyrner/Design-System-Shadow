import { rest } from 'msw';

const data = {
  event: {
    workload_type: 1,
    game_day_minus: null,
    game_day_plus: null,
    rpe_collection_kiosk: true,
    rpe_collection_athlete: true,
    organisation_team: {
      name: 'Test Org',
    },
    venue_type: {
      name: 'Home',
    },
    opponent_squad: {
      name: 'Opponent Org',
      owner_name: 'Test Name',
    },
    squad: {
      name: 'Test Squad name',
      owner_name: 'Wee woo name',
    },
    opponent_score: 0,
    score: 0,
    home_athletes: [
      {
        id: 1,
        fullname: 'Stone Cold Steve Austin',
        date_of_birth: '2002',
        position: { abbreviation: 'GK' },
        squad_number: 11,
        designation: 'Primary',
        avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
      },
      {
        id: 2,
        fullname: 'The Rock',
        date_of_birth: '2002',
        position: { abbreviation: 'RB' },
        squad_number: 12,
        designation: 'Primary',
        avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
      },
      {
        id: 3,
        fullname: 'John Cena',
        date_of_birth: '2001',
        position: { abbreviation: 'CB' },
        squad_number: 13,
        designation: 'Primary',
        avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
      },
    ],
    home_event_id: 5555,
    home_event_users: [
      {
        id: 1,
        user: {
          id: 1,
          fullname: 'Paul Levesque',
          role: 'The Boss',
        },
      },
    ],
    away_athletes: [
      {
        id: 4,
        fullname: 'Cody Rhodes',
        date_of_birth: '2005',
        position: { abbreviation: 'LF' },
        squad_number: 15,
        designation: 'Primary',
        avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
      },
      {
        id: 5,
        fullname: 'Roman Reigns',
        date_of_birth: '2004',
        position: { abbreviation: 'BB' },
        squad_number: 20,
        designation: 'Primary',
        avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
      },
    ],
    away_event_id: 6666,
    away_event_users: [
      {
        id: 2,
        user: {
          id: 2,
          fullname: 'Tony Khan',
          role: 'The Other Boss',
        },
      },
    ],
    mass_input: false,
    session_type: {
      id: 7428,
      name: 'On-Field Activity',
      category: null,
      is_joint_practice: false,
    },
    background_color: '#006778',
    editable: true,
    season_type: { id: 6, name: 'Regular Season', is_archived: false },
    id: 3692,
    name: 'ds',
    start_date: '2023-12-19T17:58:03Z',
    end_date: '2023-12-19T18:58:03Z',
    duration: 60,
    type: 'session_event',
    local_timezone: 'Europe/Dublin',
    surface_type: null,
    surface_quality: null,
    weather: null,
    temperature: null,
    humidity: null,
    field_condition: null,
    notification_schedule: {
      id: 58322,
      scheduled_time: '2023-12-19T19:08:03+00:00',
      created_at: '2023-12-19T17:58:09.000+00:00',
      updated_at: '2023-12-19T17:58:09.000+00:00',
    },
    created_at: '2023-12-19T17:58:09Z',
    updated_at: '2023-12-19T17:58:09Z',
    nfl_surface_type_id: null,
    nfl_location_id: null,
    nfl_location_feed: null,
    nfl_equipment_id: null,
    nfl_surface_composition: null,
    nfl_field_type: null,
    workload_units: {},
    description: null,
    event_collection_complete: null,
    athlete_events_count: 2,
    attachments: [],
    attached_links: [],
    event_location: null,
    event_users: [
      {
        id: 146,
        user: {
          id: 2,
          firstname: 'Rod',
          lastname: 'Murphy',
          fullname: 'Rod Murphy',
          email: 'rod@kitmanlabs.com',
          avatar_url: null,
          role: 'Club Athletic Trainer',
        },
      },
      {
        id: 147,
        user: {
          id: 3,
          firstname: 'Stuart',
          lastname: "O'Brien",
          fullname: "Stuart O'Brien",
          email: 'stuart@kitmanlabs.com',
          avatar_url: null,
          role: 'Club Athletic Trainer',
        },
      },
    ],
    athlete_ids: [3392, 3474],
    visibility_ids: [],
    recurrence: {
      rule: null,
      original_start_time: null,
      recurring_event_id: null,
    },
  },
};

const handler = rest.get('/planning_hub/events/:eventId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

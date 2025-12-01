import { rest } from 'msw';
import { data as competitions } from '../getCompetitions';
import { data as sessionTypes } from '../getSessionTypes';
import { data as teams } from '../getTeams';
import { data as organisationTeams } from '../getOrganisationTeams';
import { data as venueTypes } from '../getVenueTypes';
import { data as sport } from '../getSports';
import { data as eventConditions } from '../getEventConditions';

const data = {
  events: [
    {
      id: 1,
      background_color: '#FFFFFF',
      created_at: '2021-10-14T09:07:23Z',
      end_date: '2021-10-23T12:32:00Z',
      competition: competitions[0],
      duration: sport.duration,
      local_timezone: 'Europe/Dublin',
      mass_input: false,
      name: null,
      notification_schedule: {
        id: 471,
        scheduled_time: '2021-10-23T13:32:00+01:00',
        created_at: '2021-10-14T10:07:27.000+01:00',
        updated_at: '2021-10-14T10:07:27.000+01:00',
      },
      number_of_periods: 2,
      opponent_score: null,
      opponent_team: teams[0],
      organisation_team: organisationTeams[0],
      opponent_squad: {
        id: 11,
        logo_full_path: '',
        name: 'U16',
        owner_id: '22',
        owner_name: 'Opponent Squad 1',
      },
      squad: {
        id: 11,
        logo_full_path: '',
        name: 'U16',
        owner_id: '22',
        owner_name: 'Squad 1',
      },
      kit_matrix: [
        {
          id: 1,
          kind: 'referee',
          kit_matrix: {
            id: 1,
            division: null,
            division_id: null,
            kind: 'referee',
            kit_matrix_items: [],
            organisation: null,
            squads: [],
            name: 'Home Kit',
            primary_color: 'FF5733',
            secondary_color: 'C70039',
          },
          kit_matrix_id: 1,
        },
      ],
      round_number: null,
      rpe_collection_athlete: true,
      rpe_collection_kiosk: true,
      score: null,
      start_date: '2021-10-23T11:02:00Z',
      surface_quality: null,
      surface_type: null,
      temperature: null,
      type: 'game_event',
      updated_at: '2021-10-14T09:07:23Z',
      venue_type: venueTypes[0],
      weather: null,
      recurrence: {
        rule: 'FREQ=WEEKLY;INTERVAL=1;UNTIL=20240629T230000Z;BYDAY=MO,TU',
        recurring_event_id: 2222,
        original_start_time: '2024-06-04T16:50:00.000+01:00',
        rrule_instances: null,
      },
    },
    {
      id: 2,
      background_color: '#e62020',
      created_at: '2021-06-24T13:18:31Z',
      end_date: '2021-06-23T12:10:00Z',
      duration: 60,
      game_day_minus: 2,
      game_day_plus: 3,
      local_timezone: 'Europe/Dublin',
      mass_input: false,
      name: ' Captains Run',
      kit_matrix: [],
      notification_schedule: {
        id: 354,
        scheduled_time: '2021-06-23T13:10:00+01:00',
        created_at: '2021-06-24T14:18:31.000+01:00',
        updated_at: '2021-06-24T14:18:31.000+01:00',
      },
      opponent_squad: {
        id: 22,
        logo_full_path: '',
        name: 'U16',
        owner_id: '22',
        owner_name: 'Opponent Squad 2',
      },
      squad: {
        id: 22,
        logo_full_path: '',
        name: 'U16',
        owner_id: '22',
        owner_name: 'Squad 2',
      },
      rpe_collection_athlete: true,
      rpe_collection_kiosk: true,
      session_type: sessionTypes[0],
      start_date: '2021-06-23T11:10:00Z',
      surface_quality: eventConditions.surface_qualities[0],
      surface_type: eventConditions.surface_types[0],
      temperature: 25,
      type: 'session_event',
      updated_at: '2021-06-24T13:18:31Z',
      weather: eventConditions.weather_conditions[0],
      workload_type: 1,
    },
  ],
  next_id: null,
};

const handler = rest.post('/planning_hub/events/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

import { rest } from 'msw';

const data = [
  {
    id: 3849049,
    athlete: {
      id: 3474,
      firstname: 'Test',
      lastname: 'NFL Mobile',
      fullname: 'Test NFL Mobile',
      shortname: 'T NFL Mobile',
      user_id: 3753,
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      position: {
        id: 84,
        name: 'Goalkeeper',
        order: 1,
        abbreviation: 'GK',
        position_group: {
          name: 'Goalkeepers',
        },
      },
      availability: 'injured',
    },
    participation_level: {
      id: 334,
      name: 'Out',
      canonical_participation_level: 'none',
      include_in_group_calculations: false,
      default: true,
    },
    participation_level_reason: null,
    include_in_group_calculations: false,
    duration: null,
    rpe: null,
    related_issue: null,
  },
  {
    id: 3849048,
    athlete: {
      id: 3392,
      firstname: 'Phil',
      lastname: 'Funk',
      fullname: 'Phil Funk',
      shortname: 'P Funk',
      user_id: 3574,
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      position: {
        id: 31,
        name: 'Unknown',
        order: 35,
        abbreviation: 'Unknown',
        position_group: {
          name: 'Unknowns',
        },
      },
      availability: 'unavailable',
    },
    participation_level: {
      id: 334,
      name: 'Out',
      canonical_participation_level: 'none',
      include_in_group_calculations: false,
      default: true,
    },
    participation_level_reason: null,
    include_in_group_calculations: false,
    duration: null,
    rpe: null,
    related_issue: null,
  },
];
const handler = rest.get(
  '/planning_hub/events/:eventId/athlete_events',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

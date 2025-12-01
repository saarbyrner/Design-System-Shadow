import { rest } from 'msw';

const data = {
  id: 62939,
  duration: null,
  principles: [],
  athletes: [
    {
      id: 15642,
      firstname: 'hugo',
      lastname: 'beuzeboc',
      fullname: 'hugo beuzeboc',
      shortname: 'beuzeboc',
      user_id: 17409,
      avatar_url:
        'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    },
  ],
  users: [],
  event_activity_drill: {
    id: 11,
    event_activity_type: {
      id: 1,
      name: 'Intense',
    },
    name: 'Paris Marathon',
    duration: null,
    sets: null,
    reps: null,
    rest_duration: null,
    pitch_width: null,
    pitch_length: null,
    intensity: null,
    principles: [],
    notes: '<p><br></p>',
    diagram: null,
    attachments: [],
    links: [],
    event_activity_drill_labels: [],
    library: true,
    created_by: {
      id: 133800,
      fullname: 'Rory Harford',
    },
  },
  event_activity_type: null,
  order: null,
};

const handler = rest.post(
  `/ui/planning_hub/events/:eventId/event_activities`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

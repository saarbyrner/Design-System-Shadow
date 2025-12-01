import { rest } from 'msw';

const data = [
  {
    id: 10,
    duration: 50,
    principles: [],
    athletes: [
      {
        id: 1160,
        firstname: 'M',
        lastname: 'Smith',
        fullname: 'M Smith',
        shortname: 'Smith',
        user_id: 1447,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2189?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94389,
        firstname: 'Johan',
        lastname: 'TiqueGx',
        fullname: 'Johan TiqueGx',
        shortname: 'TiqueGx',
        user_id: 158812,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94547,
        firstname: 'Simon',
        lastname: 'Athlete',
        fullname: 'Simon Athlete',
        shortname: 'Athlete',
        user_id: 159008,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94824,
        firstname: 'Android',
        lastname: 'Play Store Tester',
        fullname: 'Android Play Store Tester',
        shortname: 'Play Store Tester',
        user_id: 159320,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
    ],
    users: [],
    event_activity_drill: {
      id: 6,
      name: 'fsadfasfa',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      notes: '<p><br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
    },
    event_activity_type: null,
    order: null,
  },
  {
    id: 9,
    duration: 20,
    principles: [],
    athletes: [
      {
        id: 1160,
        firstname: 'M',
        lastname: 'Smith',
        fullname: 'M Smith',
        shortname: 'Smith',
        user_id: 1447,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2189?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 92153,
        firstname: 'Willian',
        lastname: 'Gama',
        fullname: 'Willian Gama',
        shortname: 'Gama',
        user_id: 156225,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 93303,
        firstname: 'Luke',
        lastname: 'McAuley',
        fullname: 'Luke McAuley',
        shortname: 'McAuley',
        user_id: 157633,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_263612?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 93304,
        firstname: 'Craig',
        lastname: 'Athlete',
        fullname: 'Craig Athlete',
        shortname: 'Athlete',
        user_id: 157634,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 93752,
        firstname: 'Pablo',
        lastname: 'de Miguel',
        fullname: 'Pablo de Miguel',
        shortname: 'de Miguel',
        user_id: 158137,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94387,
        firstname: 'Gavin',
        lastname: 'CliffordGX',
        fullname: 'Gavin CliffordGX',
        shortname: 'CliffordGX',
        user_id: 158810,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94388,
        firstname: 'Mark',
        lastname: 'ClintonGx',
        fullname: 'Mark ClintonGx',
        shortname: 'ClintonGx',
        user_id: 158811,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94389,
        firstname: 'Johan',
        lastname: 'TiqueGx',
        fullname: 'Johan TiqueGx',
        shortname: 'TiqueGx',
        user_id: 158812,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94547,
        firstname: 'Simon',
        lastname: 'Athlete',
        fullname: 'Simon Athlete',
        shortname: 'Athlete',
        user_id: 159008,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94824,
        firstname: 'Android',
        lastname: 'Play Store Tester',
        fullname: 'Android Play Store Tester',
        shortname: 'Play Store Tester',
        user_id: 159320,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
    ],
    users: [],
    event_activity_drill: {
      id: 5,
      name: 'fsdfaf',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      notes: '<p><br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
    },
    event_activity_type: null,
    order: null,
  },
  {
    id: 11,
    duration: 35,
    principles: [],
    athletes: [
      {
        id: 1160,
        firstname: 'M',
        lastname: 'Smith',
        fullname: 'M Smith',
        shortname: 'Smith',
        user_id: 1447,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2189?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94824,
        firstname: 'Android',
        lastname: 'Play Store Tester',
        fullname: 'Android Play Store Tester',
        shortname: 'Play Store Tester',
        user_id: 159320,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
    ],
    users: [],
    event_activity_drill: {
      id: 2,
      name: 'f',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      notes: '<p><br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
    },
    event_activity_type: null,
    order: null,
  },
  {
    id: 4,
    duration: 40,
    principles: [],
    athletes: [
      {
        id: 1160,
        firstname: 'M',
        lastname: 'Smith',
        fullname: 'M Smith',
        shortname: 'Smith',
        user_id: 1447,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2189?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 1161,
        firstname: 'Stephen',
        lastname: 'Smith',
        fullname: 'Stephen Smith',
        shortname: 'Smith',
        user_id: 1448,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2183?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94824,
        firstname: 'Android',
        lastname: 'Play Store Tester',
        fullname: 'Android Play Store Tester',
        shortname: 'Play Store Tester',
        user_id: 159320,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
    ],
    users: [],
    event_activity_drill: {
      id: 3,
      name: 'dfa',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      notes: '<p><br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
    },
    event_activity_type: null,
    order: null,
  },
  {
    id: 5,
    duration: 44,
    principles: [],
    athletes: [
      {
        id: 1160,
        firstname: 'M',
        lastname: 'Smith',
        fullname: 'M Smith',
        shortname: 'Smith',
        user_id: 1447,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2189?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 1161,
        firstname: 'Stephen',
        lastname: 'Smith',
        fullname: 'Stephen Smith',
        shortname: 'Smith',
        user_id: 1448,
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_2183?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
      {
        id: 94824,
        firstname: 'Android',
        lastname: 'Play Store Tester',
        fullname: 'Android Play Store Tester',
        shortname: 'Play Store Tester',
        user_id: 159320,
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
      },
    ],
    users: [],
    event_activity_drill: {
      id: 4,
      name: 'dfsadfa',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      notes: '<p><br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
    },
    event_activity_type: null,
    order: null,
  },
];

const handler = rest.get(
  '/ui/planning_hub/events/:eventId/event_activities',

  (req, res, ctx) =>
    res(
      ctx.json(
        data.map((activity) => {
          const result = { ...activity };
          const params = req.url.searchParams;
          if (params.has('exclude_athletes')) {
            delete result.athletes;
          }
          if (params.has('exclude_squads')) {
            delete result.squads;
          }
          return result;
        })
      )
    )
);

export { handler, data };

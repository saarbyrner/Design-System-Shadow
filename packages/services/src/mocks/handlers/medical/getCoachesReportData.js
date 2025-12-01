import { rest } from 'msw';

const mockData = {
  columns: [],
  rows: [
    {
      id: 40211,
      player_id: 'something',
      allergies: [],
      athlete_medical_alerts: [],
      availability_comment: 'This is a comment',
      athlete: {
        fullname: 'Tomas Albornoz',
        position: 'Second Row',
        avatar_url:
          'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
        availability: 'unavailable',
        extended_attributes: {},
      },
      availability_status: {
        availability: 'unavailable',
        unavailable_since: '282 days',
      },
      open_injuries_illnesses: {
        has_more: false,
        issues: [
          {
            id: 13899,
            issue_id: 13900,
            name: 'Oct  6, 2022 - Abcess Ankle (excl. Joint) [Left]',
            status: 'Causing unavailability (time-loss)',
            causing_unavailability: true,
            issue_type: 'Illness',
          },
        ],
      },
      latest_note: {
        title: 'Note Title 7753585',
        content:
          "He's an absolute dream! -- Quaerat quibusdam ipsa molestiae cupiditate aut. Fugit accusantium aspernatur ut aut iure et.",
        date: 'Jun  2, 2023',
        restricted_annotation: false,
      },
      squad: [
        {
          name: 'International Squad',
          primary: true,
        },
      ],
    },
    {
      id: 96981,
      player_id: 'yoo',
      allergies: [],
      athlete_medical_alerts: [],
      availability_comment: 'This is a comment on Janets info',
      athlete: {
        fullname: 'Janet Athlete',
        position: 'Wing',
        avatar_url:
          'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
        availability: 'available',
        extended_attributes: {},
      },
      availability_status: {
        availability: 'available',
        unavailable_since: 'dddd',
      },
      open_injuries_illnesses: {
        has_more: false,
        issues: [],
      },
      latest_note: {
        title: 'string',
        content: 'string',
        date: 'string',
        restricted_annotation: true,
      },
      squad: [
        {
          name: 'International Squad',
          primary: false,
        },
      ],
    },
  ],
  next_id: 30693,
};

const handler = rest.post('medical/coaches/fetch', (req, res, ctx) =>
  res(ctx.json(mockData))
);

export { handler, mockData };

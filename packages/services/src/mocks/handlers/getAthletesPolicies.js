import { rest } from 'msw';

const data = [
  {
    athlete_squads: [
      {
        id: 1,
        name: 'International Squad',
      },
    ],
    created_at: '2016-09-22T10:30:08Z',
    fullname: 'John Doe',
    policies: [],
    position: 'Fullback',
    username: 'joDoe',
  },
  {
    athlete_squads: [
      {
        id: 1,
        name: 'International Squad',
      },
      {
        id: 2,
        name: 'Academy Squad',
      },
    ],
    created_at: '2017-04-20T08:20:00Z',
    fullname: 'Jane Doe',
    policies: [],
    position: 'Fullback',
    username: 'jaDoe',
  },
];

const handler = rest.get(
  '/ui/settings/athletes/export_policies/:active/:search',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

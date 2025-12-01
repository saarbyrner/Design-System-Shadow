import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Test Format',
    number_of_players: 10,
  },
  {
    id: 2,
    name: '11v11',
    number_of_players: 11,
  },
];

const handler = rest.get('/ui/organisation_formats', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Team A',
  },
  {
    id: 2,
    name: 'Team B',
  },
];
const handler = rest.get('/organisation_teams', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

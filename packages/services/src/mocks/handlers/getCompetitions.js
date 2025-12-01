import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Champions League',
  },
  {
    id: 2,
    name: 'Premier League',
  },
];
const handler = rest.get('/competitions', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

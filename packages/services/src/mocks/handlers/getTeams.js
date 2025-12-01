import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Chelsea',
  },
  {
    id: 2,
    name: 'Arsenal',
  },
];
const handler = rest.get('/teams', (req, res, ctx) => res(ctx.json(data)));

export { handler, data };

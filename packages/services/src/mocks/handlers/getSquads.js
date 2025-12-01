import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'International Squad',
  },
  {
    id: 2,
    name: 'Academy Squad',
  },
];
const handler = rest.get('/squads', (req, res, ctx) => res(ctx.json(data)));

export { handler, data };

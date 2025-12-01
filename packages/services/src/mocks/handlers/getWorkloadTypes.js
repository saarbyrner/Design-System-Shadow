import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Squad Loading',
  },
  {
    id: 2,
    name: 'Individual Loading',
  },
];
const handler = rest.get('/workload_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

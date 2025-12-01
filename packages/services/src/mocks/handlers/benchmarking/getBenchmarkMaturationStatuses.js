import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Very Early',
  },
  {
    id: 2,
    name: 'Early',
  },
  {
    id: 3,
    name: 'On Time',
  },
  {
    id: 4,
    name: 'Late',
  },
  {
    id: 5,
    name: 'Very Late',
  },
];

const handler = rest.get('/benchmark/maturity_offset_status', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };

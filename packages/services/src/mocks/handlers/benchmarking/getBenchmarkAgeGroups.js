import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'U9',
  },
  {
    id: 2,
    name: 'U10',
  },
  {
    id: 2,
    name: 'U11',
  },
];

const handler = rest.get('/benchmark/age_groups', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };

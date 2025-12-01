import { rest } from 'msw';

const data = [
  {
    id: 6,
    name: 'Kitman Rugby Club',
  },
];

const handler = rest.post('/benchmark/organisations', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };

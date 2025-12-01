import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'metric_1',
  },
  {
    id: 2,
    name: 'metric_2',
  },
  {
    id: 3,
    name: 'metric_3',
  },
];

const handler = rest.get('/benchmark/metrics', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };

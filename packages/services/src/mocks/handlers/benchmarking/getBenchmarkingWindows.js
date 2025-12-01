import { rest } from 'msw';

const data = [
  {
    id: 4,
    name: 'Test Window 1',
  },
  {
    id: 5,
    name: 'Test Window 2',
  },
  {
    id: 6,
    name: 'Test Window 3',
  },
];

const handler = rest.get('/benchmark/windows', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };

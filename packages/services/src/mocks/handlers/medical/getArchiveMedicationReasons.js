import { rest } from 'msw';

const data = [
  {
    id: 2,
    name: 'Duplicate',
  },
  {
    id: 1,
    name: 'Incorrect athlete',
  },
];

const handler = rest.get('/ui/archive_reasons', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

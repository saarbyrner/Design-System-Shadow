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
  {
    id: 3,
    name: 'Note not relevant',
  },
];

const handler = rest.get('/ui/archive_reasons', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

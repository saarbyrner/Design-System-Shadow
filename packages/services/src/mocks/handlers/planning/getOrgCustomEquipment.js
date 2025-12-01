import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Equipment 1',
  },
  {
    id: 2,
    name: 'Equipment 2',
  },
];
const handler = rest.get('/ui/nfl_equipment', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

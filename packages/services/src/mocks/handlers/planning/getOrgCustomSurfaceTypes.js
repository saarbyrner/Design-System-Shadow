import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Surface 1',
  },
  {
    id: 2,
    name: 'Surface 2',
  },
];
const handler = rest.get('/ui/nfl_surfaces', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

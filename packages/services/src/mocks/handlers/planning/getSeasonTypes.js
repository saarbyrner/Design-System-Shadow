import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Season Type 1',
    is_archived: false,
  },
  {
    id: 2,
    name: 'Season Type 2',
    is_archived: false,
  },
  {
    id: 3,
    name: 'Archived Season Type',
    is_archived: true,
  },
];
const handler = rest.get('/ui/season_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

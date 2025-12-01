import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Venue 1',
    default_surface_type_id: 1,
  },
  {
    id: 2,
    name: 'Venue 2',
    default_surface_type_id: 3,
  },
];
const handler = rest.get('/ui/nfl_locations', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

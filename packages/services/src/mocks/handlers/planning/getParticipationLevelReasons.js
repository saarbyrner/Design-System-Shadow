import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Injury',
  },
  {
    id: 2,
    name: 'Rest - non-injury',
  },
  {
    id: 3,
    name: 'Inactive',
  },
  {
    id: 4,
    name: 'Suspended',
  },
  {
    id: 5,
    name: 'Personal Reasons',
  },
  {
    id: 6,
    name: 'Practice Squad',
  },
  {
    id: 7,
    name: 'Other',
  },
];
const handler = rest.get('/ui/participation_level_reasons', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

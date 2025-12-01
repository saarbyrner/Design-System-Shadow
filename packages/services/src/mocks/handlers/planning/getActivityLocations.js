import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Venue 1',
    is_active: true,
    is_owned_by_org: true,
    organisation_name: 'My Org',
  },
  {
    id: 2,
    name: 'Venue 2',
    is_active: true,
    is_owned_by_org: false,
    organisation_name: 'Other 2',
  },
  {
    id: 3,
    name: 'Location Test 1 (Inactive)',
    is_active: false,
    is_owned_by_org: true,
    organisation_name: 'My Org',
  },
  {
    id: 4,
    name: 'Location Test 2 (Inactive)',
    is_active: false,
    is_owned_by_org: false,
    organisation_name: 'Other 2',
  },
  {
    id: 100,
    name: 'Venue X',
    is_active: true,
    is_owned_by_org: true,
    organisation_name: 'My Org',
  },
];
const handler = rest.get('/ui/activity_locations', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

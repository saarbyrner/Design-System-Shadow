import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Test Fixture',
  },
  {
    id: 2,
    name: 'Test Fixture 2',
  },
];

const handler = rest.get('/ui/organisation_fixture_ratings', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

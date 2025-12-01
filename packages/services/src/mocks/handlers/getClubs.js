import { rest } from 'msw';

const data = [{ id: 1234, name: 'club' }];

const handler = rest.get(
  '/ui/organisation/organisations/children',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

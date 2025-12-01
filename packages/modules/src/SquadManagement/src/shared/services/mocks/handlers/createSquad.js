// @flow
import { rest } from 'msw';

const handler = rest.post('/settings/squads', (req, res, ctx) =>
  res(ctx.status(200))
);

export { handler };

// @flow
import { rest } from 'msw';

const data = {};

const handler = rest.post('/settings/athlete_push', (req, res, ctx) =>
  res(ctx.json({}))
);

export { handler, data };

// @flow
import { rest } from 'msw';

const data = {};

const handler = rest.put(
  '/athletes/:athleteId/integration_settings',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

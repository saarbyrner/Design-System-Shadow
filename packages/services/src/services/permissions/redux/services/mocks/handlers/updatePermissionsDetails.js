// @flow
import { rest } from 'msw';

const data = {};

const handler = rest.put(
  '/administration/staff/:staffId/permissions',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

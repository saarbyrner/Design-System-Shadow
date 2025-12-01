// @flow
import { rest } from 'msw';

const response = {};
const handler = rest.post(
  '/administration/athletes/export_profile',
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };

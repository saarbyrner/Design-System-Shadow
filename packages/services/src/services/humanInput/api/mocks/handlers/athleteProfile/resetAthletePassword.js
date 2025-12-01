// @flow
import { rest } from 'msw';

const response = {};
const handler = rest.post(
  `/settings/athletes/:athleteId/user_details/reset_password`,
  (req, res, ctx) => res(ctx.json(response))
);

export { handler, response };

// @flow
import { rest } from 'msw';

const data = { message: 'OK' };

const handler = rest.put(
  '`/registration/registrations/:registration_id/sections/:id',
  (req, res, ctx) => res(ctx.status(data))
);

export { handler, data };

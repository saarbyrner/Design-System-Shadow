// @flow
import { rest } from 'msw';

const handler = rest.delete('/registration/payments/remove', (req, res, ctx) =>
  res(ctx.status(200))
);

export { handler };

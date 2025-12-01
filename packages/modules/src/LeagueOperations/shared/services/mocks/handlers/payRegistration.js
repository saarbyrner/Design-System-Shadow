// @flow
import { rest } from 'msw';

const handler = rest.post('/registration/payments/pay', (req, res, ctx) =>
  res(ctx.status(200))
);

export { handler };

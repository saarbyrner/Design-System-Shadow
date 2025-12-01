// @flow
import { rest } from 'msw';

const data = {};

const handler = rest.patch('/users/:userId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

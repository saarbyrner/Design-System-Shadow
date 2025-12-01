// @flow
import { rest } from 'msw';

const data = {};

const handler = rest.post('/notifications/send_email', (req, res, ctx) =>
  res(ctx.json(data))
);

export default handler;

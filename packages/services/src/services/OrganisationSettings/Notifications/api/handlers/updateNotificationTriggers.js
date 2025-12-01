// @flow
import { rest } from 'msw';

const data = {
  id: 1,
  area: 'event',
  type: 'on_create',
  description: 'New event creation',
  email: true,
  push: true,
  sms: false,
  enabled: true,
};

const handler = rest.put('/notification_triggers/:id', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

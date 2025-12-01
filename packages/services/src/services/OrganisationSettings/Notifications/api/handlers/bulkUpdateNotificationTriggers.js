// @flow
import { rest } from 'msw';

const data = {
  id: 1,
  area: 'event',
  type: 'on_create',
  description: 'New event creation',
  enabled: true,
};

const handler = rest.put(
  '/notification_triggers/bulk_update',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

import { rest } from 'msw';

const data = [{ sent_at: '2024-03-07T02:14:57.638Z' }];

const handler = rest.get(
  '/planning_hub/events/:eventId/athlete_notifications',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

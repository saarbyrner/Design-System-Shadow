import { rest } from 'msw';

const data = null;

const handler = rest.post(
  '/planning_hub/events/:eventId/athlete_events/update_attributes',
  (req, res, ctx) => res(ctx.status(200))
);

export { handler, data };

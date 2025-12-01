import { rest } from 'msw';

const handler = rest.patch(
  '/ui/planning_hub/events/:eventId/event_activities/:activityId',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;

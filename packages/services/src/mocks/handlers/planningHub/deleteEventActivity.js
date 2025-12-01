import { rest } from 'msw';

export const handler = rest.delete(
  '/ui/planning_hub/events/:eventId/event_activities/:eventActivityId',
  (req, res, ctx) => res(ctx.json({}))
);

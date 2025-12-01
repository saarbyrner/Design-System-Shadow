import { rest } from 'msw';

const data = null;

const handler = rest.post(
  '/ui/planning_hub/events/:eventId/game_periods/:periodId/v2/game_activities/bulk_save',
  (req, res, ctx) => res(ctx.status(200))
);

export { handler, data };

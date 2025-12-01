import { rest } from 'msw';

export const handler = rest.post(
  '/ui/planning_hub/event_activity_types/bulk_save',
  (req, res, ctx) => res(ctx.json({}))
);

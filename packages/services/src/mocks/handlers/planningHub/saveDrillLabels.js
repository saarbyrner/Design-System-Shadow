import { rest } from 'msw';

export const handler = rest.post(
  '/ui/planning_hub/event_activity_drill_labels/bulk_save',
  (req, res, ctx) => res(ctx.json({}))
);

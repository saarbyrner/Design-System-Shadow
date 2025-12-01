import { rest } from 'msw';

export const handler = rest.post(
  '/ui/planning_hub/principle_categories/bulk_save',
  (req, res, ctx) => res(ctx.json({}))
);

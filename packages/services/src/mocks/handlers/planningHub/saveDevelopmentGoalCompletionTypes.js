import { rest } from 'msw';

export const handler = rest.post(
  '/ui/planning_hub/development_goal_completion_types/bulk_save',
  (req, res, ctx) => res(ctx.json({}))
);

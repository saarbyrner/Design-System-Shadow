import { rest } from 'msw';

export const handler = rest.delete(
  '/ui/planning_hub/development_goals/:developmentGoalId',
  (req, res, ctx) => res(ctx.json({}))
);

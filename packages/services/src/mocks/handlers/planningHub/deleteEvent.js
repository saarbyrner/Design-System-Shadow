import { rest } from 'msw';

export const handler = rest.delete(
  '/planning_hub/events/:eventId',
  (req, res, ctx) => res(ctx.json({}))
);

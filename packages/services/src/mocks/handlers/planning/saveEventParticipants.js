import { rest } from 'msw';

const handler = rest.post(
  '/planning_hub/events/:eventId/participants',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;

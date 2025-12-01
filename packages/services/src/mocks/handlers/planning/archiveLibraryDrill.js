import { rest } from 'msw';

const handler = rest.post(
  '/planning_hub/event_activity_drills/:id/archive',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;

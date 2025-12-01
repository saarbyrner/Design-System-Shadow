import { rest } from 'msw';

const data = null;

const handler = rest.post(
  '/planning_hub/event_activity_drills',
  (req, res, ctx) => res(ctx.status(200))
);

export { handler, data };

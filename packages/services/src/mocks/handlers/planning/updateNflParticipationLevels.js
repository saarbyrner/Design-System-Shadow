import { rest } from 'msw';

const data = { status: 'success' };

const handler = rest.post(
  '/planning_hub/nfl_events/1/update_participation_levels',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

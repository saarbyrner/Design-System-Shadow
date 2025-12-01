import { rest } from 'msw';

const data = {};

const handler = rest.post(
  '/planning_hub/events/1/reset_report',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

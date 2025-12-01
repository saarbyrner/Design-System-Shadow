import { rest } from 'msw';

const data = {
  ok: false,
  activities_count: 2,
};

const handler = rest.get(
  '/ui/planning_hub/principles/:principleId/check_destruction',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

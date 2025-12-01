import { rest } from 'msw';

const data = true;

const handler = rest.patch(
  `/reporting/charts/:chartId/chart_elements/:chartElementId`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

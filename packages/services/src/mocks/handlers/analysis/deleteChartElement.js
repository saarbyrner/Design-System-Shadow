import { rest } from 'msw';

const handler = rest.delete(
  '/reporting/charts/:chartId/chart_elements/:chartElementId',
  (req, res, ctx) => res(ctx.status(200))
);

export default handler;

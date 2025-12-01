// @flow
import { rest } from 'msw';

const handler = rest.post('/planning_hub/kit_matrices', (req, res, ctx) =>
  res(ctx.status(201))
);

export default handler;

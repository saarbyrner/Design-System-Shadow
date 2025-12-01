// @flow
import { rest } from 'msw';

const handler = rest.patch(
  '/planning_hub/kit_matrices/:kit_matrix_id',
  (req, res, ctx) => res(ctx.status(204))
);

export default handler;

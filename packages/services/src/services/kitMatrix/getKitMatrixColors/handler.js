// @flow
import { rest } from 'msw';
import kitMatrixColors from './mock';

const handler = rest.get('/planning_hub/kit_matrix_colors', (req, res, ctx) =>
  res(ctx.json(kitMatrixColors))
);

export default handler;

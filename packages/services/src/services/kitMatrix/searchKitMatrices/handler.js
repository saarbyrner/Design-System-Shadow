// @flow
import { rest } from 'msw';
import mockData from './mock';

const handler = rest.post(
  '/planning_hub/kit_matrices/search',
  (req, res, ctx) => res(ctx.json(mockData))
);

export default handler;

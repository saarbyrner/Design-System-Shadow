// @flow
import { rest } from 'msw';
import data from './mock';

const handler = rest.post(
  '/ui/planning_hub/formation_position_views/bulk_save',
  (req, res, ctx) => res(ctx.json(data))
);

export default handler;

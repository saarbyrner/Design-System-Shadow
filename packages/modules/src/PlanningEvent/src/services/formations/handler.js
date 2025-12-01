// @flow
import { rest } from 'msw';
import data from './mock';

const handler = rest.get('/ui/planning_hub/formations', (req, res, ctx) =>
  res(ctx.json(data))
);

export default handler;

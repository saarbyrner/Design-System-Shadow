// @flow
import { rest } from 'msw';
import mockData from './mock';

const handler = rest.get('/planning_hub/participants', (req, res, ctx) => {
  return res(ctx.json(mockData));
});

export default handler;

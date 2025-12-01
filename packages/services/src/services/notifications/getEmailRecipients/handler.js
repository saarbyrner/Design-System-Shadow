// @flow
import { rest } from 'msw';
import dataMock from './mock';

const handler = rest.get(
  `/planning_hub/events/:id/recipients`,
  (req, res, ctx) => res(ctx.json(dataMock))
);

export default handler;

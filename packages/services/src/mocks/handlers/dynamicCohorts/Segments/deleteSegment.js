import { rest } from 'msw';
import baseSegmentsURL from '@kitman/services/src/services/dynamicCohorts/Segments/consts';

export const handler = rest.delete(`${baseSegmentsURL}/:id`, (req, res, ctx) =>
  res(ctx.json())
);

export default handler;

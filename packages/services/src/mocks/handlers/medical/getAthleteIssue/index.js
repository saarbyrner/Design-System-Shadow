// @flow
import { rest } from 'msw';
import data from './data.mock';

const handler = rest.get(
  '/athletes/:athleteId/injuries/:issueId',
  (req, res, ctx) => res(ctx.json(data.issue))
);

export { handler, data };

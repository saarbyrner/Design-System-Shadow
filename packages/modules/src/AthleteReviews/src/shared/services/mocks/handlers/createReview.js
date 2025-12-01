// @flow
import { rest } from 'msw';

const handler = rest.post(
  '/athletes/:athleteId/athlete_reviews',
  (req, res, ctx) => res(ctx.json({}))
);

export { handler };

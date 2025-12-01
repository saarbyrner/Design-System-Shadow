// @flow
import { rest } from 'msw';

import data from '../data/athlete_reviews';

const handler = rest.get(
  '/athletes/:athleteId/athlete_reviews/:reviewId',
  (req, res, ctx) => res(ctx.json({ event: data[0] }))
);

export { handler, data };

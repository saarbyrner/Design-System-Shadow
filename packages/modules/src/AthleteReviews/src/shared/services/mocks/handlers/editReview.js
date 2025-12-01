// @flow
import { rest } from 'msw';

import data from '../data/athlete_reviews';

const handler = rest.patch(
  '/athletes/:athleteId/athlete_reviews/:reviewId',
  (req, res, ctx) =>
    res(ctx.json({ event: { ...data[0], review_status: 'in_progress' } }))
);

export { handler, data };

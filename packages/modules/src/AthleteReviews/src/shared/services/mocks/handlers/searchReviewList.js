// @flow
import { rest } from 'msw';

import data from '../data/athlete_reviews';

const handler = rest.post(
  '/athletes/:athleteId/athlete_reviews/search',
  (req, res, ctx) => res(ctx.json({ events: data, next_id: null }))
);

export { handler, data };

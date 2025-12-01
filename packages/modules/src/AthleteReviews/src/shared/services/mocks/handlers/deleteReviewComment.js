// @flow
import { rest } from 'msw';

const handler = rest.delete(
  '/athletes/:athleteId/athlete_reviews/:reviewId/development_goal_comments/:comment_id',
  (req, res, ctx) => res(ctx.json({}))
);

export { handler };

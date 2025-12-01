// @flow
import { rest } from 'msw';

const data = {
  wellbeing: [],
  session: [],
};

const handler = rest.get(
  '/settings/athlete_push/non_compliant_athletes',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

// @flow
import { rest } from 'msw';

import data from '../data/mock_development_goal_types';

const handler = rest.get(
  '/ui/planning_hub/development_goal_types',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

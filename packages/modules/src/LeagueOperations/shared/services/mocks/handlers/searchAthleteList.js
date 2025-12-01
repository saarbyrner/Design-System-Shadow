// @flow
import { rest } from 'msw';

import { response } from '../data/mock_athlete_list';

const handler = rest.post('/registration/athletes/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

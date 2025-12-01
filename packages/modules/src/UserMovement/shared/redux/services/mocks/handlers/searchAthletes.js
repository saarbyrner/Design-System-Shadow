// @flow
import { rest } from 'msw';

import { response } from '../data/mock_search_athletes';

const handler = rest.post('/settings/athletes/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

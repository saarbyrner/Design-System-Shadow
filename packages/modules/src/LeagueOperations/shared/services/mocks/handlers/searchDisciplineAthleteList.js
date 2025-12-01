// @flow
import { rest } from 'msw';

import { response } from '../data/mock_search_discipline';

const handler = rest.post('/discipline/athletes/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

// @flow
import { rest } from 'msw';

import { response } from '../data/mock_search_discipline';

const handler = rest.post('/discipline/users/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

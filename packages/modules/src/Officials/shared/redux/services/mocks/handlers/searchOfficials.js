// @flow
import { rest } from 'msw';

import { response } from '../data/mock_official_list';

const handler = rest.post('/settings/officials/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

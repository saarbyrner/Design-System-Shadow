// @flow
import { rest } from 'msw';

import { response } from '../data/mock_scout_list';

const handler = rest.post('/settings/scouts/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

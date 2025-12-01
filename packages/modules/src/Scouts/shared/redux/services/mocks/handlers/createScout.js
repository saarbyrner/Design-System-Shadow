// @flow
import { rest } from 'msw';

import { data } from '../data/mock_scout_list';

const handler = rest.post('/settings/scouts', (req, res, ctx) =>
  res(ctx.json(data[0]))
);

export { handler, data };

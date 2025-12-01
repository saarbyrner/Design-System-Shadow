// @flow
import { rest } from 'msw';

import { data } from '../data/mock_rulesets_list';

const handler = rest.get('/conditional_fields/rulesets', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

// @flow
import { rest } from 'msw';

import { data } from '../data/mock_short_rulesets_list';

const handler = rest.get(
  '/conditional_fields/rulesets/injury_surveillance',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

// @flow
import { rest } from 'msw';

import { data } from '../data/mock_versions_list';

const handler = rest.get(
  `/conditional_fields/rulesets/${data.id}`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

// @flow
import { rest } from 'msw';

import { data } from '../data/mock_version';

const handler = rest.put(
  `/conditional_fields/rulesets/:ruleset_id/versions/:version_id`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

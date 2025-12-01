// @flow
import { rest } from 'msw';

import { data } from '../data/mock_version';

const handler = rest.get(
  `/conditional_fields/rulesets/${data.id}/versions/${data.version}`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

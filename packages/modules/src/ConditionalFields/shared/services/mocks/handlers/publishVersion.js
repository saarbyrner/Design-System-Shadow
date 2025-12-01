// @flow
import { rest } from 'msw';

import { data } from '../data/mock_version';

const handler = rest.patch(
  `/conditional_fields/rulesets/${data.id}/versions/${data.version}/publish`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

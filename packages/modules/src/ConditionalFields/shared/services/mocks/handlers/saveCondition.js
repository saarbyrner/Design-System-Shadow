// @flow
import { rest } from 'msw';

import { data } from '../data/mock_version';

const handler = rest.post(
  `/conditional_fields/rulesets/${data.id}/versions/${data.version}/conditions`,
  (req, res, ctx) => res(ctx.json(data.conditions[0]))
);

export { handler, data };

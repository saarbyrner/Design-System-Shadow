// @flow
import { rest } from 'msw';

const data = { message: 'Rule deleted' };
const handler = rest.delete(
  `/conditional_fields/rulesets/:ruleset_id/versions/:version_id/conditions/:condition_id`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

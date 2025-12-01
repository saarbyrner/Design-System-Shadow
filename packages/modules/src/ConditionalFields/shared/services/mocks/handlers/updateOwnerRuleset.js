import { rest } from 'msw';
import { data } from '../data/mock_ruleset_new-name';

const handler = rest.patch(
  `/conditional_fields/rulesets/:rulesetId`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

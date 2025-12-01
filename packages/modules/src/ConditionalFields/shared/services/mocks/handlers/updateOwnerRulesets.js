import { rest } from 'msw';
import { data } from '../data/mock_newly-created_ruleset';

const handler = rest.post(`/conditional_fields/rulesets`, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

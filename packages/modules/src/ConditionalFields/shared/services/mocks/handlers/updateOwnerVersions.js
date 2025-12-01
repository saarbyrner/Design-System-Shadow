import { rest } from 'msw';

const data = { message: 'Success' };

const handler = rest.post(
  `/conditional_fields/rulesets/12345/versions/bump`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

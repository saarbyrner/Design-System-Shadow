import { rest } from 'msw';

const data = {
  value: true,
};

const handler = rest.get(
  '/organisation_preferences/coaching_principles',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

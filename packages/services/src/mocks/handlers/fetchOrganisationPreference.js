import { rest } from 'msw';

const data = {
  value: true,
};

const handler = rest.get('/organisation_preferences/:key', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

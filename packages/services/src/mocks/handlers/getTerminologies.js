import { rest } from 'msw';

const data = [];
const handler = rest.get('/ui/terminologies', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

import { rest } from 'msw';

const data = [{ id: 1, name: 'KLS Next' }];

const handler = rest.post('/ui/associations/divisions', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

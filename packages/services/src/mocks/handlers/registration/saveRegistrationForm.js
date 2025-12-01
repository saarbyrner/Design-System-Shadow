import { rest } from 'msw';

const data = 'SUCCESS';
const handler = rest.get('/registration/requirements/save', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

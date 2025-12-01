import { rest } from 'msw';

const handler = rest.delete('/tags/:tagId', (req, res, ctx) =>
  res(ctx.status(200))
);

export default handler;

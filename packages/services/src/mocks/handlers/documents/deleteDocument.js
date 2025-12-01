import { rest } from 'msw';

export const handler = rest.delete('/documents/:documentId', (req, res, ctx) =>
  res(ctx.delay(1000), ctx.json({}))
);

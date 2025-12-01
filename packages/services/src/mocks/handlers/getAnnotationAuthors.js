import { rest } from 'msw';

const data = [{ id: 1, fullname: 'John Doe' }];

const handler = rest.get('/medical/notes/authors', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

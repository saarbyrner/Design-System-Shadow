import { rest } from 'msw';

const data = {};
const handler = rest.get(
  '/medical/athletes/1/notes/last_authored',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

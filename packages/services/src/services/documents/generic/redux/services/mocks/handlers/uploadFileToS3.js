// @flow
import { rest } from 'msw';

const handler = rest.post('https://s3:9000', (req, res, ctx) =>
  res(ctx.json({}))
);

export { handler };

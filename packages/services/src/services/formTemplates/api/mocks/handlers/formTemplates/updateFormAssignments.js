// @flow
import { rest } from 'msw';

const handler = rest.post('/forms/:formId/assignments', (req, res, ctx) =>
  res(ctx.status(200))
);

export { handler };

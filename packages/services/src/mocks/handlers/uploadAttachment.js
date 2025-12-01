// @flow
import { rest } from 'msw';

const data = { success: true, attachment_id: 123 };

const handler = rest.post('/attachments', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

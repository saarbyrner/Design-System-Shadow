import { rest } from 'msw';

const data = { message: 'Import job created' };
const handler = rest.post('/settings/mass_upload/create', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

import { rest } from 'msw';

const data = { download_scheduled: true };
const handler = rest.post(
  '/ui/medical/drfirst/download_medications',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };

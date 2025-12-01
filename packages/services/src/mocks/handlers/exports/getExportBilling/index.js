import { rest } from 'msw';
import data from './data.mock';

const handler = rest.get('/export_jobs', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

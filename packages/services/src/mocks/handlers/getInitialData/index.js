import { rest } from 'msw';
import data from './data.mock';

const handler = rest.get('/ui/initial_data', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

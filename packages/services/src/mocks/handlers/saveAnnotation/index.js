import { rest } from 'msw';
import data from './data.mock';

const handler = rest.post('/annotations', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

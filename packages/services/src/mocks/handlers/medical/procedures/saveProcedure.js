import { rest } from 'msw';
import data from './data.mock';

const handler = rest.post('/ui/medical/procedures', (req, res, ctx) =>
  res(ctx.json(data.procedures[0]))
);

export { handler, data };

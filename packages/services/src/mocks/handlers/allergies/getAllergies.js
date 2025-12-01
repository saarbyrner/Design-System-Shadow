import { rest } from 'msw';
import data from './data.mock';

const handler = rest.post('/ui/medical/allergies/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

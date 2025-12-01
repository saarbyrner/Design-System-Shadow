import { rest } from 'msw';
import { rehabGroups as data } from './data.mock';

const handler = rest.get('/tags', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };

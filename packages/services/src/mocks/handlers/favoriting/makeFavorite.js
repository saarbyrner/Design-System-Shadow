import { rest } from 'msw';
import { makeFavoriteData as data } from './data.mock';

const handler = rest.post('/user_favorites', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

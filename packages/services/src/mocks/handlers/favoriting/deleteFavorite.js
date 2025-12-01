import { rest } from 'msw';
import { deleteFavoriteData as data } from './data.mock';

const handler = rest.delete('/user_favorites', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

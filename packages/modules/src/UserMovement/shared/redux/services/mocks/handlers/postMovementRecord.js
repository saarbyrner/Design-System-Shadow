// @flow
import { rest } from 'msw';

import response from '../data/mock_post_user_movement';

const handler = rest.post('/user_movements', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

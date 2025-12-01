// @flow
import { rest } from 'msw';

import { response } from '../data/mock_user_list';

const handler = rest.post('/registration/users/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

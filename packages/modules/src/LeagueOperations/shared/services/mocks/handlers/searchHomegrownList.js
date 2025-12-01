// @flow
import { rest } from 'msw';

import { response } from '../data/mock_homegrown_list';

const handler = rest.post('/registration/homegrown/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

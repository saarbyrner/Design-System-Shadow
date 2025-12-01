// @flow
import { rest } from 'msw';

import { response } from '../data/mock_squad_list';

const handler = rest.post('/registration/squads/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

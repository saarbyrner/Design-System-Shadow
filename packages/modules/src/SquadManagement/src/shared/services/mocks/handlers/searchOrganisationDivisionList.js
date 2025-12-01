// @flow
import { rest } from 'msw';

import { response } from '../data/mock_division_list';

const handler = rest.get('/ui/squad_divisions', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

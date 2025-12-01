// @flow
import { rest } from 'msw';

import { data } from '../data/mock_squad_list';

const handler = rest.get(
  '/registration/squads/645235245664daf0f8fccc44',
  (req, res, ctx) => res(ctx.json(data[0]))
);

export { handler, data };

// @flow
import { rest } from 'msw';

import { response } from '../data/mock_squads_settings';

const handler = rest.get('/settings/squads', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

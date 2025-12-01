// @flow
import { rest } from 'msw';

import { data } from '../data/mock_fetch_import_creators';

const handler = rest.get('/ui/imports/creators', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

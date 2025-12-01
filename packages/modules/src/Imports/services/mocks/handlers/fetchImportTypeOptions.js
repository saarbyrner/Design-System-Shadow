// @flow
import { rest } from 'msw';

import { data } from '../data/mock_fetch_import_types';

const handler = rest.get('/ui/imports/import_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

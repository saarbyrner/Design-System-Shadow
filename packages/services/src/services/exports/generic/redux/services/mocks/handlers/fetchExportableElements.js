// @flow
import { rest } from 'msw';

import { data } from '@kitman/services/src/services/exports/generic/redux/services/mocks/data/fetchExportableElements';

const handler = rest.get('/ui/exports/exportable_elements', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

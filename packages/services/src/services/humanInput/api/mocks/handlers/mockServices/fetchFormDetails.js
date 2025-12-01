// @flow
import { rest } from 'msw';

import { data } from '@kitman/services/src/services/humanInput/api/mocks/data/mockServices/formDetailsData';

/**
 * URL subject to change yet
 */
const handler = rest.get('/human-input/forms/details/:id', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

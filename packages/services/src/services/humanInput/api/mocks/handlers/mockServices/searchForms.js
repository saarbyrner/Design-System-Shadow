// @flow
import { rest } from 'msw';

import { response } from '@kitman/services/src/services/humanInput/api/mocks/data/mockServices/assignedFormData';

/**
 * URL subject to change yet
 */
const handler = rest.post('/human-input/forms/search', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, response };

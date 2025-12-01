// @flow
import { rest } from 'msw';

import { integratedElementsOnly as data } from '@kitman/services/src/services/humanInput/api/mocks/data/formResultData';

/**
 * URL subject to change yet
 */
const handler = rest.get('/human-input/forms/results/:id', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };

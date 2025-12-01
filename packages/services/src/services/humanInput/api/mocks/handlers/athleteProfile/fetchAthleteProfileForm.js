// @flow
import { rest } from 'msw';

import { humanInputFormMockData as data } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';

/**
 * URL subject to change yet
 */
const handler = rest.get(
  '/athletes/:athleteId/profile/edit ',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
